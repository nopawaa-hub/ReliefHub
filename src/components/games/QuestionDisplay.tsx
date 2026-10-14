import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Question } from '../../types';
import { cn } from '../../lib/utils';

/**
 * Shared, TV-sized question renderer used by question-driven games.
 * Handles multiple-choice, true/false and open-ended prompts with an
 * optional answer reveal. Pure presentation — no game logic.
 */
export function QuestionDisplay({
  question,
  revealAnswer,
  accent = 'indigo',
  compact = false,
}: {
  question: Question | null;
  revealAnswer: boolean;
  accent?: 'indigo' | 'amber' | 'emerald';
  compact?: boolean;
}) {
  if (!question) return null;

  const accentRing: Record<string, string> = {
    indigo: 'focus:ring-indigo-400',
    amber: 'focus:ring-amber-400',
    emerald: 'focus:ring-emerald-400',
  };
  void accentRing;
  void accent;
  void compact;

  return (
    <div className="w-full">
      {/* Prompt */}
      <div className="rounded-3xl bg-white/95 dark:bg-slate-800 p-6 sm:p-10 shadow-2xl">
        <p
          className={cn(
            'text-center font-black leading-snug',
            question.kind === 'true-false'
              ? 'text-3xl sm:text-5xl text-slate-900 dark:text-white'
              : 'text-2xl sm:text-4xl text-slate-900 dark:text-white',
          )}
        >
          {question.prompt}
        </p>

        {/* Multiple choice options */}
        {question.kind === 'multiple-choice' && question.options && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {question.options.map((opt) => {
              const isAnswer = opt === question.answer;
              return (
                <div
                  key={opt}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-lg sm:text-xl font-bold transition-all duration-200',
                    revealAnswer && isAnswer
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)] scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200',
                  )}
                >
                  {revealAnswer && isAnswer && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-500"
                    >
                      <Check className="w-6 h-6" strokeWidth={3} />
                    </motion.span>
                  )}
                  <span className={cn(revealAnswer && isAnswer && 'ml-1')}>{opt}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* True/false footer hint */}
        {question.kind === 'true-false' && (
          <p className="text-center text-sm font-semibold text-slate-400 mt-6 uppercase tracking-widest">
            True or False?
          </p>
        )}

        {/* Answer reveal */}
        <AnimatePresence>
          {revealAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mt-6 rounded-2xl px-6 py-4 flex flex-col items-center gap-1.5',
                'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-2 border-emerald-400/60',
              )}
            >
              <div className="flex items-center gap-2">
                <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  {question.answer}
                </span>
              </div>
              {question.explanation && (
                <p className="text-base sm:text-lg text-emerald-800/90 dark:text-emerald-200/90 text-center">
                  {question.explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function TrueFalseIcon({ value }: { value: string }) {
  const isTrue = value.toLowerCase() === 'true';
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-6 py-3 text-2xl font-black',
        isTrue
          ? 'bg-sky-500/15 text-sky-300 border-2 border-sky-400/50'
          : 'bg-rose-500/15 text-rose-300 border-2 border-rose-400/50',
      )}
    >
      {isTrue ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
      {value}
    </span>
  );
}
