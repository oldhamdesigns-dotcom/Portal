import { extendTailwindMerge } from 'tailwind-merge';
import clsx from 'clsx';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-ds-h1', 'text-ds-h2', 'text-ds-h3', 'text-ds-h4', 'text-ds-h5',
        'text-ds-body-lg', 'text-ds-body', 'text-ds-body-sm',
        'text-ds-label', 'text-ds-button', 'text-ds-caption',
      ],
    },
  },
});

const cn = (...inputs: (string | object | undefined)[]) => {
  return twMerge(clsx(...inputs));
};

export { cn };
