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
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "1d",
      max: 50,
    }),
    shield({
      mode: "LIVE",
    }),
  ],
});

export async function POST(req: Request) {
  console.log("UPLOAD API HIT");

  try {
    // USER AUTH
    const user = await currentUser();

    if (!user) {
      console.log("NO USER");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // SAFE JSON PARSE
    let body;

    try {
      body = await req.json();
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);

      return NextResponse.json(
        {
          error:
            "Invalid request body. Send JSON only, not FormData.",
        },
        { status: 400 }
      );
    }

    console.log("BODY:", body);

    const {
      fileName,
      contentType,
      projectId: existingProjectId,
      complete,
    } = body;

    // =========================
    // STEP 2 - UPLOAD COMPLETE
    // =========================
    if (complete && existingProjectId) {
      console.log("UPLOAD COMPLETE FLOW");

      const s3Key = `projects/${existingProjectId}/${fileName}`;

      await db
        .update(Projects)
        .set({
          status: "uploaded",
        })
        .where(eq(Projects.projectId, existingProjectId));

      console.log("SENDING INNGEST EVENT");

      await inngest.send({
        name: "video/process",
        data: {
          projectId: existingProjectId,
          s3Key,
          contentType,
          fileName,
        },
      });

      console.log("INNGEST EVENT SENT");

      return NextResponse.json({
        success: true,
      });
    }

    // =========================
    // STEP 1 - VALIDATION
    // =========================
    if (!fileName || !contentType) {
      return NextResponse.json(
        {
          error: "Missing fileName or contentType",
        },
        { status: 400 }
      );
    }

    // =========================
    // ARCJET PROTECTION
    // =========================
    try {
      const decision = await aj.protect(req, {
        userId: user.id,
      });

      if (decision.isDenied()) {
        console.log("ARCJET BLOCKED REQUEST");

        return NextResponse.json(
          {
            error: "Too many uploads or suspicious activity",
          },
          { status: 403 }
        );
      }
    } catch (arcjetError) {
      console.error("ARCJET ERROR:", arcjetError);

      // Continue even if Arcjet fails
    }

    // =========================
    // CREATE PROJECT
    // =========================
    const projectId = crypto.randomUUID();

    const s3Key = `projects/${projectId}/${fileName}`;

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      console.error("AWS BUCKET ENV MISSING");

      return NextResponse.json(
        {
          error: "AWS bucket not configured",
        },
        { status: 500 }
      );
    }

    // =========================
    // CREATE PRESIGNED URL
    // =========================
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(
      s3Client,
      command,
      {
        expiresIn: 3600,
      }
    );

    console.log("PRESIGNED URL CREATED");

    // =========================
    // SAVE PROJECT
    // =========================
    await db.insert(Projects).values({
      projectId,
      createdBy: user.id,
      status: "pending",
      progress: 0,
    });

    console.log("PROJECT SAVED");

    // =========================
    // RETURN RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      projectId,
      presignedUrl,
      s3Key,
    });
  } catch (error: any) {
    console.error("UPLOAD API ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
