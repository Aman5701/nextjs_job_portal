import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { jobId } = params;

  if (!jobId) {
    return new NextResponse("Job ID is missing", { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      title,
      categoryId,
      imageUrl,
      short_description,
      shiftTimings,
      hourlyRate,
      workMode,
      yearsOfExperience,
    } = body;

    const existingJob = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!existingJob) {
      return new NextResponse("Job not found or unauthorized", { status: 404 });
    }

    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        ...(title && { title }),
        ...(categoryId && { categoryId }),
        ...(imageUrl && { imageUrl }),
        ...(short_description && { short_description }),
        ...(shiftTimings && { shiftTimings }),
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(workMode && Array.isArray(workMode) && { workMode }),
        ...(yearsOfExperience && { yearsOfExperience }),
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("[JOB_PATCH_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};