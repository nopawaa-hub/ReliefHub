import { useState } from 'react';
import { Shuffle, Users } from 'lucide-react';
import { sfx } from '../../store/SettingsStore';
import { shuffle } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Inputs';

/**
 * Random Team Picker — splits pupils (numbers or names) into balanced teams.
 * Teachers can paste a class list or use numbered positions 1..N.
 */
export function TeamPickerTool() {
  const [mode, setMode] = useState<'numbers' | 'names'>('numbers');
  const [count, setCount] = useState('30');
  const [names, setNames] = useState('');
  const [teamCount, setTeamCount] = useState('4');
  const [result, setResult] = useState<string[][] | null>(null);

  const pick = () => {
    let members: string[];
    if (mode === 'numbers') {
      const n = Math.max(2, Math.min(60, Number(count) || 30));
      members = Array.from({ length: n }, (_, i) => `Pupil ${i + 1}`);
    } else {
      members = names
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      if (members.length < 2) return;
    }
    const tc = Math.max(2, Math.min(10, Number(teamCount) || 4));
    const actualTeams = Math.min(tc, members.length);
    const shuffled = shuffle(members);
    const buckets: string[][] = Array.from({ length: actualTeams }, () => []);
    shuffled.forEach((m, i) => buckets[i % actualTeams].push(m));
    // Balance by moving extras around is unnecessary — round-robin is balanced.
    sfx('reveal');
    setResult(buckets);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Pick from"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as 'numbers' | 'names');
            setResult(null);
          }}
          options={[
            { value: 'numbers', label: 'Numbered pupils' },
            { value: 'names', label: 'Pasted name list' },
          ]}
        />
        {mode === 'numbers' ? (
          <Select
            label="Number of pupils"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            options={[10, 15, 20, 25, 30, 35, 40].map((n) => ({
              value: String(n),
              label: `${n} pupils`,
            }))}
          />
        ) : (
          <label className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Names (one per line)
            </span>
            <textarea
              rows={3}
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={'Aiman\nSofia\nDanish…'}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </label>
        )}
        <Select
          label="Number of teams"
          value={teamCount}
          onChange={(e) => setTeamCount(e.target.value)}
          options={[2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: `${n} teams` }))}
        />
      </div>

      <div>
        <Button size="lg" onClick={pick}>
          <Shuffle className="w-5 h-5" /> Randomize teams
        </Button>
      </div>

      {result && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
          {result.map((team, i) => (
            <Card key={i} className="p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                <Users className="w-4 h-4 text-primary-500" /> Team {i + 1}
                <span className="text-xs font-semibold text-slate-400">({team.length})</span>
              </h3>
              <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {team.map((m) => (
                  <li key={m} className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-700/50">
                    {m}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
