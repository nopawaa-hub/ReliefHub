import type { ReliefSession, SessionRequest } from '../types';

/**
 * Sessions live in sessionStorage: they survive navigation between the
 * player, games and toolkit within the relief period, but don't linger
 * between school days (no stale half-finished sessions for teachers).
 */

export interface StoredSession {
  session: ReliefSession;
  /** Original request so replacements respect the teacher's constraints. */
  request?: SessionRequest;
  /** Activity ids offered as replacements and declined — don't re-offer. */
  skipHistory: string[];
}

const PREFIX = 'reliefhub.session.';

export function saveSession(data: StoredSession): string {
  // Fresh id each save — sessions are immutable plans plus local progress.
  const id = `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  try {
    sessionStorage.setItem(PREFIX + id, JSON.stringify(data));
    // Keep only the newest few sessions.
    pruneOldSessions(5);
  } catch {
    /* storage unavailable — session still works in-memory for this page */
  }
  return id;
}

export function loadSession(id: string): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function updateSession(id: string, data: StoredSession): void {
  try {
    sessionStorage.setItem(PREFIX + id, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function pruneOldSessions(keep: number): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    // Keys embed creation time in base36; sort ascending and drop oldest.
    keys.sort();
    const toRemove = keys.slice(0, Math.max(0, keys.length - keep));
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
