import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Boxes, CheckCircle2, Image, Play, Timer, Trophy, Users } from 'lucide-react';
import type { GameId, GameMeta } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const GAMES: Record<GameId, GameMeta> = {
  'mystery-box': {
    id: 'mystery-box',
    name: 'Mystery Box',
    tagline: 'Six boxes. Hidden questions. Team glory.',
    description:
      'Teams choose numbered mystery boxes. Each box opens to reveal a question — answer correctly to bank the points. Suspense builds until the last box.',
    icon: 'Boxes',
    color: 'from-amber-400 to-orange-500',
  },
  'true-false': {
    id: 'true-false',
    name: 'True or False',
    tagline: 'Big statements. Big decisions.',
    description:
      'Oversized statements appear on screen. Pupils vote True or False together, then the answer and explanation are revealed. Optional countdown timer.',
    icon: 'CheckCircle2',
    color: 'from-sky-400 to-blue-600',
  },
  'hidden-picture': {
    id: 'hidden-picture',
    name: 'Hidden Picture',
    tagline: 'Reveal the tiles. Guess first.',
    description:
      'A picture hides behind numbered tiles. Reveal tiles one by one (or randomly) while pupils race to guess what it is. Adjustable grid size.',
    icon: 'Image',
    color: 'from-emerald-400 to-teal-600',
  },
};

const FEATURES: Record<GameId, string[]> = {
  'mystery-box': ['Two-team mode', 'Editable team names', 'Scoreboard', 'Sound effects'],
  'true-false': ['Whole-class voting', 'Explanations', 'Optional timer', 'Progress tracking'],
  'hidden-picture': ['Variable grids', 'Random reveal', 'Team scores', 'Hint prompts'],
};

const ICONS: Record<GameId, React.ComponentType<{ className?: string }>> = {
  'mystery-box': Boxes,
  'true-false': CheckCircle2,
  'hidden-picture': Image,
};

export default function GamesPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Original Games
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Built by ReliefHub · mechanics separate from content — any question set powers any game
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(GAMES) as GameId[]).map((id, i) => {
          const game = GAMES[id];
          const Icon = ICONS[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <Card hover className="h-full flex flex-col overflow-hidden">
                <div
                  className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <Icon className="w-14 h-14 text-white drop-shadow-lg relative" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {game.name}
                    </h2>
                    <Badge color="emerald">Ready</Badge>
                  </div>
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {game.tagline}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed flex-1">
                    {game.description}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {FEATURES[id].map((f) => (
                      <li key={f}>
                        <Badge color="slate">{f}</Badge>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/games/${id}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Play className="w-4 h-4" /> Play {game.name}
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <section className="mt-12 grid sm:grid-cols-3 gap-4" aria-label="Why original games">
        <FeatureTile
          icon={<Users className="w-5 h-5" />}
          title="Whole-class first"
          text="One screen, one teacher, everyone plays. No pupil devices or accounts needed."
        />
        <FeatureTile
          icon={<Trophy className="w-5 h-5" />}
          title="Built-in scoring"
          text="Team scores with editable names — scoreboard ready from the first click."
        />
        <FeatureTile
          icon={<Timer className="w-5 h-5" />}
          title="TV-sized interface"
          text="Huge text, high contrast and fullscreen support for classroom Smart TVs."
        />
      </section>
    </div>
  );
}

function FeatureTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="p-5 flex gap-4">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-100 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{text}</p>
      </div>
    </Card>
  );
}
