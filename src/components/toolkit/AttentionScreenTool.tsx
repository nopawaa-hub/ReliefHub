import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Megaphone, Timer, ThumbsUp, Hand, Clock } from 'lucide-react';
import { sfx } from '../../store/SettingsStore';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  text: string;
  emoji: string;
  icon: 'eye' | 'megaphone' | 'timer' | 'thumbs' | 'hand' | 'clock';
}

const MESSAGES: Message[] = [
  { id: 'eyes', text: 'Eyes on Me', emoji: '👀', icon: 'eye' },
  { id: 'quiet', text: 'Quiet Please', emoji: '🤫', icon: 'megaphone' },
  { id: 'listen', text: 'Time to Listen', emoji: '👂', icon: 'hand' },
  { id: 'welldone', text: 'Well Done!', emoji: '👏', icon: 'thumbs' },
  { id: 'fivemin', text: 'Five Minutes Left', emoji: '⏳', icon: 'clock' },
  { id: 'break', text: 'Short Break', emoji: '☕', icon: 'timer' },
];

const ICONS = {
  eye: Eye,
  megaphone: Megaphone,
  timer: Timer,
  thumbs: ThumbsUp,
  hand: Hand,
  clock: Clock,
};

/**
 * Classroom Attention Screen — huge, high-contrast messages for the Smart TV.
 */
export function AttentionScreenTool() {
  const [active, setActive] = useState<Message | null>(null);

  if (active) {
    const Icon = ICONS[active.icon];
    return (
      <div
        className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => {
          sfx('click');
          setActive(null);
        }}
        role="button"
        aria-label="Tap anywhere to close the attention screen"
      >
        <motion.div
          key={active.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="flex flex-col items-center gap-8 px-6"
        >
          <span className="text-8xl sm:text-9xl drop-shadow-2xl" aria-hidden="true">
            {active.emoji}
          </span>
          <p className="text-6xl sm:text-8xl font-black text-white text-center tracking-tight drop-shadow-lg">
            {active.text}
          </p>
          <span className="flex items-center gap-2 text-white/40 text-sm font-semibold">
            <Icon className="w-4 h-4" /> Tap anywhere to close
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MESSAGES.map((m) => {
        const Icon = ICONS[m.icon];
        return (
          <button
            key={m.id}
            onClick={() => {
              sfx('reveal');
              setActive(m);
            }}
            className="group rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col items-center gap-3 hover:border-primary-400 hover:shadow-card-hover transition-all"
          >
            <span className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">
              {m.emoji}
            </span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">{m.text}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Icon className="w-3.5 h-3.5" /> Show on TV
            </span>
          </button>
        );
      })}
      <p className={cn('sm:col-span-2 lg:col-span-3 text-xs text-slate-400 text-center pt-1')}>
        Tapping a card takes over the whole screen — press anywhere to return.
      </p>
    </div>
  );
}
