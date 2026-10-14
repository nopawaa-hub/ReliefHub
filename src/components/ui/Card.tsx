import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({
  className,
  children,
  hover = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card dark:bg-slate-800',
        hover &&
          'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
