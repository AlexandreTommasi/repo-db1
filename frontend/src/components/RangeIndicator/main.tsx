import React from "react";
import { RangeIndicatorProps } from "./types";
import { rangeIndicatorVariants } from "./variants";

/**
 * @component RangeIndicator
 * @description A visual component to display the relative position of a guess within a range.
 *
 * @param {RangeIndicatorProps} props The props for the component.
 * @returns {JSX.Element} The rendered range indicator.
 */
export const RangeIndicator = ({ min, max, guessPositionPercent, className }: RangeIndicatorProps) => {
  // #region Styles
  const styles = rangeIndicatorVariants();
  // #endregion

  return (
    <div // wrapper
      className={styles.wrapper({ className })}
    >
      <div // track
        className={styles.track()}
      >
        <div // indicator
          className={styles.indicator()}
          style={{ left: `${guessPositionPercent}%` }}
        />
      </div>
      <div // labels
        className={styles.labels()}
      >
        <span // minLabel
          className={styles.minLabel()}
        >
          {min}
        </span>
        <span // maxLabel
          className={styles.maxLabel()}
        >
          {max}
        </span>
      </div>
    </div>
  );
};
