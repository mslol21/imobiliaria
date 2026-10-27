import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[110px] w-full rounded-lg border border-[#E2DBD0] bg-white px-3.5 py-2.5 text-sm text-[#242424] placeholder:text-[#5C5B57]/70 transition-colors focus-visible:border-[#183B35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#183B35]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
