import * as React from "react";

export function ScrollArea({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={
        "h-[calc(100vh-var(--app-bar))] overflow-y-scroll " + className
      }
      {...props}
    />
  );
}
