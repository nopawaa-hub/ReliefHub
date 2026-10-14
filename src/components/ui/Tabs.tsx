import { createContext, useContext, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TabsCtx {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsCtx | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1', className)}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger outside Tabs');
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'px-4 py-2 rounded-xl text-sm font-bold transition-all',
        active
          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent outside Tabs');
  if (ctx.value !== value) return null;
  return <div role="tabpanel">{children}</div>;
}
