import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/job-publish-action";
import { Banner } from "@/components/ui/banner";
import { Iconbadge } from "@/components/ui/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ImageUploaderForm } from "./_components/image-uploader-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRate } from "./_components/hourly-rate";
import { WorkModeForm } from "./_components/work-mode";
import { WorkExperienceForm } from "./_components/work-experience";
import { JobDescription } from "./_components/job-description";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  // verify the MongoDB ID
  const validObjectRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectRegex.test(params.jobId)) {
    redirect("/admin/jobs");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
    job.shiftTimings,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete all fields {completionText}
          </span>
        </div>

        {/* action buttons */}
        <JobPublishAction
          jobId={params.jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* warning before publishing the job */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is unpublished. It will not be visible in the jobs list"
        />
      )}

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left container */}
        <div className="">
          {/* title */}
          <div className="flex items-center gap-x-2">
            <Iconbadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>

          {/* title form */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* cover image uploader form */}
          <ImageUploaderForm initialImage={job.imageUrl || ""} jobId={job.id} />

          {/* category form */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* short description form */}
          <ShortDescription initialData={job} jobId={job.id} />

          {/* shift timing mode form */}
          <ShiftTimingForm initialData={job} jobId={job.id} />

          {/* hourly rate form */}
          <HourlyRate initialData={job} jobId={job.id} />

          {/* work mode form */}
          <WorkModeForm initialData={job} jobId={job.id} />

          {/* work experience form */}
          <WorkExperienceForm initialData={job} jobId={job.id} />
        </div>
      </div>

      {/* right container */}
      <div></div>

      {/* job description form */}
      <div className="col-span-2">
        <JobDescription initialData={job} jobId={job.id} />
      </div>
    </div>
  );
};

export default JobDetailsPage;
