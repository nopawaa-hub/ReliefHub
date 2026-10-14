import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { playSound } from '../lib/sound';

// ─── Theme (light/dark) ──────────────────────────────────────────────────────

type Theme = 'light' | 'dark';

const THEME_KEY = 'reliefhub.theme';

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return 'light';
}

// ─── Sound toggle ────────────────────────────────────────────────────────────

const SOUND_KEY = 'reliefhub.sound';

function initialSound(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

// ─── Settings context ────────────────────────────────────────────────────────

interface Settings {
  theme: Theme;
  toggleTheme: () => void;
  soundOn: boolean;
  toggleSound: () => void;
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [soundOn, setSoundOn] = useState(initialSound);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off');
    } catch {
      /* ignore */
    }
  }, [soundOn]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleSound = () => setSoundOn((s) => !s);

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, soundOn, toggleSound }}>
      <SoundGate on={soundOn}>{children}</SoundGate>
    </SettingsContext.Provider>
  );
}

/** Wraps the app so the global sound toggle can mute every playSound call. */
function SoundGate({ on, children }: { on: boolean; children: ReactNode }) {
  useEffect(() => {
    (window as unknown as { __reliefhubSoundOn?: boolean }).__reliefhubSoundOn = on;
  }, [on]);
  return <>{children}</>;
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

// ─── Muted sound player ──────────────────────────────────────────────────────
// Reads the gate flag set above. Wrapped this way so game components can call
// sfx() without each subscribing to settings context.

import type { SoundEffect } from '../lib/sound';

export function sfx(effect: SoundEffect): void {
  const gate = (window as unknown as { __reliefhubSoundOn?: boolean }).__reliefhubSoundOn;
  if (gate === false) return;
  playSound(effect);
}
