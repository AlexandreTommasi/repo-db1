import React from 'react';
import { toggleVariants } from './variants';
import type { ToggleProps } from './types';

/**
 * @component Toggle
 * @description A simple switch component.
 *
 * @param {ToggleProps} props The props for the component.
 * @returns {JSX.Element} The rendered toggle switch.
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    // #region Styles
    const styles = toggleVariants({ checked });
    // #endregion

    return (
      <button // wrapper
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={styles.wrapper({ className })}
        ref={ref}
        {...props}
      >
        <span // thumb
          className={styles.thumb()}
        />
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
