/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import {
  ImageIcon,
  PencilIcon,
  Save,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const formSchema = z.object({
  imageUrl: z.string().optional(),
});

export const ImageUploaderForm = ({
  initialImage,
  jobId,
}: {
  initialImage?: string;
  jobId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedPublicId, setUploadedPublicId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialImage || "",
    },
  });

  const savedImage = form.watch("imageUrl");

  const onSubmit = async () => {
    if (!uploadedPublicId) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ imageUrl: uploadedPublicId }),
      });

      form.setValue("imageUrl", uploadedPublicId);
      toast.success("Image updated!");
      setIsEditing(false);
      setPreviewUrl("");
      setUploadedPublicId("");
    } catch (error) {
      toast.error("Image update failed.");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Cover Image
        <Button
          variant="outline"
          onClick={() => {
            setIsEditing((prev) => {
              const next = !prev;
              if (next && savedImage && !previewUrl) {
                // If edit mode ON, and saved image exists, show it in preview
                setPreviewUrl(savedImage);
              } else if (!next) {
                // Reset everything if cancelled
                setPreviewUrl("");
                setUploadedPublicId("");
              }
              return next;
            });
          }}
          className="cursor-pointer"
        >
          {isEditing ? (
            <X className="w-4 h-4 text-red-700" />
          ) : (
            <PencilIcon className="w-4 h-4 text-emerald-700" />
          )}
        </Button>
      </div>

      {!isEditing ? (
        savedImage ? (
          <CldImage
            src={savedImage}
            alt="Job Image"
            width="400"
            height="300"
            className="mt-4 rounded-md object-cover w-full h-60 border border-neutral-700"
          />
        ) : (
          <div className="flex items-center justify-center h-60 bg-neutral-200 mt-2">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        )
      ) : (
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormControl>
                    <CldUploadWidget
                      uploadPreset="skill-scape-preset"
                      onSuccess={({ event, info }: any) => {
                        if (event === "success") {
                          setPreviewUrl(info.public_id);
                          setUploadedPublicId(info.public_id);
                        }
                      }}
                    >
                      {({ open }) => (
                        <div className="cursor-pointer" onClick={() => open()}>
                          {previewUrl ? (
                            <div className="relative">
                              <CldImage
                                src={previewUrl}
                                alt="Preview"
                                width="400"
                                height="300"
                                className="rounded-md border-3 object-cover w-full h-60 border-neutral-700 border-dashed"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewUrl("");
                                  setUploadedPublicId("");
                                }}
                                className="absolute top-2 right-2 cursor-pointer"
                              >
                                <Trash />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-60 border-neutral-700 bg-neutral-200 rounded-md border-3 border-dashed mb-2">
                              <ImageIcon className="h-10 w-10 text-neutral-500 mb-2" />
                              <p className="text-sm text-neutral-500">
                                Click to upload image
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CldUploadWidget>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!uploadedPublicId}
              className="cursor-pointer"
            >
              <Save/>
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};