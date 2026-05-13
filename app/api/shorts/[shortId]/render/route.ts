import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { VideoShorts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> | { shortId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    const shortId = parseInt(resolvedParams.shortId);
    
    const shorts = await db.select().from(VideoShorts).where(eq(VideoShorts.id, shortId)).limit(1);
    const short = shorts[0];

    if (!short) return new NextResponse("Short not found", { status: 404 });

    // Trigger Inngest function
    await inngest.send({
      name: "video/render",
      data: {
        shortId,
        projectId: short.projectId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SHORT_RENDER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> | { shortId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const resolvedParams = await params;
        const shortId = parseInt(resolvedParams.shortId);
        
        const shorts = await db.select().from(VideoShorts).where(eq(VideoShorts.id, shortId)).limit(1);
        const short = shorts[0];

        if (!short) return new NextResponse("Short not found", { status: 404 });

        return NextResponse.json({
            status: short.status,
            progress: short.progress,
            videoUrl: short.videoUrl
        });
    } catch (error) {
        console.error("[SHORT_RENDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
