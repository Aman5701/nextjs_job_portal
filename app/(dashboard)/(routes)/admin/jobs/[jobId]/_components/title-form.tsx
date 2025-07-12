/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { PencilIcon, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  jobId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const TitleForm = ({ initialData, jobId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated");

      // ✅ Reset the form with the new title so it's reflected immediately
      form.reset({ title: values.title });

      // ✅ Pass latest value for accurate toggling
      toggleEditing(values.title);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = (newTitle?: string) => {
    if (isEditing) {
      form.reset({ title: newTitle ?? initialData.title });
    }
    setIsEditing((current) => !current);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Title
        <Button
          onClick={() => toggleEditing(form.getValues("title"))}
          variant="outline"
          className="cursor-pointer"
        >
          {isEditing ? (
            <X className="w-4 h-4 text-red-700" />
          ) : (
            <PencilIcon className="w-4 h-4 text-emerald-700" />
          )}
        </Button>
      </div>

      {/* Display the title if not editing */}
      {!isEditing && (
        <p className="text-sm mt-2">
          {initialData.title || "No title provided"}
        </p>
      )}

      {/* Edit mode: show input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Full Stack Developer'"
                      {...field}
                    />
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
      )}
    </div>
  );
};