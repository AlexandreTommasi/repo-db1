import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { RatingProps } from './types';
import { cn } from '@/utils/cn';

/**
 * @component Rating
 * @description A star rating component for user feedback.
 */
export const Rating = ({ count = 5, onRate, className }: RatingProps) => {
  // #region States
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isRated, setIsRated] = useState(false);
  // #endregion

  // #region Handlers
  const handleClick = (ratingValue: number) => {
    if (isRated) return;
    setRating(ratingValue);
    setIsRated(true);
    onRate(ratingValue);
  };
  // #endregion

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              className="sr-only"
              disabled={isRated}
            />
            <Star
              className={cn(
                'h-8 w-8 cursor-pointer transition-colors',
                ratingValue <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500',
                isRated && 'cursor-default'
              )}
              onMouseEnter={() => !isRated && setHover(ratingValue)}
              onMouseLeave={() => !isRated && setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};
