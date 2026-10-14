import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface Option {
  value: string;
  label: string;
}

export function Select({
  label,
  options,
  className,
  id,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: Option[] }) {
  return (
    <label className={cn('flex flex-col gap-1.5 min-w-0', className)} htmlFor={id}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <select
        id={id}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 cursor-pointer"
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextInput({
  label,
  className,
  id,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5 min-w-0', className)} htmlFor={id}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <input
        id={id}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
        {...rest}
      />
    </label>
  );
}

export function TextArea({
  label,
  className,
  id,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5 min-w-0', className)} htmlFor={id}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <textarea
        id={id}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 resize-y"
        {...rest}
      />
    </label>
  );
}

/** Chip-style option picker used across homepage & library filters. */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2 min-w-0', className)} role="group" aria-label={label}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150',
                active
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/25'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-400',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
