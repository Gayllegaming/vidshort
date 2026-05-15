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
  try {
    // =========================
    // AUTH
    // =========================
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // BODY
    // =========================
    const body = await req.json();

    const {
      fileName,
      contentType,
      projectId: existingProjectId,
      complete,
    } = body;

    console.log("UPLOAD API HIT");
    console.log(body);

    // =====================================================
    // STEP 2 → AFTER S3 UPLOAD COMPLETE
    // =====================================================
    if (complete && existingProjectId) {
      console.log("UPLOAD COMPLETED");

      const s3Key = `projects/${existingProjectId}/${fileName}`;

      console.log("PROJECT ID:", existingProjectId);
      console.log("S3 KEY:", s3Key);

      // UPDATE PROJECT STATUS
      await db
        .update(Projects)
        .set({
          status: "uploaded",
          progress: 5,
        })
        .where(
          eq(
            Projects.projectId,
            existingProjectId
          )
        );

      // =========================================
      // TRIGGER INNGEST
      // =========================================
      console.log("TRIGGERING INNGEST");

      const inngestResult = await inngest.send({
        name: "video/process",

        data: {
          projectId: existingProjectId,
          s3Key,
          contentType,
          fileName,
        },
      });

      console.log("INNGEST RESPONSE:");
      console.log(inngestResult);

      return NextResponse.json({
        success: true,
        triggered: true,
        inngestResult,
      });
    }

    // =====================================================
    // STEP 1 → GENERATE PRESIGNED URL
    // =====================================================

    if (!fileName || !contentType) {
      return NextResponse.json(
        {
          error: "Missing file info",
        },
        {
          status: 400,
        }
      );
    }

    // RATE LIMIT / BOT PROTECTION
    const decision = await aj.protect(req, {
      userId: user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const bucketName =
      process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error(
        "AWS_S3_BUCKET_NAME missing"
      );
    }

    // CREATE PROJECT ID
    const projectId = Math.random()
      .toString(36)
      .substring(2, 15);

    // S3 PATH
    const s3Key = `projects/${projectId}/${fileName}`;

    // GENERATE PRESIGNED URL
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

    // SAVE PROJECT
    await db.insert(Projects).values({
      projectId,
      createdBy: user.id,
      status: "pending",
      progress: 0,
    });

    console.log("PRESIGNED URL GENERATED");

    return NextResponse.json({
      success: true,
      projectId,
      presignedUrl,
      s3Key,
    });
  } catch (error: any) {
    console.error(
      "[UPLOAD API ERROR]:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
