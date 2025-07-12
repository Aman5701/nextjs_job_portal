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

interface HourlyRateProps {
  initialData: {
    hourlyRate: number | null;
  };
  jobId: string;
}

const formSchema = z.object({
  hourlyRate: z.coerce
    .number({
      required_error: "Hourly rate is required",
      invalid_type_error: "Hourly rate must be a number",
    })
    .min(0, { message: "Hourly rate cannot be negative" }),
});

export const HourlyRate = ({ initialData, jobId }: HourlyRateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: initialData?.hourlyRate ?? 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Hourly rate updated");

      // ✅ Update form with new value
      form.reset({ hourlyRate: values.hourlyRate });

      // ✅ Pass new value to toggleEditing so it's available immediately
      toggleEditing(values.hourlyRate);

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ✅ Accept optional value to ensure latest value is used
  const toggleEditing = (newValue?: number | null) => {
    if (isEditing) {
      form.reset({ hourlyRate: newValue ?? initialData?.hourlyRate ?? 0 });
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Hourly Rate
        <Button
          onClick={() => toggleEditing(form.getValues("hourlyRate"))}
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

      {/* Display hourly rate */}
      {!isEditing && (
        <p className="text-sm mt-2">
          {initialData.hourlyRate !== null
            ? `₹${initialData.hourlyRate}/hr`
            : "Not specified"}
        </p>
      )}

      {/* Edit form */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Enter hourly rate (e.g. 500)"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
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