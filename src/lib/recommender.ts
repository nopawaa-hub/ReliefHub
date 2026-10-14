import type {
  Activity,
  Atmosphere,
  ReliefSession,
  SessionRequest,
  SessionPhase,
} from '../types';
import { hashString, seededShuffle } from '../lib/utils';

/**
 * Deterministic rule-based session builder.
 * Same inputs (year/duration/subject/atmosphere/variant) → same session.
 * No AI service required; every rule is testable.
 */

export interface SessionPlanExplanation {
  matchedCount: number;
  relaxedAt?: string;
  notes: string[];
}

export interface BuildResult {
  session: ReliefSession | null;
  explanation: SessionPlanExplanation;
}

/** Atmosphere → acceptable noise levels. */
const atmosphereNoise: Record<Atmosphere, string[]> = {
  quiet: ['quiet'],
  interactive: ['quiet', 'moderate'],
  competitive: ['quiet', 'moderate', 'lively'],
};

/** Rule 1–4: base eligibility filter (year, subject, duration window, noise). */
export function filterEligible(
  activities: Activity[],
  req: Pick<SessionRequest, 'year' | 'subject' | 'atmosphere' | 'difficulty'>,
  allowNoise: SessionRequest['atmosphere'] extends never ? never : Atmosphere | 'any' = 'any',
): Activity[] {
  const noiseOk = allowNoise === 'any' ? null : atmosphereNoise[allowNoise];
  return activities.filter((a) => {
    if (a.status !== 'approved') return false;
    if (!a.years.includes(req.year)) return false;
    if (req.subject !== 'any' && a.subject !== req.subject) return false;
    if (req.difficulty && a.difficulty !== req.difficulty) return false;
    if (noiseOk && !noiseOk.includes(a.noiseLevel)) return false;
    return true;
  });
}

/** Closest-match scoring for "no exact match" suggestions on the homepage. */
export function scoreCloseness(
  a: Activity,
  req: Pick<SessionRequest, 'year' | 'subject' | 'atmosphere' | 'durationMinutes'>,
): number {
  let score = 0;
  if (a.years.includes(req.year)) score += 4;
  if (req.subject === 'any' || a.subject === req.subject) score += 3;
  const noiseOk = atmosphereNoise[req.atmosphere].includes(a.noiseLevel);
  if (noiseOk) score += 2;
  if (req.durationMinutes >= a.minDurationMinutes && req.durationMinutes <= a.maxDurationMinutes) {
    score += 2;
  } else {
    const overflow =
      req.durationMinutes < a.minDurationMinutes
        ? a.minDurationMinutes - req.durationMinutes
        : req.durationMinutes - a.maxDurationMinutes;
    score += Math.max(0, 2 - overflow / 10);
  }
  if (a.readyToPlay) score += 1;
  return score;
}

function activityFitsDuration(a: Activity, minutes: number): boolean {
  return (
    minutes >= Math.min(a.minDurationMinutes, a.durationMinutes) &&
    minutes <= a.maxDurationMinutes
  );
}

/** Picks the best activity for a phase given the remaining minutes. */
function pickForPhase(
  pool: Activity[],
  phase: SessionPhase,
  minutes: number,
  used: Set<string>,
  shuffleSeed: number,
): Activity | null {
  const candidates = pool.filter(
    (a) => a.phase === phase && !used.has(a.id) && activityFitsDuration(a, minutes),
  );
  if (candidates.length === 0) return null;
  // Ready-to-play first, then closest natural duration.
  const shuffled = seededShuffle(candidates, shuffleSeed);
  shuffled.sort((x, y) => {
    const rx = x.readyToPlay ? 0 : 1;
    const ry = y.readyToPlay ? 0 : 1;
    if (rx !== ry) return rx - ry;
    const dx = Math.abs(x.durationMinutes - minutes);
    const dy = Math.abs(y.durationMinutes - minutes);
    return dx - dy;
  });
  return shuffled[0] ?? null;
}

/** How the total minutes should be split among phases. */
function phaseBudgets(total: number): { warmup: number; main: number; closing: number } {
  if (total <= 10) return { warmup: 0, main: total, closing: 0 };
  if (total <= 20) return { warmup: 5, main: total - 10, closing: 5 };
  return { warmup: 5, main: total - 10, closing: 5 };
}

