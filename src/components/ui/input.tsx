import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[#E2DBD0] bg-white px-3.5 py-2 text-sm text-[#242424] placeholder:text-[#5C5B57]/70 transition-colors focus-visible:border-[#183B35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#183B35]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
