import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { VideoShorts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shortId: string }> | { shortId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    const shortId = parseInt(resolvedParams.shortId);
    
    const { captionStyle } = await req.json();

    if (!captionStyle) {
      return new NextResponse("Missing caption style", { status: 400 });
    }

    // Convert object to string if needed, or store as JSON if the DB supports it
    // In our schema, captionStyle is text, so we JSON.stringify it.
    const styleString = JSON.stringify(captionStyle);

    await db.update(VideoShorts)
      .set({ 
        captionStyle: styleString,
        videoUrl: null,
        status: "pending",
        progress: 0,
      })
      .where(eq(VideoShorts.id, shortId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SHORT_STYLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
