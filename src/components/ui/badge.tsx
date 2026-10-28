import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-cyan-700 text-white shadow-xs",
        redMuted: "bg-cyan-50 text-cyan-800 border border-cyan-200",
        cyanMuted: "bg-cyan-50 text-cyan-800 border border-cyan-200",
        gray: "bg-zinc-100 text-zinc-800 border border-zinc-200",
        outline: "border border-zinc-300 text-zinc-700 bg-white",
        success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-50 text-amber-800 border border-amber-200",
        muted: "bg-zinc-100 text-zinc-600 border border-zinc-200",
        sand: "bg-zinc-100 text-zinc-800 border border-zinc-200",
        gold: "bg-zinc-900 text-white font-semibold",
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
