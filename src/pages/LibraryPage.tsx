import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import { useStore } from '../store/AppStore';
import {
  ACTIVITY_TYPE_LABELS,
  DIFFICULTY_LABELS,
  GROUPING_LABELS,
  LANGUAGE_LABELS,
  MOVEMENT_LABELS,
  NOISE_LABELS,
  SUBJECT_LABELS,
  YEAR_LEVELS,
  type Activity,
  type ActivityType,
  type Difficulty,
  type GroupingFormat,
  type ContentLanguage,
  type MovementRequirement,
  type NoiseLevel,
  type SubjectOrAny,
  type YearLevel,
} from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityInstructionsModal } from '../components/ActivityInstructionsModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Inputs';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { cn } from '../lib/utils';

type FilterState = {
  q: string;
  year: string;
  subject: string;
  duration: string;
  difficulty: string;
  type: string;
  noise: string;
  grouping: string;
  language: string;
  movement: string;
};

const EMPTY_FILTERS: FilterState = {
  q: '',
  year: 'any',
  subject: 'any',
  duration: 'any',
  difficulty: 'any',
  type: 'any',
  noise: 'any',
  grouping: 'any',
  language: 'any',
  movement: 'any',
};

function anyOption(label = 'Any'): { value: string; label: string } {
  return { value: 'any', label };
}

export default function LibraryPage() {
  const { activities, loading, error, refresh, recordLaunch } = useStore();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    ...(searchParams.get('activity') ? { q: '' } : {}),
  });
  const [showFilters, setShowFilters] = useState(true);
  const [instructionsFor, setInstructionsFor] = useState<Activity | null>(null);

  const set = (key: keyof FilterState) => (value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return activities.filter((a) => {
      if (
        filters.year !== 'any' &&
        !a.years.includes(Number(filters.year) as YearLevel)
      )
        return false;
      if (filters.subject !== 'any' && a.subject !== filters.subject) return false;
      if (filters.difficulty !== 'any' && a.difficulty !== filters.difficulty) return false;
      if (filters.type !== 'any' && a.type !== filters.type) return false;
      if (filters.noise !== 'any' && a.noiseLevel !== filters.noise) return false;
      if (filters.grouping !== 'any' && a.grouping !== filters.grouping) return false;
      if (filters.language !== 'any' && a.language !== filters.language) return false;
      if (filters.movement !== 'any' && a.movement !== filters.movement) return false;
      if (filters.duration !== 'any') {
        const want = Number(filters.duration);
        if (a.maxDurationMinutes < want || a.minDurationMinutes > want) return false;
      }
      if (q) {
        const haystack = `${a.title} ${a.description} ${SUBJECT_LABELS[a.subject]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [activities, filters]);

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(([k, v]) => k !== 'q' && v !== 'any').length +
      (filters.q ? 1 : 0),
    [filters],
  );

  const launch = async (activity: Activity) => {
    void recordLaunch(activity.id);
    if (activity.gameId) {
      window.location.href = `/games/${activity.gameId}?activity=${activity.id}`;
    } else if (activity.url) {
      window.open(activity.url, '_blank', 'noopener,noreferrer');
    } else {
      setInstructionsFor(activity);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Activity Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {activities.length} approved activities · originals, curated links and teacher-led games
        </p>
      </header>

      {/* Search & filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => set('q')(e.target.value)}
            placeholder="Search activities…"
            aria-label="Search activities"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
          className="shrink-0"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-600 text-white text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card className="p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <Select
              label="Year"
              value={filters.year}
              onChange={(e) => set('year')(e.target.value)}
              options={[
                anyOption('All Years'),
                ...YEAR_LEVELS.map((y) => ({ value: String(y), label: `Year ${y}` })),
              ]}
            />
            <Select
              label="Subject"
              value={filters.subject}
              onChange={(e) => set('subject')(e.target.value)}
              options={[
                anyOption('All Subjects'),
                ...(Object.entries(SUBJECT_LABELS) as [SubjectOrAny, string][])
                  .filter(([k]) => k !== 'any')
                  .map(([k, v]) => ({ value: k, label: v })),
              ]}
            />
            <Select
              label="Duration"
              value={filters.duration}
              onChange={(e) => set('duration')(e.target.value)}
              options={[
                anyOption('Any Duration'),
                { value: '5', label: '5–10 minutes' },
                { value: '10', label: '~10 minutes' },
                { value: '20', label: '~20 minutes' },
                { value: '30', label: '~30 minutes' },
                { value: '60', label: '~60 minutes' },
              ]}
            />
            <Select
              label="Difficulty"
              value={filters.difficulty}
              onChange={(e) => set('difficulty')(e.target.value)}
              options={[
                anyOption('Any'),
                ...(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => ({
                  value: d,
                  label: DIFFICULTY_LABELS[d],
                })),
              ]}
            />
            <Select
              label="Activity Type"
              value={filters.type}
              onChange={(e) => set('type')(e.target.value)}
              options={[
                anyOption('All Types'),
                ...(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((t) => ({
                  value: t,
                  label: ACTIVITY_TYPE_LABELS[t],
                })),
              ]}
            />
            <Select
              label="Noise Level"
              value={filters.noise}
              onChange={(e) => set('noise')(e.target.value)}
              options={[
                anyOption('Any'),
                ...(Object.keys(NOISE_LABELS) as NoiseLevel[]).map((n) => ({
                  value: n,
                  label: NOISE_LABELS[n],
                })),
              ]}
            />
            <Select
              label="Grouping"
              value={filters.grouping}
              onChange={(e) => set('grouping')(e.target.value)}
              options={[
                anyOption('Any'),
                ...(Object.keys(GROUPING_LABELS) as GroupingFormat[]).map((g) => ({
                  value: g,
                  label: GROUPING_LABELS[g],
                })),
              ]}
            />
            <Select
              label="Language"
              value={filters.language}
              onChange={(e) => set('language')(e.target.value)}
              options={[
                anyOption('Any'),
                ...(Object.keys(LANGUAGE_LABELS) as ContentLanguage[]).map((l) => ({
                  value: l,
                  label: LANGUAGE_LABELS[l],
                })),
              ]}
            />
            <Select
              label="Movement"
              value={filters.movement}
              onChange={(e) => set('movement')(e.target.value)}
              options={[
                anyOption('Any'),
                ...(Object.keys(MOVEMENT_LABELS) as MovementRequirement[]).map((m) => ({
                  value: m,
                  label: MOVEMENT_LABELS[m],
                })),
              ]}
            />
          </div>
          {activeFilterCount > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                <X className="w-4 h-4" /> Clear all filters
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Results */}
      {loading ? (
        <LoadingState label="Loading activities…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No activities match your filters"
          description="Try removing a filter or two — or search a different keyword."
          action={
            <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4" aria-live="polite">
            Showing {filtered.length} of {activities.length} activities
          </p>
          <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3')}>
            {filtered.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                onInstructions={setInstructionsFor}
                onLaunch={launch}
              />
            ))}
          </div>
        </>
      )}

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
