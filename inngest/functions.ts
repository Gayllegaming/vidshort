import { inngest } from "./client";
import { s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db";
import { Projects, VideoShorts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deepgram } from "@/lib/deepgram";
import { geminiModel } from "@/lib/gemini";
import { AI_CONFIG } from "@/config/ai";
import arcjet, { detectPromptInjection } from "@arcjet/next";
import { REMOTION_CONFIG } from "@/lib/remotion";

const ajPrompt = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  characteristics: ["userId"],
  rules: [detectPromptInjection({ mode: "LIVE" })],
});

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    triggers: [{ event: "video/process" }],
  },
  async ({ event, step }) => {
    // =========================
    // EVENT DATA
    // =========================
    const { projectId, s3Key, contentType, fileName } =
      event.data as {
        projectId: string;
        s3Key: string;
        contentType: string;
        fileName: string;
      };

    if (!projectId || !s3Key) {
      throw new Error("Missing projectId or s3Key");
    }

    console.log("PROCESSING VIDEO");
    console.log({
      projectId,
      s3Key,
      contentType,
      fileName,
    });

    // =========================
    // VERIFY VIDEO EXISTS IN S3
    // =========================
    await step.run("verify-s3-video", async () => {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;

      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not defined");
      }

      try {
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
        });

        await s3Client.send(command);

        console.log("S3 VIDEO VERIFIED");
      } catch (error) {
        console.error("S3 VERIFY ERROR:", error);

        throw new Error("Uploaded video not found in S3");
      }
    });

    // =========================
    // UPDATE STATUS
    // =========================
    await step.run("update-status-uploaded", async () => {
      await db
        .update(Projects)
        .set({
          status: "uploaded",
          progress: 10,
        })
        .where(eq(Projects.projectId, projectId));
    });

    // =========================
    // GENERATE SIGNED URL
    // =========================
    const videoUrl = await step.run(
      "generate-video-url",
      async () => {
        const bucketName =
          process.env.AWS_S3_BUCKET_NAME;

        if (!bucketName) {
          throw new Error(
            "AWS_S3_BUCKET_NAME is not defined"
          );
        }

        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
        });

        const signedUrl = await getSignedUrl(
          s3Client,
          command,
          {
            expiresIn: 3600,
          }
        );

        console.log("SIGNED URL GENERATED");

        return signedUrl;
      }
    );

    // =========================
    // SAVE VIDEO URL
    // =========================
    await step.run("save-video-url", async () => {
      await db
        .update(Projects)
        .set({
          videoUrl,
          status: "video-ready",
          progress: 30,
        })
        .where(eq(Projects.projectId, projectId));
    });

    // =========================
    // VERIFY URL ACCESSIBLE
    // =========================
    await step.run("verify-video-url", async () => {
      try {
        const response = await fetch(videoUrl, {
          method: "HEAD",
        });

        console.log(
          "VIDEO URL STATUS:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `Video URL inaccessible: ${response.status}`
          );
        }
      } catch (error) {
        console.error(
          "VIDEO URL VERIFICATION FAILED:",
          error
        );

        throw error;
      }
    });

    // =========================
    // UPDATE STATUS
    // =========================
    await step.run(
      "update-status-transcribing",
      async () => {
        await db
          .update(Projects)
          .set({
            status: "transcribing",
            progress: 50,
          })
          .where(eq(Projects.projectId, projectId));
      }
    );

    // =========================
    // TRANSCRIBE VIDEO
    // =========================
    const transcriptionData = (await step.run(
      "transcribe-video",
      async () => {
        try {
          console.log(
            "STARTING DEEPGRAM TRANSCRIPTION"
          );

          const response =
            await deepgram.listen.v1.media.transcribeUrl({
              url: videoUrl,
              smart_format: true,
              model: "nova-2",
              detect_language: true,
              utterances: true,
              paragraphs: true,
            });

          if (!response) {
            throw new Error(
              "Deepgram returned empty response"
            );
          }

          const result =
            (response as any).result ||
            (response as any).data ||
            response;

          if (!result.results) {
            console.error(
              "DEEPGRAM FULL RESPONSE:",
              JSON.stringify(response, null, 2)
            );

            throw new Error(
              "Deepgram response missing results"
            );
          }

          const transcription =
            result.results.channels?.[0]
              ?.alternatives?.[0]?.transcript || "";

          const words =
            result.results.channels?.[0]
              ?.alternatives?.[0]?.words || [];

          console.log(
            "TRANSCRIPTION SUCCESS:",
            transcription.length
          );

          return {
            transcription,
            captions: JSON.stringify(words),
          };
        } catch (error: any) {
          console.error(
            "DEEPGRAM ERROR:",
            error
          );

          throw new Error(
            error?.message ||
              "Deepgram transcription failed"
          );
        }
      }
    )) as {
      transcription: string;
      captions: string;
    };

    // =========================
    // SAVE TRANSCRIPTION
    // =========================
    await step.run(
      "save-transcription",
      async () => {
        await db
          .update(Projects)
          .set({
            transcription:
              transcriptionData.transcription,
            captions: transcriptionData.captions,
            status: "transcription-completed",
            progress: 70,
          })
          .where(eq(Projects.projectId, projectId));
      }
    );

    // =========================
    // GENERATE AI SHORTS
    // =========================
    await step.run(
      "generate-ai-shorts",
      async () => {
        if (
          !transcriptionData.transcription ||
          transcriptionData.transcription.length === 0
        ) {
          console.warn(
            "EMPTY TRANSCRIPTION - SKIPPING AI"
          );

          return;
        }

        console.log(
          "CHECKING PROMPT INJECTION"
        );

        const req = new Request(
          "https://localhost",
          {
            headers: {
              "x-forwarded-for": "127.0.0.1",
            },
          }
        );

        const decision = await ajPrompt.protect(
          req,
          {
            userId: projectId,
            detectPromptInjectionMessage:
              transcriptionData.transcription,
          }
        );

        if (decision.isDenied()) {
          await db
            .update(Projects)
            .set({
              status: "error",
              progress: 0,
            })
            .where(eq(Projects.projectId, projectId));

          throw new Error(
            "Prompt injection detected"
          );
        }

        await db
          .update(Projects)
          .set({
            status: "generating-shorts",
            progress: 80,
          })
          .where(eq(Projects.projectId, projectId));

        const prompt = `
You are an expert viral short-form video editor.

Analyze this transcript and identify the ${
          AI_CONFIG.maxShorts
        } best viral moments.

Each clip must be between ${
          AI_CONFIG.minDuration
        } and ${AI_CONFIG.maxDuration} seconds.

Return ONLY valid JSON array.

Format:
[
  {
    "startTime": number,
    "endTime": number,
    "reason": string,
    "seoScore": number
  }
]

Transcript:
${transcriptionData.transcription}
`;

        try {
          const result =
            await geminiModel.generateContent(
              prompt
            );

          const response = await result.response;

          let aiText = response.text();

          aiText = aiText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          const shortsSegments =
            JSON.parse(aiText);

          console.log(
            "AI SHORTS GENERATED:",
            shortsSegments.length
          );

          let fullCaptions: any[] = [];

          try {
            fullCaptions = JSON.parse(
              transcriptionData.captions || "[]"
            );
          } catch (error) {
            console.warn(
              "CAPTION PARSE FAILED"
            );
          }

          for (const segment of shortsSegments) {
            const segmentCaptions =
              fullCaptions.filter(
                (word: any) =>
                  word.end >= segment.startTime &&
                  word.start <= segment.endTime
              );

            await db.insert(VideoShorts).values({
              projectId,
              startTime: segment.startTime,
              endTime: segment.endTime,
              reason: segment.reason,
              seoScore: segment.seoScore,
              captions: JSON.stringify(
                segmentCaptions
              ),
            });
          }

          await db
            .update(Projects)
            .set({
              status: "shorts-generated",
              progress: 95,
            })
            .where(eq(Projects.projectId, projectId));
        } catch (error: any) {
          console.error(
            "GEMINI ERROR:",
            error
          );

          throw new Error(
            error?.message ||
              "AI short generation failed"
          );
        }
      }
    );

    // =========================
    // FINALIZE
    // =========================
    await step.run("finalize-project", async () => {
      await db
        .update(Projects)
        .set({
          status: "completed",
          progress: 100,
        })
        .where(eq(Projects.projectId, projectId));
    });

    return {
      success: true,
      videoUrl,
      transcription:
        transcriptionData.transcription,
    };
  }
);
