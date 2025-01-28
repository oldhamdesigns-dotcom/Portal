import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const cn = (...inputs: (string | object | undefined)[]) => {
  return twMerge(clsx(...inputs));
};

export { cn };
