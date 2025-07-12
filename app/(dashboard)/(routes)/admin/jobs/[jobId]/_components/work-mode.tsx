/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";
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
import z from "zod";

interface WorkModeFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

const formSchema = z.object({
  workMode: z.array(z.string()).min(1, { message: "Select at least one mode" }),
});

export const WorkModeForm = ({ initialData, jobId }: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: Array.isArray(initialData.workMode)
        ? initialData.workMode
        : initialData.workMode
        ? [initialData.workMode]
        : [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Work mode updated");

      // ✅ Update form state with latest saved values
      form.reset({ workMode: values.workMode });

      // ✅ Pass latest value so ComboBox syncs instantly
      toggleEditing(values.workMode);

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ✅ Accept latest workMode value to immediately reflect saved data
  const toggleEditing = (newValue?: string[]) => {
    if (isEditing) {
      form.reset({
        workMode:
          newValue ??
          (Array.isArray(initialData.workMode)
            ? initialData.workMode
            : initialData.workMode
            ? [initialData.workMode]
            : []),
      });
    }
    setIsEditing((prev) => !prev);
  };

  const selectedLabels = Array.isArray(initialData.workMode)
    ? initialData.workMode
        .map((val: string) => options.find((o) => o.value === val)?.label)
        .filter(Boolean)
        .join(", ")
    : "No work mode selected";

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Mode
        <Button
          onClick={() =>
            toggleEditing(form.getValues("workMode") || [])
          }
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
            (!Array.isArray(initialData?.workMode) ||
              initialData.workMode.length === 0) &&
              "text-neutral-500 italic"
          )}
        >
          {selectedLabels || "No work mode selected"}
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
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Work Mode"
                      options={options}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      multiple
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