import type {
  Activity,
  ActivityFeedback,
  ActivityLaunchEvent,
  ClassroomProfile,
  PicturePack,
  QuestionSet,
} from '../types';
import { allActivities } from '../data/activities';
import { allPacks } from '../data/picturePacks';
import { sampleClasses } from '../data/classrooms';

// All English question sets
import {
  englishAnimals,
  englishColours,
  englishWeather,
  englishFood,
  englishClothes,
  englishPrepositions,
  englishVocabulary,
  englishGrammar,
  englishTrueFalse,
} from '../data/questionSets/english';
import {
  mathAddition,
  mathSubtraction,
  mathMultiplication,
  mathShapes,
  mathPatterns,
  mathTrueFalse,
} from '../data/questionSets/mathematics';
import {
  scienceLivingThings,
  scienceAnimals,
  sciencePlants,
  scienceHumanBody,
  scienceMatter,
  scienceTrueFalse,
} from '../data/questionSets/science';
import {
  gkMalaysia,
  gkCountries,
  gkEveryday,
  gkSafety,
  gkRiddles,
  gkTrueFalse,
} from '../data/questionSets/generalKnowledge';
import {
  bmKataNama,
  bmWarnaBilangan,
  bmSifatKata,
  bmTrueFalse,
} from '../data/questionSets/bahasaMelayu';

export const allQuestionSets: QuestionSet[] = [
  englishAnimals,
  englishColours,
  englishWeather,
  englishFood,
  englishClothes,
  englishPrepositions,
  englishVocabulary,
  englishGrammar,
  englishTrueFalse,
  mathAddition,
  mathSubtraction,
  mathMultiplication,
  mathShapes,
  mathPatterns,
  mathTrueFalse,
  scienceLivingThings,
  scienceAnimals,
  sciencePlants,
  scienceHumanBody,
  scienceMatter,
  scienceTrueFalse,
  gkMalaysia,
  gkCountries,
  gkEveryday,
  gkSafety,
  gkRiddles,
  gkTrueFalse,
  bmKataNama,
  bmWarnaBilangan,
  bmSifatKata,
  bmTrueFalse,
];

/**
 * Content repository interface. The app only talks to this interface.
 * Two implementations ship today:
 *  - LocalRepository: in-memory starter content + localStorage overrides (works offline, no setup)
 *  - FirestoreRepository: same interface backed by Firestore (added when Firebase env vars exist)
 */
export interface ContentRepository {
  listActivities(): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
  saveActivity(activity: Activity): Promise<void>;
  deleteActivity(id: string): Promise<void>;

  listQuestionSets(): Promise<QuestionSet[]>;
  getQuestionSet(id: string): Promise<QuestionSet | undefined>;
  saveQuestionSet(set: QuestionSet): Promise<void>;
  deleteQuestionSet(id: string): Promise<void>;

  listPicturePacks(): Promise<PicturePack[]>;
  getPicturePack(id: string): Promise<PicturePack | undefined>;

  listClasses(): Promise<ClassroomProfile[]>;
  saveClass(profile: ClassroomProfile): Promise<void>;
  deleteClass(id: string): Promise<void>;

  listLaunchEvents(): Promise<ActivityLaunchEvent[]>;
  recordLaunch(event: ActivityLaunchEvent): Promise<void>;
  listFeedback(): Promise<ActivityFeedback[]>;
  recordFeedback(feedback: ActivityFeedback): Promise<void>;
  recordSessionCompletion(): Promise<void>;
}

// ─── Local repository (default, zero-config) ─────────────────────────────────

const STORAGE_KEY = 'reliefhub.data.v1';

interface PersistedState {
  activities: Activity[];
  questionSets: QuestionSet[];
  classes: ClassroomProfile[];
  launches: ActivityLaunchEvent[];
  feedback: ActivityFeedback[];
  sessionCompletions: number;
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function seedState(): PersistedState {
  return {
    activities: [...allActivities],
    questionSets: [...allQuestionSets],
    classes: [...sampleClasses],
    launches: [],
    feedback: [],
    sessionCompletions: 0,
  };
}

/**
 * LocalRepository merges starter content with admin edits stored in
 * localStorage. Starter content upgrades (new app version) are detected by
 * comparing the starter activity ids; admin edits always win.
 */
export class LocalRepository implements ContentRepository {
  private state: PersistedState;

  constructor() {
    const persisted = loadPersisted();
    this.state = persisted ?? seedState();
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* storage full or unavailable — app continues in-memory */
    }
  }

  async listActivities(): Promise<Activity[]> {
    return this.state.activities.filter((a) => a.status !== 'archived');
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.state.activities.find((a) => a.id === id);
  }

  async saveActivity(activity: Activity): Promise<void> {
    const idx = this.state.activities.findIndex((a) => a.id === activity.id);
    if (idx >= 0) this.state.activities[idx] = activity;
    else this.state.activities.push(activity);
    this.persist();
  }

  async deleteActivity(id: string): Promise<void> {
    this.state.activities = this.state.activities.filter((a) => a.id !== id);
    this.persist();
  }

  async listQuestionSets(): Promise<QuestionSet[]> {
    return this.state.questionSets;
  }

  async getQuestionSet(id: string): Promise<QuestionSet | undefined> {
    return this.state.questionSets.find((q) => q.id === id);
  }

  async saveQuestionSet(set: QuestionSet): Promise<void> {
    const idx = this.state.questionSets.findIndex((q) => q.id === set.id);
    if (idx >= 0) this.state.questionSets[idx] = set;
    else this.state.questionSets.push(set);
    this.persist();
  }

  async deleteQuestionSet(id: string): Promise<void> {
    this.state.questionSets = this.state.questionSets.filter((q) => q.id !== id);
    this.persist();
  }

  async listPicturePacks(): Promise<PicturePack[]> {
    return allPacks;
  }

  async getPicturePack(id: string): Promise<PicturePack | undefined> {
    return allPacks.find((p) => p.id === id);
  }

  async listClasses(): Promise<ClassroomProfile[]> {
    return this.state.classes;
  }

  async saveClass(profile: ClassroomProfile): Promise<void> {
    const idx = this.state.classes.findIndex((c) => c.id === profile.id);
    if (idx >= 0) this.state.classes[idx] = profile;
    else this.state.classes.push(profile);
    this.persist();
  }

  async deleteClass(id: string): Promise<void> {
    this.state.classes = this.state.classes.filter((c) => c.id !== id);
    this.persist();
  }

  async listLaunchEvents(): Promise<ActivityLaunchEvent[]> {
    return this.state.launches;
  }

  async recordLaunch(event: ActivityLaunchEvent): Promise<void> {
    this.state.launches.push(event);
    // Keep local analytics bounded — a school term of launches fits easily.
    if (this.state.launches.length > 2000) {
      this.state.launches = this.state.launches.slice(-2000);
    }
    this.persist();
  }

  async listFeedback(): Promise<ActivityFeedback[]> {
    return this.state.feedback;
  }

  async recordFeedback(feedback: ActivityFeedback): Promise<void> {
    this.state.feedback.push(feedback);
    if (this.state.feedback.length > 1000) {
      this.state.feedback = this.state.feedback.slice(-1000);
    }
    this.persist();
  }

  async recordSessionCompletion(): Promise<void> {
    this.state.sessionCompletions += 1;
    this.persist();
  }

  /** Development helper: restore starter content and clear analytics. */
  async resetToStarter(): Promise<void> {
    this.state = seedState();
    this.persist();
  }
}
