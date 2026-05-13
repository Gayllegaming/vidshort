import { db } from "@/db";
import { Projects, VideoShorts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const shorts = await db.select({
      id: VideoShorts.id,
      projectId: VideoShorts.projectId,
      startTime: VideoShorts.startTime,
      endTime: VideoShorts.endTime,
      reason: VideoShorts.reason,
      seoScore: VideoShorts.seoScore,
      captions: VideoShorts.captions,
      captionStyle: VideoShorts.captionStyle,
      videoUrl: Projects.videoUrl, // Use project video URL
      createdAt: VideoShorts.createdAt,
    })
    .from(VideoShorts)
    .innerJoin(Projects, eq(VideoShorts.projectId, Projects.projectId))
    .where(eq(Projects.createdBy, userId))
    .orderBy(desc(VideoShorts.createdAt));

    return NextResponse.json(shorts);
  } catch (error) {
    console.error("[SHORTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
