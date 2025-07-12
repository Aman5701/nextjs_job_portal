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

interface ShiftTimingsFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

const formSchema = z.object({
  shiftTimings: z.array(z.string()).min(1),
});

export const ShiftTimingForm = ({
  initialData,
  jobId,
}: ShiftTimingsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTimings: Array.isArray(initialData?.shiftTimings)
        ? initialData.shiftTimings
        : initialData?.shiftTimings
        ? [initialData.shiftTimings]
        : [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Shift Timing Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Shift Timing
        <Button
          onClick={toggleEditing}
          variant={"outline"}
          className="cursor-pointer"
        >
          {isEditing ? (
            <X className="w-4 h-4 text-red-700" />
          ) : (
            <PencilIcon className="w-4 h-4 text-emerald-700" />
          )}
        </Button>
      </div>

      {/* Display shiftTimings */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            (!initialData?.shiftTimings ||
              initialData?.shiftTimings?.length === 0) &&
              "text-neutral-500 italic"
          )}
        >
          {Array.isArray(initialData?.shiftTimings)
            ? initialData.shiftTimings
                .map((value) => options.find((o) => o.value === value)?.label)
                .filter(Boolean)
                .join(", ")
            : "No Timing added"}
        </p>
      )}

      {/* Edit mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="shiftTimings"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Timings"
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
