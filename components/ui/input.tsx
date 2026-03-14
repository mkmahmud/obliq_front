import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-4 py-2 text-[13px] text-[#333] outline-none transition placeholder:text-[#B4B4B4] focus-visible:border-[#FF6A3D]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
