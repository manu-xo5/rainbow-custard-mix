import { cn } from "@/lib/utils";
import * as React from "react";

type Props = {
  className?: string;
  title: any;
  last_note: any;
  last_updated_at: any;
};

export default function FolderCard({
  className,
  title,
  last_note,
  last_updated_at,
}: Props) {
  return (
    <div
      className={cn(
        "bg-primary p-4 mx-5 my-4 rounded-lg flex gap-x-4",
        className
      )}
    >
      <span className="grow text-border  min-w-0 truncate">
        <span className="text-text-primary flex justify-between text-xl">
          {title}

          <span className="text-base">{last_updated_at}</span>
        </span>

        <span className="whitespace-nowrap">{last_note}</span>
      </span>
    </div>
  );
}
