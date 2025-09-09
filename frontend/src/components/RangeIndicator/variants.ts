import { tv } from "tailwind-variants";

export const rangeIndicatorVariants = tv({
  slots: {
    wrapper: "w-full my-4",
    track: "h-2 bg-gray-700 rounded-full relative",
    indicator: "h-4 w-4 bg-yellow-400 rounded-full absolute -top-1 transform -translate-x-1/2 border-2 border-gray-900 transition-all duration-300 ease-in-out",
    labels: "flex justify-between text-xs text-gray-400 mt-1",
    minLabel: "",
    maxLabel: "",
  },
});
