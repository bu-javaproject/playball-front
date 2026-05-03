import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface ModalProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={cn('w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl', className)}>{children}</div>
    </div>
  );
}