export function buildSession(
  activities: Activity[],
  req: SessionRequest,
): BuildResult {
  const notes: string[] = [];
  const recentlyUsed = new Set(req.recentlyUsedIds ?? []);

  // ── Pass 1: strict filter (year + subject + noise + difficulty) ──
  let eligible = filterEligible(activities, req, req.atmosphere);
  let relaxedAt: string | undefined;

  // Avoid immediate repetition when we have enough alternatives.
  const fresh = eligible.filter((a) => !recentlyUsed.has(a.id));
  if (fresh.length >= 3) eligible = fresh;

  // ── Pass 2: relax noise if too few matches ──
  if (eligible.length === 0 && req.atmosphere !== 'competitive') {
    relaxedAt = 'noise';
    eligible = filterEligible(activities, req, 'any');
    notes.push('No activities matched the classroom atmosphere — showing all noise levels.');
  }

  // ── Pass 3: relax subject ──
  if (eligible.length === 0 && req.subject !== 'any') {
    relaxedAt = relaxedAt ? `${relaxedAt}+subject` : 'subject';
    eligible = filterEligible(
      activities,
      { ...req, subject: 'any' },
      'any',
    );
    notes.push('No activities matched the subject — showing every subject for this year.');
  }

  if (eligible.length === 0) {
    return {
      session: null,
      explanation: {
        matchedCount: 0,
        relaxedAt,
        notes: [
          `No approved activities found for Year ${req.year}. Ask an administrator to add content for this year level.`,
        ],
      },
    };
  }

  const seed = hashString(
    `${req.year}|${req.durationMinutes}|${req.subject}|${req.atmosphere}|${req.variant ?? 0}`,
  );

  const budgets = phaseBudgets(req.durationMinutes);
  const items: ReliefSession['items'] = [];
  const used = new Set<string>();

  // Warm-up
  if (budgets.warmup > 0) {
    const warmup = pickForPhase(eligible, 'warmup', budgets.warmup, used, seed);
    if (warmup) {
      used.add(warmup.id);
      items.push({
        activityId: warmup.id,
        role: 'warmup',
        allocatedMinutes: Math.min(budgets.warmup, warmup.maxDurationMinutes),
        status: 'upcoming',
      });
    }
  }

  // Main activities — fill remaining minutes with 1–2 mains.
  let mainBudget = req.durationMinutes - items.reduce((s, i) => s + i.allocatedMinutes, 0);
  const closingBudget = budgets.closing;
  mainBudget -= closingBudget;

  const maxMains = req.durationMinutes >= 30 ? 2 : 1;
  for (let m = 0; m < maxMains; m++) {
    const remaining = mainBudget - items
      .filter((i) => i.role === 'main')
      .reduce((s, i) => s + i.allocatedMinutes, 0);
    if (remaining < 5) break;
    const main = pickForPhase(eligible, 'main', remaining, used, seed + m * 31);
    if (!main) break;
    used.add(main.id);
    const alloc = Math.min(
      remaining,
      Math.max(main.durationMinutes, main.minDurationMinutes),
    );
    items.push({
      activityId: main.id,
      role: 'main',
      allocatedMinutes: alloc,
      status: 'upcoming',
    });
  }

  // Closing
  if (closingBudget >= 3) {
    const closing = pickForPhase(eligible, 'closing', closingBudget, used, seed + 77);
    if (closing) {
      used.add(closing.id);
      items.push({
        activityId: closing.id,
        role: 'closing',
        allocatedMinutes: Math.min(closingBudget, closing.maxDurationMinutes),
        status: 'upcoming',
      });
    }
  }

  // If nothing matched phases (e.g. only warmups exist), fill with anything eligible.
  if (items.length === 0) {
    const fallback = eligible.find((a) => activityFitsDuration(a, req.durationMinutes));
    if (fallback) {
      items.push({
        activityId: fallback.id,
        role: 'main',
        allocatedMinutes: Math.min(req.durationMinutes, fallback.maxDurationMinutes),
        status: 'upcoming',
      });
    } else {
      return {
        session: null,
        explanation: {
          matchedCount: eligible.length,
          relaxedAt,
          notes: ['Matching activities exist but none fit the selected duration.'],
        },
      };
    }
  }

  const session: ReliefSession = {
    id: `sess_${seed.toString(36)}_${req.variant ?? 0}`,
    year: req.year,
    classProfileId: req.classProfileId,
    subject: req.subject,
    atmosphere: req.atmosphere,
    totalMinutes: items.reduce((s, i) => s + i.allocatedMinutes, 0),
    items,
    createdAt: new Date().toISOString(),
  };

  return {
    session,
    explanation: {
      matchedCount: eligible.length,
      relaxedAt,
      notes: notes.length ? notes : ['Plan generated from approved, ready-to-play activities.'],
    },
  };
}

