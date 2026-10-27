import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#B5121B] text-white",
        redMuted: "bg-red-50 text-[#B5121B] border border-red-100",
        gray: "bg-[#F5F5F5] text-[#242424] border border-[#E5E5E5]",
        outline: "border border-[#B5121B]/30 text-[#B5121B] bg-white",
        success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-50 text-amber-800 border border-amber-200",
        muted: "bg-neutral-100 text-neutral-700 border border-neutral-200",
        // Compatibilidade com chaves anteriores
        sand: "bg-[#F5F5F5] text-[#242424] border border-[#E5E5E5]",
        gold: "bg-[#B5121B] text-white font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
