import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @function cn
 * @description A utility function to merge Tailwind CSS classes with clsx.
 * @param {...ClassValue[]} inputs - The class values to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
