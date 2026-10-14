import { useState } from 'react';
import { Minus, Plus, RotateCcw, Trash2, Trophy } from 'lucide-react';
import { sfx } from '../../store/SettingsStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface TeamRow {
  id: string;
  name: string;
  score: number;
}

/** Multi-team scoreboard with editable names, ± points and ranking. */
export function ScoreboardTool() {
  const [teams, setTeams] = useState<TeamRow[]>([
    { id: 't1', name: 'Team A', score: 0 },
    { id: 't2', name: 'Team B', score: 0 },
  ]);

  const rename = (id: string, name: string) =>
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));

  const adjust = (id: string, delta: number) => {
    if (delta > 0) sfx('point');
    setTeams((ts) =>
      ts.map((t) => (t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t)),
    );
  };

  const addTeam = () =>
    setTeams((ts) => [
      ...ts,
      { id: `t${Date.now()}`, name: `Team ${String.fromCharCode(65 + ts.length)}`, score: 0 },
    ]);

  const removeTeam = (id: string) =>
    setTeams((ts) => (ts.length > 2 ? ts.filter((t) => t.id !== id) : ts));

  const resetScores = () => setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));

  const maxScore = Math.max(...teams.map((t) => t.score), 1);
  const ranked = [...teams].sort((a, b) => b.score - a.score);
  const leaders = ranked.filter((t) => t.score === ranked[0].score && t.score > 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={addTeam} disabled={teams.length >= 6}>
            <Plus className="w-4 h-4" /> Add team
          </Button>
          <Button variant="secondary" size="sm" onClick={resetScores}>
            <RotateCcw className="w-4 h-4" /> Reset scores
          </Button>
        </div>
        {leaders.length > 0 && (
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            Leading: {leaders.map((t) => t.name).join(' & ')}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2" role="list">
        {teams.map((t, rank) => {
          const isLeader = leaders.some((l) => l.id === t.id);
          return (
            <div
              key={t.id}
              role="listitem"
              className={cn(
                'relative rounded-2xl p-5 border-2 transition-all',
                isLeader
                  ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-500/10 shadow-[0_0_24px_-8px_rgba(251,191,36,0.5)]'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
              )}
            >
              {teams.length > 2 && (
                <button
                  onClick={() => removeTeam(t.id)}
                  aria-label={`Remove ${t.name}`}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0',
                    rank === 0 ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500',
                  )}
                >
                  {rank + 1}
                </span>
                <input
                  value={t.name}
                  onChange={(e) => rename(t.id, e.target.value)}
                  aria-label={`Team name: ${t.name}`}
                  className="flex-1 bg-transparent font-bold text-lg text-slate-900 dark:text-white border-b border-transparent focus:border-primary-400 outline-none min-w-0"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-black text-5xl tabular-nums text-slate-900 dark:text-white min-w-[3ch]">
                  {t.score}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => adjust(t.id, -1)}
                    aria-label={`Remove one point from ${t.name}`}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => adjust(t.id, 1)}
                    aria-label={`Add one point to ${t.name}`}
                    className="w-12 h-12 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${(t.score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
