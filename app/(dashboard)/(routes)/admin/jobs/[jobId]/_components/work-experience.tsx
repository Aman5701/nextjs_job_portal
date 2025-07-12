/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox"; // ✅ Must support single-select string
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { PencilIcon, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface WorkExperienceFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  { value: "fresher", label: "Fresher" },
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
];

// ✅ Validation: single string
const formSchema = z.object({
  yearsOfExperience: z
    .string()
    .min(1, { message: "Select your experience level" }),
});

export const WorkExperienceForm = ({
  initialData,
  jobId,
}: WorkExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = (newValue?: string) => {
    if (isEditing) {
      form.reset({
        yearsOfExperience: newValue ?? initialData?.yearsOfExperience ?? "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Work experience updated");

      // ✅ Reset with latest value
      form.reset({ yearsOfExperience: values.yearsOfExperience });
      // ✅ Pass latest value to edit toggle (so it reflects immediately)
      toggleEditing(values.yearsOfExperience);

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const selectedLabel = options.find(
    (o) => o.value === initialData?.yearsOfExperience
  )?.label;

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Years Of Experience
        <Button
          onClick={() => toggleEditing(form.getValues("yearsOfExperience"))} // 👈 pass current form value
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

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.yearsOfExperience && "text-neutral-500 italic"
          )}
        >
          {selectedLabel || "No experience level selected"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Years of Experience"
                      options={options}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
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
