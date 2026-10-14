import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, RefreshCw, Sparkles, Users } from 'lucide-react';
import { useStore } from '../store/AppStore';
import { buildSession, findReplacement, type BuildResult } from '../lib/recommender';
import { saveSession, type StoredSession } from '../lib/sessionStorage';
import {
  ATMOSPHERE_LABELS,
  DIFFICULTY_LABELS,
  PHASE_LABELS,
  SUBJECT_LABELS,
  YEAR_LEVELS,
  type Activity,
  type Atmosphere,
  type Difficulty,
  type SessionRequest,
  type SubjectOrAny,
  type YearLevel,
} from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChipGroup, Select } from '../components/ui/Inputs';
import { EmptyState } from '../components/ui/States';
import { ActivityInstructionsModal } from '../components/ActivityInstructionsModal';

const DURATIONS = [10, 20, 30, 60] as const;

export default function SmartReliefPage() {
  const { activities, repo, loading } = useStore();
  const navigate = useNavigate();

  const [year, setYear] = useState('2');
  const [duration, setDuration] = useState('30');
  const [subject, setSubject] = useState('any');
  const [atmosphere, setAtmosphere] = useState('interactive');
  const [difficulty, setDifficulty] = useState('any');
  const [classId, setClassId] = useState('none');
  const [variant, setVariant] = useState(0);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [instructionsFor, setInstructionsFor] = useState<Activity | null>(null);
  const [classes, setClasses] = useState<{ id: string; name: string; year: number }[]>([]);

  // Load class profiles for the optional class picker.
  useMemo(() => {
    void (async () => {
      const list = await repo.listClasses();
      setClasses(list.map((c) => ({ id: c.id, name: c.name, year: c.year })));
    })();
  }, [repo]);

  // Class selection auto-applies year + atmosphere preferences.
  const onPickClass = (id: string) => {
    setClassId(id);
    const cls = classes.find((c) => c.id === id);
    if (cls) setYear(String(cls.year));
  };

  const request: SessionRequest = useMemo(
    () => ({
      year: Number(year) as YearLevel,
      classProfileId: classId === 'none' ? undefined : classId,
      durationMinutes: Number(duration) as 10 | 20 | 30 | 60,
      subject: subject as SubjectOrAny,
      atmosphere: atmosphere as Atmosphere,
      difficulty: difficulty === 'any' ? undefined : (difficulty as Difficulty),
      variant,
    }),
    [year, classId, duration, subject, atmosphere, difficulty, variant],
  );

  const generate = (v = variant) => {
    const r = buildSession(activities, { ...request, variant: v });
    setResult(r);
  };

  const regenerate = () => {
    const v = variant + 1;
    setVariant(v);
    generate(v);
  };

  const startSession = () => {
    if (!result?.session) return;
    const stored: StoredSession = {
      session: result.session,
      skipHistory: [],
      request,
    };
    const id = saveSession(stored);
    navigate(`/session/${id}`);
  };

  const activityById = (id: string): Activity | undefined =>
    activities.find((a) => a.id === id);

  const preview = result?.session;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary-500" />
          Smart Relief Mode
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Tell ReliefHub about your class and available time — it builds a complete session plan:
          warm-up, main activities and a calm closer.
        </p>
      </header>

      {/* Builder form */}
      <Card className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <ChipGroup
            label="Year"
            options={YEAR_LEVELS.map((y) => ({ value: String(y), label: `Year ${y}` }))}
            value={year}
            onChange={(v) => {
              setYear(v);
              setClassId('none');
            }}
          />
          <ChipGroup
            label="Duration"
            options={DURATIONS.map((d) => ({ value: String(d), label: `${d} min` }))}
            value={duration}
            onChange={setDuration}
          />
          <ChipGroup
            label="Subject"
            options={[
              { value: 'any', label: SUBJECT_LABELS.any },
              ...(Object.entries(SUBJECT_LABELS) as [SubjectOrAny, string][])
                .filter(([k]) => k !== 'any')
                .map(([k, v]) => ({ value: k, label: v })),
            ]}
            value={subject}
            onChange={setSubject}
          />
          <ChipGroup
            label="Atmosphere"
            options={(Object.keys(ATMOSPHERE_LABELS) as Atmosphere[]).map((a) => ({
              value: a,
              label: ATMOSPHERE_LABELS[a],
            }))}
            value={atmosphere}
            onChange={setAtmosphere}
          />
          <Select
            label="Class (optional — applies preferences)"
            value={classId}
            onChange={(e) => onPickClass(e.target.value)}
            options={[
              { value: 'none', label: 'No specific class' },
              ...classes.map((c) => ({ value: c.id, label: `${c.name} (Year ${c.year})` })),
            ]}
          />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: 'any', label: 'Any' },
              ...(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => ({
                value: d,
                label: DIFFICULTY_LABELS[d],
              })),
            ]}
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button size="lg" onClick={() => generate()} disabled={loading}>
            <Sparkles className="w-5 h-5" /> Build My Session
          </Button>
          {preview && (
            <Button size="lg" variant="secondary" onClick={regenerate}>
              <RefreshCw className="w-5 h-5" /> Shuffle plan
            </Button>
          )}
        </div>
      </Card>

      {/* Result */}
      {result && (
        preview ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
          >
            <Card className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Year {preview.year} {SUBJECT_LABELS[preview.subject]} — {preview.totalMinutes}{' '}
                    Minutes
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {ATMOSPHERE_LABELS[preview.atmosphere]} atmosphere ·{' '}
                    {result.explanation.matchedCount} eligible activities
                  </p>
                </div>
                <Button size="lg" onClick={startSession}>
                  Start Session →
                </Button>
              </div>

              <ol className="space-y-3">
                {preview.items.map((item, i) => {
                  const a = activityById(item.activityId);
                  if (!a) return null;
                  return (
                    <li
                      key={item.activityId + i}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors"
                    >
                      <div className="flex flex-col items-center shrink-0 w-16">
                        <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                          {item.allocatedMinutes}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">min</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">{a.title}</span>
                          <Badge
                            color={
                              item.role === 'warmup'
                                ? 'sky'
                                : item.role === 'closing'
                                  ? 'teal'
                                  : 'violet'
                            }
                          >
                            {PHASE_LABELS[item.role]}
                          </Badge>
                          {a.readyToPlay && <Badge color="emerald">Ready to play</Badge>}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {a.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInstructionsFor(a)}
                        aria-label={`Instructions for ${a.title}`}
                      >
                        Details
                      </Button>
                    </li>
                  );
                })}
              </ol>

              {result.explanation.notes.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {result.explanation.notes.map((n) => (
                    <li key={n} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock3 className="w-3 h-3" /> {n}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.section>
        ) : (
          <Card className="p-6">
            <EmptyState
              title="Couldn't build a session"
              description={result.explanation.notes[0]}
              action={
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setSubject('any')}>
                    Try any subject
                  </Button>
                  <Button variant="secondary" onClick={regenerate}>
                    Shuffle again
                  </Button>
                </div>
              }
            />
          </Card>
        )
      )}

      {/* How it works */}
      <section className="grid sm:grid-cols-3 gap-4" aria-label="How Smart Relief works">
        <Card className="p-5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 flex items-center justify-center font-black mb-3">
            1
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filters first</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Only approved activities for the right year, subject and noise level are considered.
          </p>
        </Card>
        <Card className="p-5">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 flex items-center justify-center font-black mb-3">
            2
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Plans the arc</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every session gets a warm-up, main activities and a calm closing — split across your
            available minutes.
          </p>
        </Card>
        <Card className="p-5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center font-black mb-3">
            3
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Stays fresh</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1.5">
            <Users className="w-4 h-4 mt-0.5 shrink-0" />
            Shuffle gives a different but equally suitable plan. No AI, no internet needed.
          </p>
        </Card>
      </section>

      <ActivityInstructionsModal
        activity={instructionsFor}
        open={instructionsFor !== null}
        onClose={() => setInstructionsFor(null)}
      />
      <span className="hidden">{findReplacement.name}</span>
    </div>
  );
}
