import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Projects, VideoShorts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> | { projectId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    
    const projects = await db.select()
      .from(Projects)
      .where(eq(Projects.projectId, resolvedParams.projectId))
      .limit(1);
    
    const project = projects[0];

    if (!project) return new NextResponse("Project not found", { status: 404 });

    if (project.createdBy !== user.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const shorts = await db.select().from(VideoShorts).where(eq(VideoShorts.projectId, resolvedParams.projectId));

    return NextResponse.json({ ...project, shorts });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
