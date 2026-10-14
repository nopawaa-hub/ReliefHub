import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Pause,
  Play,
  RefreshCw,
  SkipForward,
  Square,
  Timer as TimerIcon,
} from 'lucide-react';
import { useStore } from '../store/AppStore';
import { findReplacement } from '../lib/recommender';
import { loadSession, updateSession, type StoredSession } from '../lib/sessionStorage';
import { formatClock } from '../lib/utils';
import { sfx } from '../store/SettingsStore';
import { PHASE_LABELS, SUBJECT_LABELS, type Activity, type SessionItem } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';
import { ActivityInstructionsModal } from '../components/ActivityInstructionsModal';
import { useFullscreen } from '../lib/useFullscreen';
import { cn } from '../lib/utils';

/**
 * Session Player — follows a Smart Relief plan step by step: current activity,
 * countdown, progress, launch game, skip / replace, pause and end.
 */
export default function SessionPlayerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { activities, recordSessionCompletion } = useStore();
  const { toggle: toggleFullscreen } = useFullscreen();

  const [stored, setStored] = useState<StoredSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [instructionsFor, setInstructionsFor] = useState<Activity | null>(null);

  // Load the stored session once.
  useEffect(() => {
    if (!sessionId) return;
    const s = loadSession(sessionId);
    setStored(s);
    setLoaded(true);
    if (s) {
      // Resume at the first non-done item.
      const idx = s.session.items.findIndex((i) => i.status !== 'done' && i.status !== 'skipped');
      const startIdx = idx === -1 ? s.session.items.length - 1 : idx;
      setItemIndex(startIdx);
      setSecondsLeft((s.session.items[startIdx]?.allocatedMinutes ?? 0) * 60);
    }
  }, [sessionId]);

  // Persist progress as it changes.
  const session = stored?.session ?? null;
  useEffect(() => {
    if (!stored || !sessionId) return;
    updateSession(sessionId, stored);
  }, [stored, sessionId]);

  const items = session?.items ?? [];
  const current = items[itemIndex];

  const activity: Activity | undefined = useMemo(
    () => (current ? activities.find((a) => a.id === current.activityId) : undefined),
    [activities, current],
  );

  // Countdown effect.
  useEffect(() => {
    if (!running || paused || finished) return;
    if (secondsLeft <= 0) {
      sfx('alarm');
      setRunning(false);
      advance();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, paused, secondsLeft, finished]);

  const updateItem = (index: number, patch: Partial<SessionItem>) => {
    setStored((s) => {
      if (!s) return s;
      const newItems = [...s.session.items];
      newItems[index] = { ...newItems[index], ...patch };
      return { ...s, session: { ...s.session, items: newItems } };
    });
  };

  const startItem = () => {
    sfx('click');
    setRunning(true);
    setPaused(false);
    updateItem(itemIndex, { status: 'active' });
  };

  const advance = () => {
    const nextIdx = itemIndex + 1;
    updateItem(itemIndex, { status: 'done' });
    if (nextIdx >= items.length) {
      setFinished(true);
      setRunning(false);
      sfx('finish');
      void recordSessionCompletion();
      return;
    }
    setItemIndex(nextIdx);
    setSecondsLeft((items[nextIdx]?.allocatedMinutes ?? 0) * 60);
    setRunning(false);
  };

  const skip = () => {
    sfx('click');
    const nextIdx = itemIndex + 1;
    updateItem(itemIndex, { status: 'skipped' });
    if (nextIdx >= items.length) {
      setFinished(true);
      setRunning(false);
      return;
    }
    setItemIndex(nextIdx);
    setSecondsLeft((items[nextIdx]?.allocatedMinutes ?? 0) * 60);
    setRunning(false);
  };

  const replaceCurrent = () => {
    if (!stored || !session || !current) return;
    const replacement = findReplacement(activities, session, itemIndex, stored.skipHistory);
    if (!replacement) return;
    sfx('reveal');
    setStored((s) => {
      if (!s) return s;
      const newItems = [...s.session.items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        activityId: replacement.id,
        status: 'upcoming',
      };
      return {
        ...s,
        skipHistory: [...s.skipHistory, current.activityId],
        session: { ...s.session, items: newItems },
      };
    });
    setSecondsLeft(current.allocatedMinutes * 60);
    setRunning(false);
  };

  const launchActivity = () => {
    if (!activity) return;
    if (activity.gameId) {
      navigate(`/games/${activity.gameId}?activity=${activity.id}`);
    } else if (activity.url) {
      window.open(activity.url, '_blank', 'noopener,noreferrer');
    } else {
      setInstructionsFor(activity);
    }
  };

  const totalPlanned = session?.totalMinutes ?? 0;
  const doneCount = items.filter((i) => i.status === 'done' || i.status === 'skipped').length;
  const progress = items.length > 0 ? (doneCount / items.length) * 100 : 0;

  if (!loaded) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <EmptyState
          title="Session not found"
          description="This relief session has ended or its plan expired. Build a new one — it only takes a few seconds."
          action={
            <Button size="lg" onClick={() => navigate('/smart-relief')}>
              Build a new session
            </Button>
          }
        />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-teal-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-8xl" aria-hidden="true">🎉</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-4">Session complete!</h1>
          <p className="text-primary-100 text-lg mt-2">
            {totalPlanned} minutes of structured learning delivered. Well done!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" variant="accent" onClick={() => navigate('/')}>
              <Home className="w-5 h-5" /> Back to home
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="!bg-white/10 !text-white !border-white/25"
              onClick={() => navigate('/smart-relief')}
            >
              New session
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const nextItem = items[itemIndex + 1];
  const nextActivity = nextItem ? activities.find((a) => a.id === nextItem.activityId) : undefined;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Header strip */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/smart-relief')}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ← Plan
            </button>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                Year {session.year} · {SUBJECT_LABELS[session.subject]} · {totalPlanned} min
              </p>
              <p className="text-xs text-slate-400">
                Activity {itemIndex + 1} of {items.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ⛶ Fullscreen
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-6">
        {/* Current activity */}
        <section className="lg:col-span-2" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={itemIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge color="violet">{PHASE_LABELS[current?.role ?? 'main']}</Badge>
                  {activity?.readyToPlay && <Badge color="emerald">Ready to play</Badge>}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {current?.allocatedMinutes} minutes planned
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {activity?.title ?? 'Loading…'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  {activity?.description}
                </p>

                {/* Timer */}
                <div className="mt-6 flex items-center gap-5 flex-wrap">
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-2xl px-6 py-3 font-black tabular-nums text-3xl',
                      secondsLeft === 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        : secondsLeft < 60
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 animate-pulse'
                          : 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
                    )}
                    aria-label="Time remaining for this activity"
                  >
                    <TimerIcon className="w-6 h-6" />
                    {formatClock(secondsLeft)}
                  </div>
                  <div className="flex gap-2">
                    {!running ? (
                      <Button size="lg" onClick={startItem}>
                        <Play className="w-5 h-5" /> Start activity
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant={paused ? 'primary' : 'secondary'}
                          onClick={() => {
                            sfx('click');
                            setPaused((p) => !p);
                          }}
                        >
                          {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                          {paused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button size="lg" variant="accent" onClick={advance}>
                          <CheckCircle2 className="w-5 h-5" /> Done — next
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Launch + management */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {activity && (activity.gameId || activity.url) && (
                    <Button onClick={launchActivity} variant="secondary">
                      🎮 Launch {activity.gameId ? 'game' : 'external activity'}
                    </Button>
                  )}
                  <Button variant="ghost" onClick={replaceCurrent}>
                    <RefreshCw className="w-4 h-4" /> Replace activity
                  </Button>
                  <Button variant="ghost" onClick={skip}>
                    <SkipForward className="w-4 h-4" /> Skip
                  </Button>
                  {activity && (
                    <Button variant="ghost" onClick={() => setInstructionsFor(activity)}>
                      Instructions
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="!text-rose-500 hover:!bg-rose-50 dark:hover:!bg-rose-500/10"
                    onClick={() => {
                      setFinished(true);
                      setRunning(false);
                    }}
                  >
                    <Square className="w-4 h-4" /> End session
                  </Button>
                </div>

                {/* Quick step recap */}
                {activity && (
                  <details className="mt-5 group">
                    <summary className="text-sm font-bold text-primary-600 dark:text-primary-400 cursor-pointer select-none">
                      Step-by-step instructions
                    </summary>
                    <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                      {activity.instructions.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </details>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Up next + agenda */}
        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
              Up next
            </h2>
            {nextActivity ? (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {nextActivity.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {nextItem?.allocatedMinutes} min · {PHASE_LABELS[nextItem?.role ?? 'main']}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">This is the last activity — finish strong! 💪</p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
              Session plan
            </h2>
            <ol className="space-y-2">
              {items.map((item, i) => {
                const a = activities.find((x) => x.id === item.activityId);
                return (
                  <li
                    key={item.activityId + i}
                    className={cn(
                      'flex items-center gap-2 text-sm rounded-lg px-2.5 py-1.5',
                      i === itemIndex
                        ? 'bg-primary-50 dark:bg-primary-500/15 font-bold text-primary-700 dark:text-primary-300'
                        : item.status === 'done'
                          ? 'text-slate-400 line-through'
                          : item.status === 'skipped'
                            ? 'text-slate-400 line-through opacity-60'
                            : 'text-slate-600 dark:text-slate-300',
                    )}
                  >
                    <span className="tabular-nums w-9 shrink-0">{item.allocatedMinutes}m</span>
                    <span className="truncate flex-1">{a?.title ?? '—'}</span>
                    {item.status === 'done' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </li>
                );
              })}
            </ol>
          </Card>
        </aside>
      </div>

      <ActivityInstructionsModal
        activity={instructionsFor}
        open={instructionsFor !== null}
        onClose={() => setInstructionsFor(null)}
      />
      <span className="hidden">
        <ArrowRight />
      </span>
    </div>
  );
}
