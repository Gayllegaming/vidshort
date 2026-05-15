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

/* =========================================================
   PROCESS VIDEO FUNCTION
========================================================= */

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    triggers: [{ event: "video/process" }],
  },
  async ({ event, step }) => {
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

    // VERIFY FILE EXISTS
    await step.run("verify-s3-video", async () => {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;

      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME missing");
      }

      try {
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
        });

        await s3Client.send(command);

        console.log("S3 VIDEO VERIFIED");
      } catch (error) {
        console.error(error);
        throw new Error("Video not found in S3");
      }
    });

    // UPDATE STATUS
    await step.run("update-status-uploaded", async () => {
      await db
        .update(Projects)
        .set({
          status: "uploaded",
          progress: 10,
        })
        .where(eq(Projects.projectId, projectId));
    });

    // GENERATE SIGNED URL
    const videoUrl = await step.run(
      "generate-video-url",
      async () => {
        const bucketName =
          process.env.AWS_S3_BUCKET_NAME;

        if (!bucketName) {
          throw new Error(
            "AWS_S3_BUCKET_NAME missing"
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

        return signedUrl;
      }
    );

    // SAVE VIDEO URL
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

    // VERIFY ACCESSIBLE
    await step.run("verify-video-url", async () => {
      const response = await fetch(videoUrl, {
        method: "HEAD",
      });

      if (!response.ok) {
        throw new Error(
          `Video inaccessible: ${response.status}`
        );
      }
    });

    // TRANSCRIBING
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

    // TRANSCRIPTION
    const transcriptionData = (await step.run(
      "transcribe-video",
      async () => {
        try {
          const response =
            await deepgram.listen.v1.media.transcribeUrl({
              url: videoUrl,
              smart_format: true,
              model: "nova-2",
              detect_language: true,
              utterances: true,
              paragraphs: true,
            });

          const result =
            (response as any).result ||
            (response as any).data ||
            response;

          if (!result.results) {
            throw new Error(
              "Deepgram results missing"
            );
          }

          const transcription =
            result.results.channels?.[0]
              ?.alternatives?.[0]?.transcript || "";

          const words =
            result.results.channels?.[0]
              ?.alternatives?.[0]?.words || [];

          return {
            transcription,
            captions: JSON.stringify(words),
          };
        } catch (error: any) {
          console.error(error);

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

    // SAVE TRANSCRIPTION
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

    // GENERATE AI SHORTS
    await step.run(
      "generate-ai-shorts",
      async () => {
        if (
          !transcriptionData.transcription ||
          transcriptionData.transcription.length === 0
        ) {
          return;
        }

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
Analyze this transcript and find the ${
          AI_CONFIG.maxShorts
        } best viral moments.

Each clip must be between ${
          AI_CONFIG.minDuration
        } and ${AI_CONFIG.maxDuration} seconds.

Return ONLY JSON array:

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

        let fullCaptions: any[] = [];

        try {
          fullCaptions = JSON.parse(
            transcriptionData.captions || "[]"
          );
        } catch {}

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
      }
    );

    // FINALIZE
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
    };
  }
);

/* =========================================================
   RENDER VIDEO FUNCTION
========================================================= */

export const renderVideo = inngest.createFunction(
  {
    id: "render-video",
    triggers: [{ event: "video/render" }],
  },
  async ({ event, step }) => {
    const { shortId, projectId } = event.data as {
      shortId: number;
      projectId: string;
    };

    const short = await step.run(
      "get-short-details",
      async () => {
        const result = await db
          .select()
          .from(VideoShorts)
          .where(eq(VideoShorts.id, shortId))
          .limit(1);

        return result[0];
      }
    );

    if (!short) {
      throw new Error("Short not found");
    }

    const project = await step.run(
      "get-project-details",
      async () => {
        const result = await db
          .select()
          .from(Projects)
          .where(eq(Projects.projectId, projectId))
          .limit(1);

        return result[0];
      }
    );

    if (!project?.videoUrl) {
      throw new Error("Project video missing");
    }

    // UPDATE STATUS
    await step.run(
      "update-render-status",
      async () => {
        await db
          .update(VideoShorts)
          .set({
            status: "rendering",
            progress: 10,
          })
          .where(eq(VideoShorts.id, shortId));
      }
    );

    // REMOTION RENDER
    const renderResult = (await step.run(
      "trigger-remotion-render",
      async () => {
        const { renderVideoOnLambda } =
          await import("@remotion/lambda/client");

        const fps = REMOTION_CONFIG.FPS;

        const durationInFrames = Math.ceil(
          (short.endTime - short.startTime) *
            fps
        );

        const {
          renderId,
          bucketName: s3BucketName,
        } = await renderVideoOnLambda({
          region: REMOTION_CONFIG.REGION,
          functionName:
            REMOTION_CONFIG.FUNCTION_NAME,
          composition:
            REMOTION_CONFIG.COMPOSITION_ID,
          serveUrl: REMOTION_CONFIG.SERVE_URL,
          codec: "h264",
          privacy: "public",
          forceDurationInFrames:
            durationInFrames,

          inputProps: {
            videoUrl: project.videoUrl,
            startTime: short.startTime,
            endTime: short.endTime,
            captions: short.captions,
            captionStyle: short.captionStyle
              ? JSON.parse(short.captionStyle)
              : {},
          },
        });

        return {
          renderId,
          bucketName: s3BucketName,
          region: REMOTION_CONFIG.REGION,
        };
      }
    )) as any;

    // POLL STATUS
    let done = false;
    let attempts = 0;

    while (!done && attempts < 60) {
      attempts++;

      const status = (await step.run(
        `check-render-${attempts}`,
        async () => {
          const { getRenderProgress } =
            await import(
              "@remotion/lambda/client"
            );

          return await getRenderProgress({
            renderId: renderResult.renderId,
            bucketName:
              renderResult.bucketName,
            functionName:
              REMOTION_CONFIG.FUNCTION_NAME,
            region: renderResult.region,
          });
        }
      )) as any;

      if (status.fatalErrorEncountered) {
        await db
          .update(VideoShorts)
          .set({
            status: "error",
            progress: 0,
          })
          .where(eq(VideoShorts.id, shortId));

        throw new Error(
          status.errors?.[0]?.message ||
            "Render failed"
        );
      }

      if (status.done) {
        done = true;

        await step.run(
          "finalize-render",
          async () => {
            await db
              .update(VideoShorts)
              .set({
                status: "completed",
                progress: 100,
                videoUrl:
                  status.outputFile || null,
              })
              .where(
                eq(VideoShorts.id, shortId)
              );
          }
        );
      } else {
        await step.run(
          `update-progress-${attempts}`,
          async () => {
            await db
              .update(VideoShorts)
              .set({
                progress: Math.round(
                  status.overallProgress * 100
                ),
              })
              .where(
                eq(VideoShorts.id, shortId)
              );
          }
        );

        await step.sleep(
          `wait-${attempts}`,
          "10s"
        );
      }
    }

    if (!done) {
      await db
        .update(VideoShorts)
        .set({
          status: "error",
        })
        .where(eq(VideoShorts.id, shortId));

      throw new Error("Render timeout");
    }

    return {
      success: true,
    };
  }
);
