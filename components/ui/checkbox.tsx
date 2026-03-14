import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 appearance-none rounded border border-[#D5D9E2] bg-white align-middle checked:border-[#FF6A3D] checked:bg-[#FF6A3D]",
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
