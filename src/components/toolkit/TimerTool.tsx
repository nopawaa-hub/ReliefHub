import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { sfx } from '../../store/SettingsStore';
import { formatClock } from '../../lib/utils';
import { useFullscreen } from '../../lib/useFullscreen';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * Countdown timer with presets, fullscreen display and optional alarm.
 * Used as an independent toolkit tool (sessions have their own timer).
 */
export function TimerTool() {
  const [presetMinutes, setPresetMinutes] = useState(5);
  const [customMinutes, setCustomMinutes] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [alarmRung, setAlarmRung] = useState(false);
  const [viewFullscreen, setViewFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const { toggle: toggleFullscreen } = useFullscreen(shellRef);

  // Total for progress ring.
  const totalSeconds = useMemo(() => {
    const m = customMinutes ? Number(customMinutes) : presetMinutes;
    return Math.max(1, Math.round(m * 60));
  }, [customMinutes, presetMinutes]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      if (!alarmRung) {
        sfx('alarm');
        setAlarmRung(true);
        setRunning(false);
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secondsLeft, alarmRung]);

  const setMinutes = (m: number) => {
    setPresetMinutes(m);
    setCustomMinutes('');
    setSecondsLeft(m * 60);
    setRunning(false);
    setAlarmRung(false);
  };

  const setCustom = (value: string) => {
    setCustomMinutes(value);
    const m = Number(value);
    if (Number.isFinite(m) && m > 0 && m <= 180) {
      setSecondsLeft(Math.round(m * 60));
      setRunning(false);
      setAlarmRung(false);
    }
  };

  const reset = () => {
    const m = customMinutes ? Number(customMinutes) : presetMinutes;
    setSecondsLeft(Math.max(1, Math.round(m * 60)));
    setRunning(false);
    setAlarmRung(false);
  };

  const progress = 1 - secondsLeft / totalSeconds;
  const danger = secondsLeft <= 30 && secondsLeft > 0;
  const done = secondsLeft === 0;

  // Ring geometry
  const R = 44;
  const CIRC = 2 * Math.PI * R;

  const display = (
    <div className={cn('flex flex-col items-center gap-6', viewFullscreen && 'scale-150')}>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke={done ? '#f43f5e' : danger ? '#f59e0b' : '#6366f1'}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={secondsLeft}
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            className={cn(
              'font-black tabular-nums text-6xl sm:text-7xl',
              done
                ? 'text-rose-500 animate-pulse'
                : danger
                  ? 'text-amber-500'
                  : 'text-slate-800 dark:text-white',
            )}
            aria-live="off"
          >
            {formatClock(secondsLeft)}
          </motion.span>
          {done && <span className="mt-2 text-sm font-bold text-rose-500">Time&apos;s up!</span>}
        </div>
      </div>

      <div className="flex gap-3">
        {!running ? (
          <Button
            size="lg"
            onClick={() => {
              sfx('click');
              setAlarmRung(false);
              setRunning(true);
            }}
            disabled={done}
          >
            <Play className="w-5 h-5" /> Start
          </Button>
        ) : (
          <Button size="lg" variant="secondary" onClick={() => setRunning(false)}>
            <Pause className="w-5 h-5" /> Pause
          </Button>
        )}
        <Button size="lg" variant="secondary" onClick={reset}>
          <RotateCcw className="w-5 h-5" /> Reset
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Presets + custom input */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Timer presets">
          {[1, 3, 5, 10, 20, 30].map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              aria-pressed={presetMinutes === m && !customMinutes}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold border transition-colors',
                presetMinutes === m && !customMinutes
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-primary-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300',
              )}
            >
              {m} min
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Custom:
          <input
            type="number"
            min={1}
            max={180}
            value={customMinutes}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="min"
            aria-label="Custom minutes"
            className="w-20 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>
        <button
          onClick={() => {
            toggleFullscreen();
            setViewFullscreen((v) => !v);
          }}
          className="ml-auto px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-2 transition-colors"
        >
          {viewFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          TV mode
        </button>
      </div>

      <div ref={shellRef} className="flex justify-center py-6 bg-transparent rounded-3xl">
        {display}
      </div>
    </div>
  );
}
