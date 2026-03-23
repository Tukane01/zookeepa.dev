import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className]
 * @property {"default" | "outline"} [variant]
 * @property {"default" | "sm" | "lg"} [size]
 * @property {React.ReactNode} children
 * @property {string} [type]
 * @property {boolean} [asChild]
 */

/** @type {React.ForwardRefExoticComponent<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", children, asChild = false, ...props }, ref) => {
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

    const buttonClass = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variantClass,
      sizeClass,
      className
    );

    if (asChild) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        className: cn(child.props.className, buttonClass),
        ...props
      });
    }

    return (
      <button
        ref={ref}
        className={buttonClass}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
