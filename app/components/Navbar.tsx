import * as React from "react";

export default function Navbar({ left, right, title }: any) {
  return (
    <div className="h-app-bar px-5 grid grid-cols-4 gap-5 items-center justify-between border-b border-primary [&>:nth-child(1)]:self-stretch [&>:nth-child(1)]:grid [&>:nth-child(1)]:items-center [&>:nth-child(1)]:mr-auto [&>:nth-child(3)]:self-stretch [&>:nth-child(3)]:grid [&>:nth-child(3)]:items-center [&>:nth-child(3)]:ml-auto">
      {left}

      <span className="text-title col-start-2 col-end-4 w-full text-center">
        {title}
      </span>

      {right}
    </div>
  );
}
