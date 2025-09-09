import { VariantProps } from "tailwind-variants";
import { buttonVariants } from "./variants";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
