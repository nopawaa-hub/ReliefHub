import { Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
        {icon ?? <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center">
        <span className="text-rose-600 dark:text-rose-300 text-2xl font-black">!</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      {message && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
