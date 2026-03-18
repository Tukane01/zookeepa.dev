import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass =
      variant === "outline"
        ? "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:bg-primary/90";

    const sizeClass =
      size === "sm"
        ? "h-9 px-3 text-sm"
        : size === "lg"
        ? "h-11 px-6 text-base"
        : "h-10 px-4 text-sm";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
