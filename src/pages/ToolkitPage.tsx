import { useState } from 'react';
import { TimerTool } from '../components/toolkit/TimerTool';
import { ScoreboardTool } from '../components/toolkit/ScoreboardTool';
import { TeamPickerTool } from '../components/toolkit/TeamPickerTool';
import { SpinWheelTool } from '../components/toolkit/SpinWheelTool';
import { AttentionScreenTool } from '../components/toolkit/AttentionScreenTool';

const TOOLS = [
  { id: 'timer', label: 'Timer', emoji: '⏱️', blurb: 'Countdown with presets & TV mode' },
  { id: 'scoreboard', label: 'Scoreboard', emoji: '🏆', blurb: 'Multi-team scores & ranking' },
  { id: 'picker', label: 'Team Picker', emoji: '🎲', blurb: 'Random balanced teams' },
  { id: 'wheel', label: 'Spin Wheel', emoji: '🎯', blurb: 'Customisable lucky draw' },
  { id: 'attention', label: 'Attention', emoji: '👀', blurb: 'Full-screen class messages' },
] as const;

type ToolId = (typeof TOOLS)[number]['id'];

export default function ToolkitPage() {
  const [tool, setTool] = useState<ToolId>('timer');
  const active = TOOLS.find((t) => t.id === tool)!;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Classroom Toolkit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Practical tools for running any relief activity — usable alongside games.
        </p>
      </header>

      {/* Tool picker tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" role="tablist">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tool === t.id}
            onClick={() => setTool(t.id)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${
              tool === t.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-card'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-1.5">{t.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.blurb}</p>
          </button>
        ))}
      </div>

      {/* Active tool */}
      <section aria-label={`${active.label} tool`}>
        <h2 className="sr-only">{active.label}</h2>
        {tool === 'timer' && <TimerTool />}
        {tool === 'scoreboard' && <ScoreboardTool />}
        {tool === 'picker' && <TeamPickerTool />}
        {tool === 'wheel' && <SpinWheelTool />}
        {tool === 'attention' && <AttentionScreenTool />}
      </section>
    </div>
  );
}
