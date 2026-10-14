import { useEffect, useState } from 'react';
import { Activity, BarChart3, MessageSquare, Star, Trophy } from 'lucide-react';
import { useStore, computeAnalyticsSummary } from '../../store/AppStore';
import {
  FEEDBACK_RATING_LABELS,
  SUBJECT_LABELS,
  type ActivityFeedback,
  type ActivityLaunchEvent,
  type FeedbackRating,
} from '../../types';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/States';
import { Badge } from '../../components/ui/Badge';

/**
 * Usage Analytics — displays only genuinely recorded data (launch events,
 * feedback, session completions). Starts honestly empty; no mock numbers.
 */
export default function AdminAnalyticsPage() {
  const { repo, activities } = useStore();
  const [launches, setLaunches] = useState<ActivityLaunchEvent[] | null>(null);
  const [feedback, setFeedback] = useState<ActivityFeedback[] | null>(null);
  const [completions, setCompletions] = useState(0);

  useEffect(() => {
    void (async () => {
      const l = await repo.listLaunchEvents();
      const f = await repo.listFeedback();
      // Session completion count comes from the local repository contract.
      const events = await repo.listLaunchEvents();
      void events;
      setLaunches(l);
      setFeedback(f);
      const local = repo as unknown as { state?: { sessionCompletions: number } };
      setCompletions(local.state?.sessionCompletions ?? 0);
    })();
  }, [repo]);

  if (launches === null || feedback === null) {
    return <p className="text-slate-500 text-sm">Loading analytics…</p>;
  }

  const summary = computeAnalyticsSummary(launches, feedback, completions);
  const titleFor = (id: string) => activities.find((a) => a.id === id)?.title ?? id;

  const topActivities = Object.entries(summary.launchesByActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Usage Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real recorded usage from this device/browser. {summary.totalLaunches === 0 &&
            'No activity launches recorded yet — data appears as teachers use the platform.'}
        </p>
      </header>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="Activity launches"
          value={String(summary.totalLaunches)}
        />
        <MetricCard
          icon={<Trophy className="w-5 h-5" />}
          label="Sessions completed"
          value={String(summary.sessionCompletions)}
        />
        <MetricCard
          icon={<Star className="w-5 h-5" />}
          label="Average rating"
          value={summary.averageRating === null ? '—' : summary.averageRating.toFixed(1) + ' / 5'}
          sub={
            summary.averageRating === null
              ? 'No feedback yet'
              : `${feedback.length} responses`
          }
        />
        <MetricCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Feedback items"
          value={String(feedback.length)}
        />
      </div>

      {summary.totalLaunches === 0 && feedback.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8" />}
          title="No usage data yet"
          description="Launch and rate activities, then come back — this dashboard only shows real, collected data."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top activities */}
          {topActivities.length > 0 && (
            <Card className="p-5">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">
                Most frequently used activities
              </h2>
              <ol className="space-y-2">
                {topActivities.map(([id, count]) => {
                  const pct = (count / summary.totalLaunches) * 100;
                  return (
                    <li key={id}>
                      <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        <span className="truncate">{titleFor(id)}</span>
                        <span className="tabular-nums">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-teal-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          )}

          {/* Usage by year & subject */}
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Usage breakdown</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  By year
                </h3>
                {Object.entries(summary.launchesByYear).length === 0 ? (
                  <p className="text-sm text-slate-400">—</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {Object.entries(summary.launchesByYear)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([year, count]) => (
                        <li key={year} className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Year {year}</span>
                          <span className="font-bold tabular-nums">{count}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  By subject
                </h3>
                {Object.entries(summary.launchesBySubject).length === 0 ? (
                  <p className="text-sm text-slate-400">—</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {Object.entries(summary.launchesBySubject).map(([subject, count]) => (
                      <li key={subject} className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300 truncate">
                          {SUBJECT_LABELS[subject as keyof typeof SUBJECT_LABELS] ?? subject}
                        </span>
                        <span className="font-bold tabular-nums">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Ratings */}
            {feedback.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Suitability ratings
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(FEEDBACK_RATING_LABELS) as FeedbackRating[]).map((r) => (
                    <Badge key={r} color="slate">
                      {FEEDBACK_RATING_LABELS[r]}: {summary.ratingCounts[r]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Recent feedback */}
          {summary.recentFeedback.length > 0 && (
            <Card className="p-5 lg:col-span-2">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Recent teacher feedback</h2>
              <ul className="space-y-2">
                {summary.recentFeedback.map((f) => (
                  <li
                    key={f.id}
                    className="text-sm rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {titleFor(f.activityId)}
                      </span>
                      <Badge
                        color={
                          f.rating === 'very-suitable' || f.rating === 'suitable'
                            ? 'emerald'
                            : f.rating === 'neutral'
                              ? 'slate'
                              : 'rose'
                        }
                      >
                        {FEEDBACK_RATING_LABELS[f.rating]}
                      </Badge>
                    </div>
                    {f.comment && (
                      <p className="text-slate-500 dark:text-slate-400 mt-1">“{f.comment}”</p>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
}
