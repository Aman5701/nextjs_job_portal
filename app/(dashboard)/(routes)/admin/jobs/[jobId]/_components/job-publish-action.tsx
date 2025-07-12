/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {};

  const onDelete = () => {};

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        size={"sm"}
        onClick={onClick}
        className="cursor-pointer"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
        className="cursor-pointer"
      >
        <Trash2 className="w-full h-full" />
      </Button>
    </div>
  );
};
