import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5121B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#B5121B] text-white hover:bg-[#8F0D15] active:scale-[0.99] shadow-sm",
        outline:
          "border border-[#B5121B]/30 bg-transparent text-[#B5121B] hover:bg-[#B5121B] hover:text-white",
        outlineLight:
          "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-[#B5121B]",
        secondary:
          "bg-[#F5F5F5] text-[#242424] hover:bg-[#EAEAEA] border border-[#E5E5E5]",
        ghost: "text-[#242424] hover:bg-[#B5121B]/8 hover:text-[#B5121B]",
        destructive: "bg-[#8F0D15] text-white hover:bg-black shadow-sm",
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
