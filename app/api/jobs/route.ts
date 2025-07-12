import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
      const { userId } = await auth();  // Clerk auth
      const body = await req.json();
      console.log("Incoming request body:", body);
      const { title } = body;
  
      if (!userId) {
        console.log("Unauthenticated");
        return new NextResponse("Un-Authorized", { status: 401 });
      }
  
      if (!title) {
        console.log("Missing title");
        return new NextResponse("Title is missing", { status: 400 });
      }
  
      const job = await db.job.create({
        data: {
          userId,
          title,
        },
      });
  
      console.log("Job created:", job);
  
      return NextResponse.json(job);
    } catch (error) {
      console.error("[JOB_POST ERROR]:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  