import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Projects } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import arcjet, { fixedWindow, shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  characteristics: ["userId"],
  rules: [
    // Rate Limiting: Max 5 videos per day per user
    fixedWindow({
      mode: "LIVE",
      window: "1d",
      max: 50,
    }),
    // AI Endpoint Abuse Protection (Bot protection)
    shield({ mode: "LIVE" }),
  ],
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fileName, contentType, projectId: existingProjectId, complete } = body;

    // STEP 2: Handle upload completion
    if (complete && existingProjectId) {
      const s3Key = `projects/${existingProjectId}/${fileName}`;
      
      await db.update(Projects)
        .set({ status: "uploaded" })
        .where(eq(Projects.projectId, existingProjectId));

      await inngest.send({
        name: "video/process",
        data: {
          projectId: existingProjectId,
          s3Key,
          contentType,
          fileName,
        },
      });

      return NextResponse.json({ success: true });
    }

    // STEP 1: Generate Presigned URL
    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing file info" }, { status: 400 });
    }

    // Protect endpoint with Arcjet (only for step 1)
    const decision = await aj.protect(req, { userId: user.id });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const projectId = Math.random().toString(36).substring(2, 15);
    const s3Key = `projects/${projectId}/${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error("AWS_S3_BUCKET_NAME is not defined");
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    await db.insert(Projects).values({
      projectId,
      createdBy: user.id,
      status: "pending",
      progress: 0,
    });

    return NextResponse.json({ projectId, presignedUrl, s3Key, success: true });
  } catch (error: any) {
    console.error("[Upload API Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
