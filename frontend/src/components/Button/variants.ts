import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  variants: {
    variant: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-700 text-white hover:bg-gray-600",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "hover:bg-gray-700 hover:text-white",
    },
    size: {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});
