import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ContentRepository } from '../data/repository';
import { LocalRepository } from '../data/repository';
import type {
  Activity,
  ActivityFeedback,
  ActivityLaunchEvent,
  AnalyticsSummary,
  FeedbackRating,
} from '../types';
import { isFirebaseConfigured } from '../lib/firebase';

// ─── App-wide store ──────────────────────────────────────────────────────────
// Single reactive store over the repository. In local mode everything syncs to
// localStorage automatically; Firestore mode swaps the repository only.

export interface AppData {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  repo: ContentRepository;
  refresh: () => Promise<void>;
  saveActivity: (a: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  recordLaunch: (activityId: string) => Promise<void>;
  recordFeedback: (activityId: string, rating: FeedbackRating, comment?: string) => Promise<void>;
  recordSessionCompletion: () => Promise<void>;
}

const StoreContext = createContext<AppData | null>(null);

function makeRepo(): ContentRepository {
  return new LocalRepository();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [repo] = useState<ContentRepository>(makeRepo);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const list = await repo.listActivities();
      setActivities(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  const saveActivity = async (a: Activity) => {
    await repo.saveActivity(a);
    await refresh();
  };

  const deleteActivity = async (id: string) => {
    await repo.deleteActivity(id);
    await refresh();
  };

  const recordLaunch = async (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;
    const event: ActivityLaunchEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      activityId,
      year: activity.years[0],
      subject: activity.subject,
      at: new Date().toISOString(),
    };
    await repo.recordLaunch(event);
  };

  const recordFeedback = async (activityId: string, rating: FeedbackRating, comment?: string) => {
    const fb: ActivityFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      activityId,
      rating,
      comment: comment?.trim() ? comment.trim() : undefined,
      at: new Date().toISOString(),
    };
    await repo.recordFeedback(fb);
  };

  const recordSessionCompletion = async () => {
    await repo.recordSessionCompletion();
  };

  const value: AppData = {
    activities,
    loading,
    error,
    repo,
    refresh,
    saveActivity,
    deleteActivity,
    recordLaunch,
    recordFeedback,
    recordSessionCompletion,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): AppData {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

/** True when running without Firebase — admin uses the local passcode. */
export function useLocalMode(): boolean {
  return !isFirebaseConfigured();
}

// ─── Analytics summary computation ───────────────────────────────────────────

export function computeAnalyticsSummary(
  launches: ActivityLaunchEvent[],
  feedback: ActivityFeedback[],
  sessionCompletions: number,
): AnalyticsSummary {
  const launchesByActivity: Record<string, number> = {};
  const launchesByYear: Record<string, number> = {};
  const launchesBySubject: Record<string, number> = {};
  for (const l of launches) {
    launchesByActivity[l.activityId] = (launchesByActivity[l.activityId] ?? 0) + 1;
    launchesByYear[String(l.year)] = (launchesByYear[String(l.year)] ?? 0) + 1;
    launchesBySubject[l.subject] = (launchesBySubject[l.subject] ?? 0) + 1;
  }

  const ratingWeights: Record<FeedbackRating, number> = {
    'very-suitable': 5,
    suitable: 4,
    neutral: 3,
    unsuitable: 2,
    'very-unsuitable': 1,
  };
  const ratingCounts: Record<FeedbackRating, number> = {
    'very-suitable': 0,
    suitable: 0,
    neutral: 0,
    unsuitable: 0,
    'very-unsuitable': 0,
  };
  let sum = 0;
  for (const f of feedback) {
    ratingCounts[f.rating] += 1;
    sum += ratingWeights[f.rating];
  }

  return {
    totalLaunches: launches.length,
    launchesByActivity,
    launchesByYear,
    launchesBySubject,
    averageRating: feedback.length > 0 ? sum / feedback.length : null,
    ratingCounts,
    sessionCompletions,
    recentFeedback: [...feedback].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 20),
  };
}
