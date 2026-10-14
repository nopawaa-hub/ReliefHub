import type { ClassroomProfile } from '../types';

// Sample classroom profiles. No pupil names or personal data — only class-level facts.

export const sampleClasses: ClassroomProfile[] = [
  {
    id: 'class-1a',
    name: '1 Bestari',
    year: 1,
    pupilCount: 28,
    preferredActivities: 'Songs, picture games and short whole-class quizzes',
    noisePreference: 'moderate',
    movementPreference: 'seated',
  },
  {
    id: 'class-2b',
    name: '2 Bakti',
    year: 2,
    pupilCount: 34,
    preferredActivities: 'Whole-class quizzes and team games',
    noisePreference: 'moderate',
    movementPreference: 'seated',
  },
  {
    id: 'class-3c',
    name: '3 Cekap',
    year: 3,
    pupilCount: 31,
    preferredActivities: 'Team quiz games with points',
    noisePreference: 'lively',
    movementPreference: 'some-movement',
  },
  {
    id: 'class-4a',
    name: '4 Amanah',
    year: 4,
    pupilCount: 30,
    preferredActivities: 'Competitive quiz games, maths challenges',
    noisePreference: 'lively',
    movementPreference: 'seated',
  },
  {
    id: 'class-5d',
    name: '5 Dedikasi',
    year: 5,
    pupilCount: 29,
    preferredActivities: 'Quiet vocabulary games and puzzles',
    noisePreference: 'quiet',
    movementPreference: 'seated',
  },
  {
    id: 'class-6f',
    name: '6 Fokus',
    year: 6,
    pupilCount: 27,
    preferredActivities: 'Exam-revision quizzes in teams',
    noisePreference: 'moderate',
    movementPreference: 'seated',
  },
];
