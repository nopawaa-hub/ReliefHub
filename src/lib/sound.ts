/**
 * Tiny WebAudio sound-effect synth — no audio files needed, works offline.
 * All effects are short, classroom-friendly chimes/clicks.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // Browsers suspend audio until a user gesture; resume when possible.
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType,
  volume: number,
): void {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, audio.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + startAt + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(audio.currentTime + startAt);
  osc.stop(audio.currentTime + startAt + duration + 0.05);
}

export type SoundEffect =
  | 'click'
  | 'open'
  | 'correct'
  | 'wrong'
  | 'reveal'
  | 'point'
  | 'tick'
  | 'alarm'
  | 'finish';

/** Plays a named effect. Silently no-ops when the browser blocks audio. */
export function playSound(effect: SoundEffect): void {
  switch (effect) {
    case 'click':
      tone(600, 0, 0.06, 'triangle', 0.12);
      break;
    case 'open':
      tone(440, 0, 0.1, 'sine', 0.15);
      tone(660, 0.07, 0.12, 'sine', 0.15);
      break;
    case 'correct':
      tone(523, 0, 0.12, 'sine', 0.18);
      tone(659, 0.1, 0.12, 'sine', 0.18);
      tone(784, 0.2, 0.22, 'sine', 0.18);
      break;
    case 'wrong':
      tone(300, 0, 0.18, 'sawtooth', 0.1);
      tone(220, 0.12, 0.25, 'sawtooth', 0.1);
      break;
    case 'reveal':
      tone(880, 0, 0.1, 'triangle', 0.12);
      tone(1175, 0.08, 0.16, 'triangle', 0.12);
      break;
    case 'point':
      tone(784, 0, 0.08, 'square', 0.08);
      tone(1046, 0.06, 0.12, 'square', 0.08);
      break;
    case 'tick':
      tone(1000, 0, 0.03, 'square', 0.05);
      break;
    case 'alarm':
      for (let i = 0; i < 4; i++) tone(880, i * 0.25, 0.18, 'sine', 0.2);
      break;
    case 'finish':
      tone(523, 0, 0.14, 'sine', 0.16);
      tone(523, 0.16, 0.14, 'sine', 0.16);
      tone(523, 0.32, 0.14, 'sine', 0.16);
      tone(659, 0.48, 0.3, 'sine', 0.16);
      break;
  }
}