/** Finds a replacement activity compatible with a slot (same phase, similar duration). */
export function findReplacement(
  activities: Activity[],
  session: ReliefSession,
  itemIndex: number,
  skipIds: string[],
): Activity | null {
  const item = session.items[itemIndex];
  if (!item) return null;
  const current = activities.find((a) => a.id === item.activityId);
  const usedInSession = new Set(session.items.map((i) => i.activityId));
  const skip = new Set(skipIds);

  let candidates = activities.filter(
    (a) =>
      a.status === 'approved' &&
      a.years.includes(session.year) &&
      (session.subject === 'any' || a.subject === session.subject) &&
      a.phase === item.role &&
      !usedInSession.has(a.id) &&
      !skip.has(a.id) &&
      activityFitsDuration(a, item.allocatedMinutes),
  );

  // Relax phase, then subject.
  if (candidates.length === 0) {
    candidates = activities.filter(
      (a) =>
        a.status === 'approved' &&
        a.years.includes(session.year) &&
        a.phase === item.role &&
        !usedInSession.has(a.id) &&
        !skip.has(a.id),
    );
  }
  if (candidates.length === 0) {
    candidates = activities.filter(
      (a) =>
        a.status === 'approved' &&
        a.years.includes(session.year) &&
        !usedInSession.has(a.id) &&
        !skip.has(a.id),
    );
  }
  if (candidates.length === 0) return null;

  // Prefer ready-to-play and similar duration to the replaced activity.
  candidates.sort((x, y) => {
    const rx = x.readyToPlay ? 0 : 1;
    const ry = y.readyToPlay ? 0 : 1;
    if (rx !== ry) return rx - ry;
    const dx = current ? Math.abs(x.durationMinutes - current.durationMinutes) : 0;
    const dy = current ? Math.abs(y.durationMinutes - current.durationMinutes) : 0;
    return dx - dy;
  });
  return candidates[0] ?? null;
}

/** Homepage quick recommendation: single best activity for the request. */
export function recommendSingle(
  activities: Activity[],
  req: Pick<SessionRequest, 'year' | 'subject' | 'atmosphere' | 'durationMinutes' | 'variant'>,
): {
  activity: Activity | null;
  alternatives: Activity[];
  relaxed: boolean;
} {
  const exact = filterEligible(activities, req, req.atmosphere).filter((a) =>
    activityFitsDuration(a, req.durationMinutes),
  );
  if (exact.length > 0) {
    const sorted = [...exact].sort(
      (a, b) => scoreCloseness(b, req) - scoreCloseness(a, req),
    );
    return { activity: sorted[0], alternatives: sorted.slice(1, 4), relaxed: false };
  }

  // Relax duration first, then noise, then subject — and rank by closeness.
  const pool =
    filterEligible(activities, req, req.atmosphere).length > 0
      ? filterEligible(activities, req, req.atmosphere)
      : filterEligible(activities, req, 'any').length > 0
        ? filterEligible(activities, req, 'any')
        : filterEligible(activities, { ...req, subject: 'any' }, 'any');

  if (pool.length === 0) {
    return { activity: null, alternatives: [], relaxed: true };
  }
  const sorted = [...pool].sort((a, b) => scoreCloseness(b, req) - scoreCloseness(a, req));
  return { activity: sorted[0], alternatives: sorted.slice(1, 4), relaxed: true };
}
