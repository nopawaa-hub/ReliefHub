// ─── Core domain types for ReliefHub ─────────────────────────────────────────

export type YearLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const YEAR_LEVELS: YearLevel[] = [1, 2, 3, 4, 5, 6];

export type Subject =
  | 'english'
  | 'bahasa-melayu'
  | 'mathematics'
  | 'science'
  | 'general-knowledge';

export type SubjectOrAny = Subject | 'any';

export const SUBJECTS: Subject[] = [
  'english',
  'bahasa-melayu',
  'mathematics',
  'science',
  'general-knowledge',
];

export const SUBJECT_LABELS: Record<Subject | 'any', string> = {
  any: 'Any Subject',
  english: 'English',
  'bahasa-melayu': 'Bahasa Melayu',
  mathematics: 'Mathematics',
  science: 'Science',
  'general-knowledge': 'General Knowledge',
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/** How much noise an activity typically generates in class. */
export type NoiseLevel = 'quiet' | 'moderate' | 'lively';

export const NOISE_LABELS: Record<NoiseLevel, string> = {
  quiet: 'Quiet',
  moderate: 'Moderate',
  lively: 'Lively',
};

/** How pupils are organised for the activity. */
export type GroupingFormat = 'whole-class' | 'teams' | 'pairs' | 'individual';

export const GROUPING_LABELS: Record<GroupingFormat, string> = {
  'whole-class': 'Whole Class',
  teams: 'Teams',
  pairs: 'Pairs',
  individual: 'Individual',
};

/** Language of the activity content. */
export type ContentLanguage = 'en' | 'bm' | 'mixed';

export const LANGUAGE_LABELS: Record<ContentLanguage, string> = {
  en: 'English',
  bm: 'Bahasa Melayu',
  mixed: 'Mixed',
};

/** How much pupils need to move around. */
export type MovementRequirement = 'seated' | 'some-movement' | 'active';

export const MOVEMENT_LABELS: Record<MovementRequirement, string> = {
  seated: 'Remain Seated',
  'some-movement': 'Some Movement',
  active: 'Active',
};

/** Classroom atmosphere the teacher wants. */
export type Atmosphere = 'quiet' | 'interactive' | 'competitive';

export const ATMOSPHERE_LABELS: Record<Atmosphere, string> = {
  quiet: 'Quiet',
  interactive: 'Interactive',
  competitive: 'Competitive',
};

/** Role an activity can play inside a relief session. */
export type SessionPhase = 'warmup' | 'main' | 'closing';

export const PHASE_LABELS: Record<SessionPhase, string> = {
  warmup: 'Warm-Up',
  main: 'Main Activity',
  closing: 'Closing',
};

export type ActivityType =
  | 'reliefhub-game'
  | 'baamboozle'
  | 'wordwall'
  | 'video'
  | 'external-activity'
  | 'presentation';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  'reliefhub-game': 'ReliefHub Game',
  baamboozle: 'Baamboozle',
  wordwall: 'Wordwall',
  video: 'Educational Video',
  'external-activity': 'External Activity',
  presentation: 'Interactive Presentation',
};

export type ActivityStatus = 'approved' | 'pending' | 'archived';

// ─── Original games ──────────────────────────────────────────────────────────

export type GameId = 'mystery-box' | 'true-false' | 'hidden-picture';

export interface GameMeta {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name reference used by the UI
  color: string;
}

// ─── Questions ─────────────────────────────────────────────────────────────

export type QuestionKind = 'multiple-choice' | 'true-false' | 'open-ended';

export interface Question {
  id: string;
  kind: QuestionKind;
  /** The question or statement shown to pupils. */
  prompt: string;
  /** Options for multiple-choice questions. */
  options?: string[];
  /** The correct answer. For true-false: 'True' | 'False'. For open-ended: expected answer text. */
  answer: string;
  /** Optional explanation shown after the answer reveal. */
  explanation?: string;
}

export interface QuestionSet {
  id: string;
  title: string;
  subject: Subject;
  years: YearLevel[];
  difficulty: Difficulty;
  language: ContentLanguage;
  questions: Question[];
}

// ─── Hidden picture packs ────────────────────────────────────────────────────

