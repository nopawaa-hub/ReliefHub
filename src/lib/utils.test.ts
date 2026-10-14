import { describe, expect, it } from 'vitest';
import {
  answersMatch,
  clamp,
  formatClock,
  formatMinutes,
  hashString,
  normalizeAnswer,
  seededShuffle,
  uid,
} from './utils';

describe('utils', () => {
  it('seededShuffle is deterministic and does not mutate input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const a = seededShuffle(input, 42);
    const b = seededShuffle(input, 42);
    expect(a).toEqual(b);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(a.slice().sort()).toEqual(input);
  });

  it('different seeds usually give different orders', () => {
    const input = Array.from({ length: 20 }, (_, i) => i);
    const a = seededShuffle(input, 1);
    const b = seededShuffle(input, 2);
    expect(a).not.toEqual(b);
  });

  it('hashString is stable', () => {
    expect(hashString('reliefhub')).toBe(hashString('reliefhub'));
    expect(hashString('reliefhub')).not.toBe(hashString('reliefhub2'));
  });

  it('clamp constrains values', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-2, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });

  it('formatMinutes formats hours and minutes', () => {
    expect(formatMinutes(25)).toBe('25m');
    expect(formatMinutes(60)).toBe('1h');
    expect(formatMinutes(75)).toBe('1h 15m');
  });

  it('formatClock formats m:ss', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(600)).toBe('10:00');
    expect(formatClock(-5)).toBe('0:00');
  });

  it('normalizeAnswer and answersMatch are forgiving', () => {
    expect(normalizeAnswer('  Elephant!! ')).toBe('elephant');
    expect(answersMatch('Elephant.', 'elephant')).toBe(true);
    expect(answersMatch('True', 'False')).toBe(false);
    expect(answersMatch('Kuala  Lumpur', 'kuala lumpur')).toBe(true);
  });

  it('uid produces prefixed unique ids', () => {
    const a = uid('act');
    const b = uid('act');
    expect(a).not.toBe(b);
    expect(a.startsWith('act_')).toBe(true);
  });
});
