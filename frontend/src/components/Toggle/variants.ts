import { tv } from 'tailwind-variants';

export const toggleVariants = tv({
  slots: {
    wrapper: 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
    thumb: 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
  },
  variants: {
    checked: {
      true: {
        wrapper: 'bg-blue-600',
        thumb: 'translate-x-5',
      },
      false: {
        wrapper: 'bg-gray-600',
        thumb: 'translate-x-0',
      },
    },
  },
});
