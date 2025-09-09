import React from "react";
import { inputVariants } from "./variants";
import type { InputProps } from "./types";

/**
 * @component Input
 * @description A customizable input component.
 *
 * @param {InputProps} props - The props for the component.
 * @returns {JSX.Element} The rendered input element.
 *
 * @example
 * <Input type="text" placeholder="Enter your name" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input // wrapper
        className={inputVariants({ className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
