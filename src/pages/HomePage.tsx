import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock3,
  Gamepad2,
  GraduationCap,
  LibraryBig,
  Sparkles,
  Timer,
  Users,
  Wrench,
} from 'lucide-react';
import { useStore } from '../store/AppStore';
import { recommendSingle } from '../lib/recommender';
import {
  SUBJECT_LABELS,
  type Atmosphere,
  type SubjectOrAny,
  type YearLevel,
} from '../types';
import { ChipGroup } from '../components/ui/Inputs';
import { Button, LinkButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityInstructionsModal } from '../components/ActivityInstructionsModal';
import type { Activity } from '../types';

const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6].map((y) => ({ value: String(y), label: `Year ${y}` }));
const DURATION_OPTIONS = [
  { value: '10', label: '10 min' },
  { value: '20', label: '20 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '60 min' },
];
const SUBJECT_OPTIONS = [
  { value: 'any', label: SUBJECT_LABELS.any },
  { value: 'english', label: SUBJECT_LABELS.english },
  { value: 'bahasa-melayu', label: SUBJECT_LABELS['bahasa-melayu'] },
  { value: 'mathematics', label: SUBJECT_LABELS.mathematics },
  { value: 'science', label: SUBJECT_LABELS.science },
  { value: 'general-knowledge', label: SUBJECT_LABELS['general-knowledge'] },
];
const ATMOSPHERE_OPTIONS = [
  { value: 'quiet', label: 'Quiet' },
  { value: 'interactive', label: 'Interactive' },
  { value: 'competitive', label: 'Competitive' },
];

export default function HomePage() {
  const { activities, loading, recordLaunch } = useStore();
  const navigate = useNavigate();

  const [year, setYear] = useState('2');
  const [duration, setDuration] = useState('30');
  const [subject, setSubject] = useState('any');
  const [atmosphere, setAtmosphere] = useState('interactive');
  const [variant, setVariant] = useState(0);

  const [recommendation, setRecommendation] = useState<
    ReturnType<typeof recommendSingle> | null
  >(null);
  const [instructionsFor, setInstructionsFor] = useState<Activity | null>(null);

  const req = useMemo(
    () => ({
      year: Number(year) as YearLevel,
      subject: subject as SubjectOrAny,
      atmosphere: atmosphere as Atmosphere,
      durationMinutes: Number(duration) as 10 | 20 | 30 | 60,
      variant,
    }),
    [year, subject, atmosphere, duration, variant],
  );

  const onFind = () => {
    setRecommendation(recommendSingle(activities, req));
  };

  const launch = async (activity: Activity) => {
    void recordLaunch(activity.id);
    if (activity.gameId) {
      navigate(`/games/${activity.gameId}?activity=${activity.id}`);
    } else if (activity.url) {
      window.open(activity.url, '_blank', 'noopener,noreferrer');
    } else {
      setInstructionsFor(activity);
    }
  };

  const recommended = useMemo(() => {
    // Recommended = high closeness, ready to play, any year/subject.
    return activities
      .filter((a) => a.readyToPlay)
      .slice(0, 4);
  }, [activities]);

  return (
    <div className="space-y-12">
      {/* ─── Hero & Quick Start ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 px-6 py-10 sm:px-12 sm:py-14 text-white"
        aria-labelledby="hero-heading"
      >
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <Badge className="bg-white/15 text-white mb-4">
            <Sparkles className="w-3 h-3" /> For relief teachers — no account needed
          </Badge>
          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
          >
            Ready for Your Relief Class?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-primary-100">
            Choose your class, find an activity, and start learning — no preparation needed.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 bg-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm border border-white/15">
            <ChipGroup label="School Year" options={YEAR_OPTIONS} value={year} onChange={setYear} />
            <ChipGroup label="Duration" options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
            <ChipGroup label="Subject" options={SUBJECT_OPTIONS} value={subject} onChange={setSubject} />
            <ChipGroup
              label="Classroom Atmosphere"
              options={ATMOSPHERE_OPTIONS}
              value={atmosphere}
              onChange={setAtmosphere}
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Button
                size="xl"
                variant="accent"
                onClick={onFind}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <Sparkles className="w-5 h-5" />
                Find My Activity
              </Button>
              {recommendation && (
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto !bg-white/10 !text-white !border-white/25 hover:!bg-white/20"
                  onClick={() => {
                    setVariant((v) => v + 1);
                    setRecommendation(
                      recommendSingle(activities, { ...req, variant: variant + 1 }),
                    );
                  }}
                >
                  Try Another
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Recommendation result ──────────────────────────────────────── */}
      {recommendation && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          aria-labelledby="rec-heading"
        >
          <h2 id="rec-heading" className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            {recommendation.activity ? 'Your Activity' : 'No exact match'}
          </h2>
          {recommendation.activity ? (
            <>
              {recommendation.relaxed && (
                <p className="mb-4 text-sm rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 px-4 py-3">
                  No activity matched everything exactly — this is the closest approved activity for
                  Year {year}.
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
                <ActivityCard
                  activity={recommendation.activity}
                  onInstructions={setInstructionsFor}
                  onLaunch={launch}
                />
              </div>
              {recommendation.alternatives.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                    Closest alternatives
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendation.alternatives.map((a) => (
                      <ActivityCard
                        key={a.id}
                        activity={a}
                        onInstructions={setInstructionsFor}
                        onLaunch={launch}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="p-6 max-w-2xl">
              <p className="text-slate-600 dark:text-slate-300">
                No approved activity matches Year {year} yet. Try a different subject or year, or
                ask an administrator to publish activities for this year level.
              </p>
              <div className="mt-4 flex gap-3">
                <LinkButton to="/library" variant="secondary">
                  Browse the full library
                </LinkButton>
              </div>
            </Card>
          )}
        </motion.section>
      )}

      {/* ─── Quick access tiles ─────────────────────────────────────────── */}
      <section aria-label="Quick access">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickTile
            to="/games"
            icon={<Gamepad2 className="w-6 h-6" />}
            title="Quick Play"
            description="Jump straight into an original game"
            color="from-violet-500 to-purple-600"
          />
          <QuickTile
            to="/library"
            icon={<LibraryBig className="w-6 h-6" />}
            title="Explore Library"
            description="Filter activities by year, subject & more"
            color="from-sky-500 to-blue-600"
          />
          <QuickTile
            to="/smart-relief"
            icon={<Sparkles className="w-6 h-6" />}
            title="Smart Relief Mode"
            description="Auto-build a full relief session"
            color="from-primary-500 to-indigo-600"
          />
          <QuickTile
            to="/toolkit"
            icon={<Wrench className="w-6 h-6" />}
            title="Classroom Toolkit"
            description="Timer, scoreboard, picker & more"
            color="from-teal-500 to-emerald-600"
          />
        </div>
      </section>

      {/* ─── Recommended activities ─────────────────────────────────────── */}
      <section aria-labelledby="recommended-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recommended-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Recommended Activities
          </h2>
          <LinkButton to="/library" variant="ghost" size="sm">
            View all <ArrowRight className="w-4 h-4" />
          </LinkButton>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              onInstructions={setInstructionsFor}
              onLaunch={launch}
            />
          ))}
        </div>
      </section>

      {/* ─── How it works / stats strip ─────────────────────────────────── */}
      <section
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Why ReliefHub"
      >
        <InfoTile
          icon={<Clock3 className="w-5 h-5" />}
          title="Ready in 60 seconds"
          text="Pick a year, duration and subject — get a playable activity instantly."
        />
        <InfoTile
          icon={<GraduationCap className="w-5 h-5" />}
          title="Years 1–6"
          text="Question sets tuned to primary school levels for English, BM, Maths, Science and more."
        />
        <InfoTile
          icon={<Users className="w-5 h-5" />}
          title="Whole-class play"
          text="Built for one Smart TV and teacher control. No pupil accounts or devices."
        />
        <InfoTile
          icon={<Timer className="w-5 h-5" />}
          title="Structured sessions"
          text="Smart Relief builds warm-up, mains and closing into your available minutes."
        />
      </section>

      <ActivityInstructionsModal
        activity={instructionsFor}
        open={instructionsFor !== null}
        onClose={() => setInstructionsFor(null)}
        onLaunch={(a) => {
          setInstructionsFor(null);
          void launch(a);
        }}
      />
    </div>
  );
}

function QuickTile({
  to,
  icon,
  title,
  description,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card hover className="p-5">
      <a href={to} className="block group">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center mb-3 shadow-sm`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </a>
    </Card>
  );
}

function InfoTile({
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
