import { inngest } from "./client";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db";
import { Projects, VideoShorts } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import { deepgram } from "@/lib/deepgram";
import { geminiModel } from "@/lib/gemini";
import { AI_CONFIG } from "@/config/ai";
import arcjet, { detectPromptInjection } from "@arcjet/next";
import { REMOTION_CONFIG } from "@/lib/remotion";

const ajPrompt = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  characteristics: ["userId"],
  rules: [
    detectPromptInjection({ mode: "LIVE" }),
  ],
});

export const processVideo = inngest.createFunction(
  { id: "process-video", triggers: [{ event: "video/process" }] },
  async ({ event, step }) => {
    const { projectId, filePath, contentType, fileName } = event.data as {
      projectId: string;
      filePath: string;
      contentType: string;
      fileName: string;
    };

    const s3Key = event.data.s3Key || `projects/${projectId}/${fileName}`;

    await step.run("upload-to-s3", async () => {
      if (!filePath) {
        console.log("No local filePath provided, assuming file is already in S3 at:", s3Key);
        return { s3Key };
      }

      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not defined");
      }

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
      }

      // Read file from temporary storage
      const buffer = fs.readFileSync(filePath);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType,
      });

      await s3Client.send(command);
      return { s3Key };
    });

    await step.run("update-status-uploading", async () => {
      await db.update(Projects)
        .set({ status: "uploading", progress: 10 })
        .where(eq(Projects.projectId, projectId));
    });

    const videoUrl = await step.run("get-video-url", async () => {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;

      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME is not defined");
      }

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log("Generated Signed Video URL:", signedUrl);
      return signedUrl;
    });

    await step.run("update-status-completed", async () => {
      await db.update(Projects)
        .set({
          videoUrl: videoUrl,
          status: "upload-completed",
          progress: 40
        })
        .where(eq(Projects.projectId, projectId));
    });

    await step.run("verify-video-url", async () => {
      try {
        const response = await fetch(videoUrl, { method: "HEAD" });
        if (!response.ok) {
          console.warn(`S3 URL check returned status: ${response.status}. This might prevent the video from playing in the browser, but we will proceed with transcription using the local file.`);
        } else {
          console.log("S3 Video URL verified successfully");
        }
      } catch (err: any) {
        console.warn(`S3 URL check failed: ${err.message}. Proceeding with local transcription...`);
      }
    });

    await step.run("update-status-transcribing", async () => {
      await db.update(Projects)
        .set({ status: "transcribing", progress: 50 })
        .where(eq(Projects.projectId, projectId));
    });

    const transcriptionData = (await step.run("transcribe-video-v2", async () => {
      try {
        console.log(`Transcribing video from URL: ${videoUrl}`);

        const response = await deepgram.listen.v1.media.transcribeUrl({
          url: videoUrl,
          smart_format: true,
          model: "nova-2",
          detect_language: true,
          utterances: true,
          paragraphs: true,
        });

        if (!response) {
          throw new Error("Deepgram transcription response is empty (null or undefined)");
        }

        // In v5 SDK, the response should be the result directly.
        // But let's be safe and check for common wrappers from previous versions or other SDKs.
        const result = (response as any).result || (response as any).data || response;

        console.log("Deepgram result keys:", Object.keys(result));

        if (!result.results) {
          console.error("Deepgram Full Response:", JSON.stringify(response, null, 2));
          throw new Error("Deepgram transcription result is missing 'results' field");
        }

        const alternative = result.results.channels?.[0]?.alternatives?.[0];
        const transcription = alternative?.transcript ?? "";

        const words = result.results.channels?.[0]?.alternatives?.[0]?.words || [];
        const captions = JSON.stringify(words);

        console.log("Transcription successful, length:", transcription.length);
        console.log("Transcription Content:", transcription.substring(0, 500) + (transcription.length > 500 ? "..." : ""));

        return {
          transcription: transcription || "",
          captions: captions || "[]"
        };
      } catch (error: any) {
        console.error("Deepgram Transcription Error:", error);
        // Include more details if available
        const errorDetail = error.response?.data || error.message || "Unknown error";
        throw new Error(`Deepgram transcription failed: ${JSON.stringify(errorDetail)}`);
      }
    })) as { transcription: string, captions: string };


    console.log("Transcription Step Finished. Data length in main function:", transcriptionData?.transcription?.length);
    console.log("Captions data length in main function:", transcriptionData?.captions?.length);

    await step.run("save-transcription", async () => {
      if (!transcriptionData || transcriptionData.transcription === undefined) {
        console.error("No transcription data to save!");
        throw new Error("Missing transcription data in save-transcription step");
      }

      console.log(`Saving transcription to DB for project ${projectId}. Length: ${transcriptionData.transcription.length}`);

      const result = await db.update(Projects)
        .set({
          transcription: transcriptionData.transcription,
          captions: transcriptionData.captions,
          status: "transcription-saved",
          progress: 60
        })
        .where(eq(Projects.projectId, projectId));

      console.log("DB Update Result:", result);
    });

    await step.run("generate-shorts-ai", async () => {
      if (!transcriptionData || !transcriptionData.transcription || transcriptionData.transcription.length === 0) {
        console.warn("Skipping short generation because transcription is empty.");
        return;
      }

      // Check for prompt injection in the transcription before sending to Gemini
      console.log("Checking for prompt injection...");
      const req = new Request("https://localhost", { headers: { "x-forwarded-for": "127.0.0.1" } });
      const decision = await ajPrompt.protect(req, {
        userId: projectId,
        detectPromptInjectionMessage: transcriptionData.transcription
      });

      if (decision.isDenied()) {
        console.warn("Prompt injection detected in the transcribed video text. Blocking request.");
        await db.update(Projects)
          .set({ status: "error", progress: 0 })
          .where(eq(Projects.projectId, projectId));
        throw new Error("Malicious prompt injection detected in video transcription.");
      }

      await db.update(Projects)
        .set({ status: "generating-shorts", progress: 70 })
        .where(eq(Projects.projectId, projectId));

      console.log("Analyzing transcription for viral moments...");

      const prompt = `You are an expert video editor and viral content creator. 
Analyze the following video transcription and find the ${AI_CONFIG.maxShorts} most engaging, valuable, or entertaining moments to create short-form videos (like TikToks, YouTube Shorts, or Reels).
Each short MUST be between ${AI_CONFIG.minDuration} and ${AI_CONFIG.maxDuration} seconds long.

Return ONLY a valid JSON array of objects. Do not wrap it in markdown block quotes. Each object must have exactly these keys:
- "startTime": the start time in seconds (number)
- "endTime": the end time in seconds (number)
- "reason": a short explanation of why this moment is highly engaging or viral (string)
- "seoScore": a score out of 100 representing its potential for SEO and virality (number)

Transcription text:
${transcriptionData.transcription}
`;

      try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        let aiText = response.text();

        // Clean up markdown wrapping if Gemini returns it
        aiText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();

        const shortsSegments = JSON.parse(aiText);
        console.log(`AI identified ${shortsSegments.length} potential shorts.`);

        let fullCaptions: any[] = [];
        try {
          fullCaptions = JSON.parse(transcriptionData.captions || "[]");
        } catch (e) {
          console.warn("Failed to parse captions for segments");
        }

        // Save each generated short to the database
        for (const segment of shortsSegments) {
          // Extract specific captions for this segment
          // We include words that overlap with the segment (end > startTime AND start < endTime)
          const segmentCaptions = fullCaptions.filter((word: any) =>
            word.end >= segment.startTime && word.start <= segment.endTime
          );

          console.log(`Short segment [${segment.startTime}s - ${segment.endTime}s]: Filtered ${segmentCaptions.length} words from total ${fullCaptions.length}`);

          await db.insert(VideoShorts).values({
            projectId: projectId,
            startTime: segment.startTime,
            endTime: segment.endTime,
            reason: segment.reason,
            seoScore: segment.seoScore,
            captions: JSON.stringify(segmentCaptions),
          });
        }

        await db.update(Projects)
          .set({ status: "shorts-generated", progress: 90 })
          .where(eq(Projects.projectId, projectId));

      } catch (error: any) {
        console.error("AI Generation Error:", error);
        throw new Error(`Failed to generate shorts with AI: ${error.message}`);
      }
    });

    await step.run("cleanup-temp-file", async () => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Temporary file cleaned up:", filePath);
        }
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    });

    await step.run("finalize-project", async () => {
      await db.update(Projects)
        .set({ status: "completed", progress: 100 })
        .where(eq(Projects.projectId, projectId));
    });

    return { videoUrl, transcription: transcriptionData.transcription };
  }
);

