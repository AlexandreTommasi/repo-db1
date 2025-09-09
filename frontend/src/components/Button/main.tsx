import React from "react";
import { buttonVariants } from "./variants";
import type { ButtonProps } from "./types";

/**
 * @component Button
 * @description A customizable button component.
 *
 * @param {ButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered button element.
 *
 * @example
 * <Button onClick={() => alert('Clicked!')} variant="primary">
 *   Click Me
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button // wrapper
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
