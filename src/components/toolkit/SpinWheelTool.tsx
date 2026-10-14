import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { sfx } from '../../store/SettingsStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const PALETTE = [
  '#6366f1', '#0d9488', '#f59e0b', '#f43f5e', '#8b5cf6',
  '#0ea5e9', '#84cc16', '#ec4899', '#14b8a6', '#f97316',
  '#64748b', '#a855f7',
];

/**
 * Spinning Wheel — customisable entries, CSS-transform spin animation with a
 * deterministic slow-down, random winner selection.
 */
export function SpinWheelTool() {
  const [entries, setEntries] = useState<string[]>([
    'Team A',
    'Team B',
    'Team C',
    'Team D',
    'Team E',
    'Team D',
  ]);
  const [draft, setDraft] = useState('');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const segmentRefs = useRef<(SVGGElement | null)[]>([]);

  const slice = 360 / Math.max(1, entries.length);

  const spin = () => {
    if (spinning || entries.length < 2) return;
    setSpinning(true);
    setWinner(null);
    sfx('click');

    const winnerIndex = Math.floor(Math.random() * entries.length);
    // Land the winning slice under the top pointer.
    const targetCenter = winnerIndex * slice + slice / 2;
    const currentMod = ((360 - (rotation % 360)) + 360) % 360;
    const targetMod = (targetCenter + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta < 0) delta += 360;
    const total = rotation + 360 * (4 + Math.floor(Math.random() * 3)) + delta;
    setRotation(total);

    // Sound + winner reveal when the CSS transition ends.
    const durationMs = 4000;
    let ticks = 0;
    const tickTimer = setInterval(() => {
      ticks++;
      if (ticks < 22) sfx('tick');
    }, durationMs / 22);
    setTimeout(() => {
      clearInterval(tickTimer);
      setSpinning(false);
      setWinner(entries[winnerIndex]);
      sfx('finish');
    }, durationMs);
  };

  const add = () => {
    const v = draft.trim();
    if (!v || entries.length >= 12) return;
    setEntries((es) => [...es, v]);
    setDraft('');
    setWinner(null);
  };

  const remove = (i: number) => {
    if (entries.length <= 2) return;
    setEntries((es) => es.filter((_, idx) => idx !== i));
    setWinner(null);
  };

  const R = 140;
  const CX = 150;
  const CY = 150;

  const arcPath = (startAngle: number, endAngle: number): string => {
    const r = R;
    const x1 = CX + r * Math.cos((startAngle - 90) * (Math.PI / 180));
    const y1 = CY + r * Math.sin((startAngle - 90) * (Math.PI / 180));
    const x2 = CX + r * Math.cos((endAngle - 90) * (Math.PI / 180));
    const y2 = CY + r * Math.sin((endAngle - 90) * (Math.PI / 180));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      {/* Wheel */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-x-[12px] border-x-transparent border-b-[22px] border-b-slate-800 dark:border-white drop-shadow" />
          <motion.svg
            viewBox="0 0 300 300"
            className="w-72 h-72 sm:w-80 sm:h-80 drop-shadow-xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.15, 0.85, 0.25, 1] }}
            role="img"
            aria-label="Spinning wheel"
          >
            <circle cx={CX} cy={CY} r={R + 6} fill="rgba(0,0,0,0.15)" />
            {entries.map((label, i) => {
              const start = i * slice;
              const end = start + slice;
              const mid = start + slice / 2;
              const textR = R * 0.62;
              const tx = CX + textR * Math.cos((mid - 90) * (Math.PI / 180));
              const ty = CY + textR * Math.sin((mid - 90) * (Math.PI / 180));
              return (
                <g key={i} ref={(el) => { segmentRefs.current[i] = el; }}>
                  <path
                    d={arcPath(start, end)}
                    fill={PALETTE[i % PALETTE.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={entries.length > 8 ? 11 : 13}
                    fontWeight="800"
                    transform={`rotate(${mid} ${tx} ${ty})`}
                  >
                    {label.length > 12 ? `${label.slice(0, 11)}…` : label}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r="18" fill="white" />
            <circle cx={CX} cy={CY} r="8" fill="#4f46e5" />
          </motion.svg>
        </div>

        <Button size="lg" onClick={spin} disabled={spinning || entries.length < 2}>
          🎯 Spin the wheel
        </Button>

        {winner && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 border-2 border-emerald-400 text-center"
            aria-live="polite"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
              Selected
            </p>
            <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200">{winner}</p>
          </motion.div>
        )}
      </div>

      {/* Entries editor */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add an entry (e.g. team name, question number)"
            aria-label="New wheel entry"
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={add} disabled={entries.length >= 12}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        <ul className="space-y-1.5">
          {entries.map((e, i) => (
            <li
              key={`${e}-${i}`}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold',
                'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
              )}
            >
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span className="flex-1 text-slate-700 dark:text-slate-200">{e}</span>
              <button
                onClick={() => remove(i)}
                aria-label={`Remove ${e}`}
                disabled={entries.length <= 2}
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEntries(['Team A', 'Team B', 'Team C', 'Team D']);
            setRotation(0);
            setWinner(null);
          }}
        >
          <RotateCcw className="w-4 h-4" /> Reset entries
        </Button>
        <p className="text-xs text-slate-400">
          Max 12 entries. Duplicate labels are allowed (e.g. two chances for one team).
        </p>
      </div>
    </div>
  );
}