export const renderVideo = inngest.createFunction(
  { id: "render-video", triggers: [{ event: "video/render" }] },
  async ({ event, step }) => {
    const { shortId, projectId } = event.data as { shortId: number, projectId: string };

    const short = await step.run("get-short-details", async () => {
      const result = await db.select().from(VideoShorts).where(eq(VideoShorts.id, shortId)).limit(1);
      return result[0];
    });

    if (!short) throw new Error("Short not found");

    const project = await step.run("get-project-details", async () => {
      const result = await db.select().from(Projects).where(eq(Projects.projectId, projectId)).limit(1);
      return result[0];
    });

    if (!project || !project.videoUrl) throw new Error("Project or Video URL not found");

    await step.run("update-status-rendering", async () => {
      await db.update(VideoShorts)
        .set({ status: "rendering", progress: 5 })
        .where(eq(VideoShorts.id, shortId));
    });

    // Remotion Lambda Rendering
    // In a real scenario, we would use @remotion/lambda
    // Here we'll simulate the process or call the lambda if configured
    const renderResult = (await step.run("trigger-remotion-render", async () => {
      const { renderVideoOnLambda } = await import("@remotion/lambda/client");

      const fps = REMOTION_CONFIG.FPS;
      const durationInFrames = Math.ceil((short.endTime - short.startTime) * fps);


      const { renderId, bucketName: s3BucketName } = await renderVideoOnLambda({
        region: REMOTION_CONFIG.REGION,
        functionName: REMOTION_CONFIG.FUNCTION_NAME,
        composition: REMOTION_CONFIG.COMPOSITION_ID,
        inputProps: {
          videoUrl: project.videoUrl,
          startTime: short.startTime,
          endTime: short.endTime,
          captions: short.captions,
          captionStyle: short.captionStyle ? JSON.parse(short.captionStyle) : {}
        },
        codec: "h264",
        serveUrl: REMOTION_CONFIG.SERVE_URL,
        privacy: "public",
        forceDurationInFrames: durationInFrames,
        concurrencyPerLambda: 1,
        framesPerLambda: 240,
      });

      return { renderId, bucketName: s3BucketName, region: REMOTION_CONFIG.REGION };
    })) as any;


    // Polling for progress
    let isDone = false;
    let attempts = 0;
    while (!isDone && attempts < 60) { // Max 10 minutes (60 * 10s)
      attempts++;

      const status = (await step.run(`check-render-status-${attempts}`, async () => {
        const { getRenderProgress } = await import("@remotion/lambda/client");
        return await getRenderProgress({
          renderId: renderResult.renderId,
          bucketName: renderResult.bucketName,
          region: renderResult.region as any,
          functionName: REMOTION_CONFIG.FUNCTION_NAME,
        });
      })) as any;


      if (status.fatalErrorEncountered) {
        await db.update(VideoShorts)
          .set({ status: "error", progress: 0 })
          .where(eq(VideoShorts.id, shortId));
        throw new Error(`Render failed: ${status.errors[0]?.message}`);
      }

      if (status.done) {
        isDone = true;
        await step.run("finalize-render", async () => {
          await db.update(VideoShorts)
            .set({
              status: "completed",
              progress: 100,
              videoUrl: status.outputFile || null
            })
            .where(eq(VideoShorts.id, shortId));
        });
      } else {
        await step.run(`update-progress-${attempts}`, async () => {
          await db.update(VideoShorts)
            .set({ progress: Math.round(status.overallProgress * 100) })
            .where(eq(VideoShorts.id, shortId));
        });
        await step.sleep("wait-for-render", "10s");
      }
    }

    if (!isDone) {
      await db.update(VideoShorts)
        .set({ status: "error" })
        .where(eq(VideoShorts.id, shortId));
      throw new Error("Render timed out");
    }

    return { success: true, videoUrl: short.videoUrl };
  }
);

