import type { Difficulty, Question, QuestionSet, Subject, YearLevel, ContentLanguage } from '../types';

/** Multiple-choice question builder. First option is NOT necessarily correct — pass the answer explicitly. */
export function mc(
  id: string,
  prompt: string,
  options: string[],
  answer: string,
  explanation?: string,
): Question {
  if (!options.includes(answer)) {
    throw new Error(`Question ${id}: answer "${answer}" must be one of the options`);
  }
  return { id, kind: 'multiple-choice', prompt, options, answer, explanation };
}

/** True/false statement builder. */
export function tf(
  id: string,
  statement: string,
  isTrue: boolean,
  explanation?: string,
): Question {
  return {
    id,
    kind: 'true-false',
    prompt: statement,
    answer: isTrue ? 'True' : 'False',
    explanation,
  };
}

/** Open-ended question (teacher verifies the spoken answer). */
export function oe(id: string, prompt: string, answer: string, explanation?: string): Question {
  return { id, kind: 'open-ended', prompt, answer, explanation };
}

export function makeSet(
  id: string,
  title: string,
  subject: Subject,
  years: YearLevel[],
  difficulty: Difficulty,
  questions: Question[],
  language: ContentLanguage = 'en',
): QuestionSet {
  return { id, title, subject, years, difficulty, language, questions };
}
