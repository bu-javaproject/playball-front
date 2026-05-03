import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface BottomSheetProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, children, className }: BottomSheetProps) {
  if (!open) return null;
  return (
    <section className={cn('absolute bottom-0 left-0 right-0 z-30 rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl', className)}>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
      {children}
    </section>
  );
}
