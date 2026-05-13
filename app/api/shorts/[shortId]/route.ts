import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { VideoShorts, Projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> | { shortId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    const shortId = parseInt(resolvedParams.shortId);

    if (isNaN(shortId)) {
      return new NextResponse("Invalid Short ID", { status: 400 });
    }

    // Get the short and its associated project to verify ownership
    const shortData = await db.select({
      id: VideoShorts.id,
      videoUrl: VideoShorts.videoUrl,
      projectId: VideoShorts.projectId,
      createdBy: Projects.createdBy
    })
    .from(VideoShorts)
    .innerJoin(Projects, eq(VideoShorts.projectId, Projects.projectId))
    .where(eq(VideoShorts.id, shortId))
    .limit(1);

    if (shortData.length === 0) {
      return new NextResponse("Short not found", { status: 404 });
    }

    const short = shortData[0];

    // Check if the current user owns the project
    if (short.createdBy !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete from S3 if videoUrl exists
    if (short.videoUrl) {
      try {
        const url = new URL(short.videoUrl);
        let bucketName = "";
        let key = "";

        // Handle various S3 URL formats
        if (url.hostname.includes("s3")) {
          const hostParts = url.hostname.split(".");
          // Format: bucket.s3.region.amazonaws.com
          if (hostParts[1] === "s3") {
            bucketName = hostParts[0];
            key = decodeURIComponent(url.pathname.substring(1));
          } 
          // Format: s3.region.amazonaws.com/bucket/key
          else if (hostParts[0] === "s3") {
            const pathParts = url.pathname.substring(1).split("/");
            bucketName = pathParts[0];
            key = decodeURIComponent(pathParts.slice(1).join("/"));
          }
          // Format: bucket.s3-region.amazonaws.com
          else if (hostParts[1].startsWith("s3-")) {
            bucketName = hostParts[0];
            key = decodeURIComponent(url.pathname.substring(1));
          }
        }

        if (bucketName && key) {
          console.log(`Deleting from S3: Bucket=${bucketName}, Key=${key}`);
          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
          }));
        } else {
            console.warn("Could not parse S3 bucket and key from URL:", short.videoUrl);
        }
      } catch (s3Error) {
        console.error("Error deleting from S3:", s3Error);
        // We continue even if S3 delete fails, to ensure DB record is removed
      }
    }

    // Delete from database
    await db.delete(VideoShorts).where(eq(VideoShorts.id, shortId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SHORT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
