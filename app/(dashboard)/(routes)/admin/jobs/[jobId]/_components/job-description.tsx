/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/components/ui/editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Preview } from "@/components/ui/preview";
import { Textarea } from "@/components/ui/textarea";
import { Job } from "@/lib/generated/prisma";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, PencilIcon, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollName, setRollName] = useState("");
  const [skills, setSkills] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const [localDescription, setLocalDescription] = useState(
    initialData?.description || ""
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Short Description Updated");
      setLocalDescription(values.description); // ✅ Update display value
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);

      // await getGenerativeAIResponse(customPrompt).then((data) => {
      //   form.setValue("description", data);
      //   setIsPrompting(false);
      // });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
        <Button
          onClick={toggleEditing}
          variant={"outline"}
          className="cursor-pointer"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4  text-red-700" />
            </>
          ) : (
            <>
              <PencilIcon className="w-4 h-4 text-emerald-700" />
            </>
          )}
        </Button>
      </div>

      {/* display the description if not editing */}
      {!isEditing && (
        <div
          className="prose prose-sm max-w-none text-neutral-800"
          dangerouslySetInnerHTML={{
            __html: localDescription || "<p>No description yet.</p>",
          }}
        />
      )}

      {/* on editing mode display input */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="Job role name"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              className="w-full p-2 rounded-md bg-white"
            />
            <input
              type="text"
              placeholder="Required Skills sets"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2 rounded-md bg-white"
            />
            {isPrompting ? (
              <>
                <Button className="cursor-pointer">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handlePromptGeneration}
                  className="cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Note*: Profession name and required skills delimitted by comma.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="cursor-pointer"
                >
                  <Save />
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
