import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-play-ink shadow-play transition hover:bg-play-surface disabled:bg-gray-200 disabled:text-gray-400', className)}
      {...props}
    >
      {children}
    </button>
  );
}
