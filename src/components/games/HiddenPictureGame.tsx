import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, HelpCircle, Lightbulb, RotateCcw, Shuffle, Sparkles } from 'lucide-react';import type { Activity, HiddenPicture } from '../../types';
import { useStore } from '../../store/AppStore';
import { shuffle } from '../../lib/utils';
import { sfx } from '../../store/SettingsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState, LoadingState } from '../ui/States';
import {
  ControlButton,
  GameControls,
  GameShell,
  ScoreStrip,
  TeamSetup,
  useTeams,
} from './GameShell';
import { cn } from '../../lib/utils';

/**
 * Hidden Picture — a picture (emoji glyph) sits behind a grid of tiles.
 * Teacher reveals tiles one by one or randomly; pupils guess; first correct
 * guess wins. Works fully offline: pictures are prepared per pack.
 */
export default function HiddenPictureGame({
  activity,
  packId,
  onExit,
}: {
  activity?: Activity;
  packId: string;
  onExit: () => void;
}) {
  const { repo } = useStore();
  const [pictures, setPictures] = useState<HiddenPicture[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [answerShown, setAnswerShown] = useState(false);
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const { teams, rename, addPoint } = useTeams();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const pack = await repo.getPicturePack(packId);
      if (!cancelled) setPictures(pack?.pictures ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [repo, packId]);

  const current = useMemo(() => pictures?.[index] ?? null, [pictures, index]);
  const tileCount = gridSize * gridSize;

  const resetPicture = () => {
    setRevealed(new Set());
    setAnswerShown(false);
    setShowHint(false);
  };

  const revealTile = (n: number) => {
    if (revealed.has(n) || answerShown) return;
    sfx('reveal');
    setRevealed((s) => new Set(s).add(n));
  };

  const revealRandom = () => {
    const hidden = Array.from({ length: tileCount }, (_, i) => i).filter((i) => !revealed.has(i));
    if (hidden.length === 0 || answerShown) return;
    sfx('reveal');
    setRevealed((s) => new Set(s).add(hidden[Math.floor(Math.random() * hidden.length)]));
  };

  const correctGuess = (teamId?: string) => {
    sfx('correct');
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1500);
    if (teamId) addPoint(teamId, 1);
    setAnswerShown(true);
  };

  const nextPicture = () => {
    if (!pictures) return;
    sfx('click');
    if (index + 1 >= pictures.length) {
      // Loop back to start with re-shuffled order.
      setPictures((ps) => (ps ? shuffle(ps) : ps));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    resetPicture();
  };

  if (pictures === null) {
    return (
      <GameShell title="Hidden Picture" onExit={onExit}>
        <LoadingState label="Loading pictures…" />
      </GameShell>
    );
  }

  if (pictures.length === 0) {
    return (
      <GameShell title="Hidden Picture" onExit={onExit}>
        <EmptyState
          title="No pictures in this pack"
          description="Ask an administrator to add pictures to this pack, then try again."
          action={<Button onClick={onExit}>Back</Button>}
        />
      </GameShell>
    );
  }

  const revealedCount = revealed.size;

  return (
    <GameShell title="Hidden Picture" onExit={onExit} activity={activity}>
      {!started && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <TeamSetup
            open
            teams={teams}
            onRename={rename}
            onStart={() => {
              sfx('click');
              setStarted(true);
            }}
          />
        </div>
      )}

      <div className="h-full flex flex-col">
        <div className="pt-4 pb-2 px-4 shrink-0">
          <ScoreStrip teams={teams} onAddPoint={addPoint} onRename={rename} />
          <p className="text-center text-sm font-semibold text-white/60 mt-2">
            Picture {index + 1} of {pictures.length} · {revealedCount}/{tileCount} tiles revealed
          </p>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-24">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ width: 'min(62vh, 90vw)', aspectRatio: '1 / 1' }}
            role="grid"
            aria-label="Hidden picture tiles"
          >
            {/* The picture underneath */}
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-100">
              <motion.span
                key={current?.id}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="leading-none select-none"
                style={{ fontSize: 'min(38vh, 56vw)' }}
                aria-hidden="true"
              >
                {current?.emoji}
              </motion.span>
            </div>

            {/* Tiles on top */}
            <div
              className="absolute inset-0 grid gap-1 p-1"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {Array.from({ length: tileCount }, (_, i) => {
                const isRevealed = revealed.has(i) || answerShown;
                return (
                  <button
                    key={i}
                    onClick={() => revealTile(i)}
                    disabled={isRevealed}
                    aria-label={`Tile ${i + 1}${isRevealed ? ' (revealed)' : ''}`}
                    className={cn(
                      'rounded-xl transition-all duration-300 relative overflow-hidden',
                      isRevealed
                        ? 'opacity-0 pointer-events-none scale-90'
                        : 'bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 hover:from-primary-500 hover:to-indigo-700 cursor-pointer shadow-inner border border-white/10',
                    )}
                  >
                    {!isRevealed && (
                      <span className="absolute inset-0 flex items-center justify-center font-black text-white/30 text-xl">
                        {i + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer overlay */}
            <AnimatePresence>
              {answerShown && current && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-950/85 backdrop-blur-sm text-center p-4"
                >
                  <span className="text-7xl" aria-hidden="true">{current.emoji}</span>
                  <p className="text-4xl font-black text-white">{current.label}</p>
                  {showHint && <p className="text-lg text-amber-300">{current.hint}</p>}
                  <Button size="lg" className="mt-3" onClick={nextPicture}>
                    Next picture →
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Guess input for teacher */}
      {started && !answerShown && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center px-4 z-20">
          <div className="flex gap-2.5 bg-black/50 backdrop-blur rounded-2xl p-2.5 border border-white/10">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => correctGuess(t.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-colors"
              >
                {t.name} guessed it! +1
              </button>
            ))}
          </div>
        </div>
      )}

      {celebrate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <motion.span
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.3, 1] }}
            className="text-8xl drop-shadow-2xl"
            aria-hidden="true"
          >
            🎉
          </motion.span>
        </motion.div>
      )}

      <GameControls>
        <ControlButton onClick={() => setShowHelp(true)}>
          <HelpCircle className="w-4 h-4" /> How to play
        </ControlButton>
        <ControlButton onClick={revealRandom} disabled={answerShown}>
          <Shuffle className="w-4 h-4" /> Random reveal
        </ControlButton>
        <ControlButton
          onClick={() => {
            sfx('reveal');
            setShowHint((h) => !h);
          }}
          disabled={answerShown}
          className={showHint ? '!bg-amber-400/30 !border-amber-300/50' : ''}
        >
          <Lightbulb className="w-4 h-4" /> Hint {showHint ? 'on' : 'off'}
        </ControlButton>
        <ControlButton
          onClick={() => setGridSize((g) => (g === 3 ? 4 : 3))}
          disabled={answerShown}
          ariaLabel="Toggle grid size"
        >
          <Sparkles className="w-4 h-4" /> Grid {gridSize}×{gridSize}
        </ControlButton>
        <ControlButton
          onClick={() => {
            resetPicture();
            sfx('click');
          }}
        >
          <RotateCcw className="w-4 h-4" /> Reset tiles
        </ControlButton>
        {answerShown && (
          <Button size="md" onClick={nextPicture}>
            <Eye className="w-4 h-4" /> Next picture
          </Button>
        )}
      </GameControls>

      {/* Hint banner */}
      {showHint && !answerShown && current && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-amber-400/90 text-amber-950 font-bold text-sm shadow-lg">
          Hint: {current.hint}
        </div>
      )}

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="How to play Hidden Picture">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>A picture hides behind numbered tiles.</li>
          <li>Pupils (or teams) pick tiles to reveal pieces of the picture.</li>
          <li>Anyone can guess at any time — tap the team button when they get it right.</li>
          <li>Use &quot;Random reveal&quot; to surprise, or the hint to help younger classes.</li>
          <li>First team to guess correctly earns a point. Next picture!</li>
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          Pack: {activity ? activity.title : 'default picture pack'}
        </p>
      </Modal>
    </GameShell>
  );
}
