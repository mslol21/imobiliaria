import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-700 text-white hover:bg-cyan-800 active:scale-[0.99] shadow-xs",
        outline:
          "border border-zinc-300 bg-transparent text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900",
        outlineLight:
          "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-zinc-900",
        secondary:
          "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200",
        ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        destructive: "bg-red-700 text-white hover:bg-red-800 shadow-xs",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3.5 text-xs",
        lg: "h-12 rounded-lg px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