/** One revealable picture. Uses emoji glyphs so the game works fully offline. */
export interface HiddenPicture {
  id: string;
  emoji: string;
  label: string;
  hint: string;
}

export interface PicturePack {
  id: string;
  title: string;
  subject: Subject;
  years: YearLevel[];
  pictures: HiddenPicture[];
}

// ─── Activities ─────────────────────────────────────────────────────────────

export interface ActivityInstructions {
  learningPurpose: string;
  materials: string[];
  preparation: string;
  steps: string[];
  classroomManagement: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  /** Original ReliefHub content vs curated external resource. */
  source: 'original' | 'external';
  subject: Subject;
  years: YearLevel[];
  /** Typical duration in minutes. */
  durationMinutes: number;
  /** Shortest sensible run time. */
  minDurationMinutes: number;
  /** Longest sensible run time before pupils lose interest. */
  maxDurationMinutes: number;
  difficulty: Difficulty;
  noiseLevel: NoiseLevel;
  grouping: GroupingFormat;
  language: ContentLanguage;
  movement: MovementRequirement;
  phase: SessionPhase;
  /** True when a teacher can start it with zero preparation. */
  readyToPlay: boolean;
  /** ReliefHub original game this activity launches, if any. */
  gameId?: GameId;
  /** Question set powering the game, if any. */
  questionSetId?: string;
  /** Picture pack for hidden-picture activities, if any. */
  picturePackId?: string;
  /** External URL for linked activities. Must be a valid, verified source URL. */
  url?: string;
  /** Whether the external source permits embedding (iframes). */
  embeddable?: boolean;
  instructions: ActivityInstructions;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Classroom profiles ─────────────────────────────────────────────────────

export interface ClassroomProfile {
  id: string;
  name: string;
  year: YearLevel;
  pupilCount: number;
  preferredActivities: string;
  noisePreference: NoiseLevel;
  movementPreference: MovementRequirement;
}

// ─── Sessions ───────────────────────────────────────────────────────────────

export type SessionItemStatus = 'upcoming' | 'active' | 'done' | 'skipped';

export interface SessionItem {
  activityId: string;
  role: SessionPhase;
  allocatedMinutes: number;
  status: SessionItemStatus;
}

export interface ReliefSession {
  id: string;
  year: YearLevel;
  classProfileId?: string;
  subject: SubjectOrAny;
  atmosphere: Atmosphere;
  totalMinutes: number;
  items: SessionItem[];
  createdAt: string;
  completedAt?: string;
  endedEarly?: boolean;
}

// ─── Recommendation input ───────────────────────────────────────────────────

export interface SessionRequest {
  year: YearLevel;
  classProfileId?: string;
  durationMinutes: 10 | 20 | 30 | 60;
  subject: SubjectOrAny;
  atmosphere: Atmosphere;
  difficulty?: Difficulty;
  /** Increment to get a different but still deterministic plan. */
  variant?: number;
  /** Activity ids used recently, to avoid repetition. */
  recentlyUsedIds?: string[];
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export type FeedbackRating =
  | 'very-suitable'
  | 'suitable'
  | 'neutral'
  | 'unsuitable'
  | 'very-unsuitable';

export const FEEDBACK_RATING_LABELS: Record<FeedbackRating, string> = {
  'very-suitable': 'Very Suitable',
  suitable: 'Suitable',
  neutral: 'Neutral',
  unsuitable: 'Unsuitable',
  'very-unsuitable': 'Very Unsuitable',
};

export interface ActivityLaunchEvent {
  id: string;
  activityId: string;
  year: YearLevel;
  subject: Subject;
  at: string;
}

export interface ActivityFeedback {
  id: string;
  activityId: string;
  rating: FeedbackRating;
  comment?: string;
  at: string;
}

export interface AnalyticsSummary {
  totalLaunches: number;
  launchesByActivity: Record<string, number>;
  launchesByYear: Record<string, number>;
  launchesBySubject: Record<string, number>;
  averageRating: number | null;
  ratingCounts: Record<FeedbackRating, number>;
  sessionCompletions: number;
  recentFeedback: ActivityFeedback[];
}
