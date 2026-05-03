import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-play-primary text-white hover:bg-play-primary-dark',
  secondary: 'border border-play-border bg-white text-play-ink hover:bg-play-surface',
  ghost: 'text-play-muted hover:bg-play-surface hover:text-play-ink',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-12 px-5 text-base',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-black transition-colors disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
