import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Trophy, Users, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { FeedbackModal } from '../FeedbackModal';
import { useFullscreen } from '../../lib/useFullscreen';
import { useSettings, sfx } from '../../store/SettingsStore';
import { cn } from '../../lib/utils';
import type { Activity } from '../../types';

/**
 * Shared full-bleed frame for games: fullscreen toggle, safe exit, TV sizing.
 * When launched from an activity, exiting shows the quick feedback prompt.
 */
export function GameShell({
  title,
  onExit,
  activity,
  children,
  className,
}: {
  title: string;
  onExit: () => void;
  activity?: Activity;
  children: React.ReactNode;
  className?: string;
}) {
  const { isFullscreen, toggle } = useFullscreen();
  const [confirmExit, setConfirmExit] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const reallyExit = () => {
    setConfirmExit(false);
    if (activity) {
      setFeedbackOpen(true);
    } else {
      onExit();
    }
  };

  return (
    <div className={cn('fixed inset-0 z-50 bg-slate-950 text-white overflow-hidden flex flex-col', className)}>
      {/* Slim teacher toolbar — out of pupil focus line */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfirmExit(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Exit game"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <span className="text-sm font-bold text-white/60 hidden sm:inline">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Windowed' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">{children}</div>

      <Modal open={confirmExit} onClose={() => setConfirmExit(false)} title="Leave the game?">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          Scores and progress in this game will be lost. Exit anyway?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmExit(false)}>
            Keep playing
          </Button>
          <Button variant="danger" onClick={reallyExit}>
            Exit game
          </Button>
        </div>
      </Modal>

      <FeedbackModal activity={activity ?? null} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

// ─── Team scoreboard ─────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  score: number;
}

export function useTeams(initial: string[] = ['Team A', 'Team B']) {
  const [teams, setTeams] = useState<Team[]>(() =>
    initial.map((name, i) => ({ id: `team-${i}`, name, score: 0 })),
  );

  const rename = (id: string, name: string) =>
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));

  const addPoint = (id: string, delta: number) =>
    setTeams((ts) =>
      ts.map((t) => (t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t)),
    );

  const resetScores = () => setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));

  return { teams, rename, addPoint, resetScores };
}

/** Compact score strip rendered inside game screens. */
export function ScoreStrip({
  teams,
  onAddPoint,
  onRename,
  activeTeamId,
}: {
  teams: Team[];
  onAddPoint: (id: string, delta: number) => void;
  onRename?: (id: string, name: string) => void;
  activeTeamId?: string;
}) {
  const { soundOn } = useSettings();
  void soundOn;
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-5">
      {teams.map((t, i) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all',
            i === 0
              ? 'bg-sky-500/15 border border-sky-400/40'
              : 'bg-rose-500/15 border border-rose-400/40',
            activeTeamId === t.id && 'ring-2 ring-amber-400 shadow-glow',
          )}
        >
          <Trophy className={cn('w-5 h-5 shrink-0', i === 0 ? 'text-sky-300' : 'text-rose-300')} />
          {onRename ? (
            <input
              value={t.name}
              onChange={(e) => onRename(t.id, e.target.value)}
              aria-label={`Rename ${t.name}`}
              className="w-28 sm:w-36 bg-transparent font-bold text-lg outline-none border-b border-transparent focus:border-white/40 text-white"
            />
          ) : (
            <span className="font-bold text-lg text-white">{t.name}</span>
          )}
          <span className="font-black text-3xl tabular-nums text-white min-w-[2ch] text-right">
            {t.score}
          </span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                sfx('point');
                onAddPoint(t.id, 1);
              }}
              aria-label={`Add one point to ${t.name}`}
              className="w-9 h-8 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-white font-black text-lg leading-none transition-colors"
            >
              +
            </button>
            <button
              onClick={() => onAddPoint(t.id, -1)}
              aria-label={`Remove one point from ${t.name}`}
              className="w-9 h-6 rounded-lg bg-slate-600/80 hover:bg-slate-500 text-white font-black text-sm leading-none transition-colors"
            >
              −
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Team setup overlay shown before a team game starts. */
export function TeamSetup({
  open,
  teams,
  onRename,
  onStart,
  singleTeamMode = false,
}: {
  open: boolean;
  teams: Team[];
  onRename: (id: string, name: string) => void;
  onStart: () => void;
  singleTeamMode?: boolean;
}) {
  const firstRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => firstRef.current?.focus(), 100);
  }, [open]);

  return (
    <Modal open={open} onClose={onStart} title={singleTeamMode ? 'Ready to start?' : 'Name your teams'}>
      <div className="space-y-3">
        {!singleTeamMode &&
          teams.map((t, i) => (
            <div key={t.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0',
                  i === 0 ? 'bg-sky-500' : 'bg-rose-500',
                )}
              >
                {i + 1}
              </span>
              <input
                ref={i === 0 ? firstRef : undefined}
                value={t.name}
                onChange={(e) => onRename(t.id, e.target.value)}
                placeholder={`Team ${i + 1} name`}
                aria-label={`Team ${i + 1} name`}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-base font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
          <Users className="w-4 h-4" />
          Tip: use house names or group colours your pupils already know.
        </p>
      </div>
      <div className="mt-5 flex justify-end">
        <Button size="lg" onClick={onStart}>
          Start Game
        </Button>
      </div>
    </Modal>
  );
}

/** Bottom control bar for teacher actions during a game. */
export function GameControls({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-20 flex flex-wrap items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
      {children}
    </div>
  );
}

export function ControlButton({
  onClick,
  children,
  variant = 'secondary',
  className,
  disabled,
  ariaLabel,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'accent';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size="md"
      className={cn('!bg-white/10 !text-white !border-white/25 backdrop-blur-sm hover:!bg-white/20 shadow-none', className)}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

/** Big centered message used for reveals / transitions. */
export function GameMessage({
  show,
  emoji,
  title,
  subtitle,
}: {
  show: boolean;
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 pointer-events-none"
        >
          <motion.span
            initial={{ y: 10 }}
            animate={{ y: [10, -6, 0] }}
            className="text-7xl drop-shadow-lg"
            aria-hidden="true"
          >
            {emoji}
          </motion.span>
          <p className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg text-center px-6">
            {title}
          </p>
          {subtitle && <p className="text-lg text-white/80">{subtitle}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { X };
