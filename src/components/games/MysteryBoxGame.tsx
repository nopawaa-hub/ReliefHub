import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, HelpCircle, RefreshCw, RotateCcw, Shuffle } from 'lucide-react';
import type { Activity, Question } from '../../types';
import { useStore } from '../../store/AppStore';
import { shuffle } from '../../lib/utils';
import { sfx } from '../../store/SettingsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState, LoadingState } from '../ui/States';
import {
  ControlButton,
  GameControls,
  GameMessage,
  GameShell,
  ScoreStrip,
  TeamSetup,
  useTeams,
} from './GameShell';
import { QuestionDisplay } from './QuestionDisplay';

const BOX_COUNT = 6;
const BOX_EMOJI = ['🎁', '📦', '🎀', '🧰', '🗜️', '🗃️'];

interface BoxState {
  id: number;
  question: Question | null;
  opened: boolean;
}

/**
 * Mystery Box — teams pick numbered boxes hiding questions.
 * Mechanics only: content comes entirely from the question set.
 */
export default function MysteryBoxGame({
  activity,
  questionSetId,
  onExit,
}: {
  activity?: Activity;
  questionSetId: string;
  onExit: () => void;
}) {
  const { repo } = useStore();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [turn, setTurn] = useState(0); // team index whose turn it is
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const { teams, rename, addPoint, resetScores } = useTeams();

  // Load question set once.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const set = await repo.getQuestionSet(questionSetId);
        if (!cancelled) {
          const loaded = set?.questions ?? [];
          setQuestions(loaded);
          setLoadError(loaded.length === 0);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repo, questionSetId]);

  // Deal questions into boxes on start / restart.
  const deal = (pool: Question[]) => {
    const picked = shuffle(pool).slice(0, BOX_COUNT);
    setBoxes(
      Array.from({ length: BOX_COUNT }, (_, i) => ({
        id: i,
        question: picked[i] ?? null,
        opened: false,
      })),
    );
    setActiveBox(null);
    setRevealed(false);
    setTurn(0);
  };

  useEffect(() => {
    if (questions && questions.length > 0 && boxes.length === 0) deal(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const activeTeam = teams[turn % Math.max(1, teams.length)];
  const openedCount = boxes.filter((b) => b.opened).length;

  const openBox = (id: number) => {
    if (activeBox !== null || !started) return;
    const box = boxes[id];
    if (!box || box.opened || !box.question) return;
    sfx('open');
    setActiveBox(id);
    setRevealed(false);
  };

  const revealAnswer = () => {
    if (activeBox === null) return;
    sfx('reveal');
    setRevealed(true);
  };

  const award = (correct: boolean) => {
    if (activeBox === null) return;
    const box = boxes[activeBox];
    if (!box) return;
    if (correct) {
      sfx('correct');
      addPoint(activeTeam.id, 1);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1400);
    } else {
      sfx('wrong');
    }
    // Mark box done, move to next team & next box.
    setBoxes((bs) => bs.map((b) => (b.id === box.id ? { ...b, opened: true } : b)));
    setActiveBox(null);
    setRevealed(false);
    setTurn((t) => t + 1);
  };

  const restart = () => {
    resetScores();
    if (questions) deal(questions);
  };

  const activeQuestion = useMemo(
    () => (activeBox !== null ? boxes[activeBox]?.question ?? null : null),
    [activeBox, boxes],
  );

  // Preload question data for display logic.
  if (questions === null && !loadError) {
    return (
      <GameShell title="Mystery Box" onExit={onExit}>
        <LoadingState label="Loading questions…" />
      </GameShell>
    );
  }

  if (loadError || !questions || questions.length === 0) {
    return (
      <GameShell title="Mystery Box" onExit={onExit} activity={activity}>
        <EmptyState
          title="No questions in this set"
          description="Ask an administrator to add questions to this question set, then try again."
          action={<Button onClick={onExit}>Back</Button>}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Mystery Box" onExit={onExit} activity={activity}>
      {/* Pregame team naming */}
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
        {/* Scoreboard */}
        <div className="pt-4 pb-2 px-4 shrink-0">
          <ScoreStrip
            teams={teams}
            onAddPoint={addPoint}
            onRename={rename}
            activeTeamId={started ? activeTeam?.id : undefined}
          />
          {started && (
            <p className="text-center text-sm font-semibold text-amber-300 mt-2">
              {activeTeam?.name}&apos;s turn — pick a box!
            </p>
          )}
        </div>

        {/* Boxes / question area */}
        <div className="flex-1 min-h-0 px-4 sm:px-8 pb-24 flex flex-col">
          {activeBox === null ? (
            <div className="flex-1 grid grid-cols-3 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-5 content-center">
              {boxes.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openBox(b.id)}
                  disabled={b.opened || !started}
                  aria-label={`Mystery box ${b.id + 1}${b.opened ? ' (already opened)' : ''}`}
                  className={`
                    group relative aspect-square rounded-3xl transition-all duration-200
                    ${
                      b.opened
                        ? 'bg-white/5 border border-white/10 opacity-30 cursor-not-allowed'
                        : 'bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-amber-300 shadow-[0_8px_30px_-6px_rgba(251,191,36,0.5)] hover:scale-105 hover:shadow-glow active:scale-95 cursor-pointer'
                    }
                  `}
                >
                  {b.opened ? (
                    <span className="text-5xl sm:text-6xl opacity-60 grayscale" aria-hidden="true">
                      ␡
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl sm:text-6xl drop-shadow group-hover:animate-wiggle" aria-hidden="true">
                        {BOX_EMOJI[b.id % BOX_EMOJI.length]}
                      </span>
                      <span className="absolute top-2.5 left-3 font-black text-2xl text-white/90">
                        {b.id + 1}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeBox}-${revealed}`}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="w-full max-w-4xl"
                >
                  <QuestionDisplay
                    question={activeQuestion}
                    revealAnswer={revealed}
                    accent="amber"
                  />
                </motion.div>
              </AnimatePresence>

              {!revealed ? (
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button size="lg" variant="accent" onClick={revealAnswer}>
                    <Eye className="w-5 h-5" /> Reveal Answer
                  </Button>
                  <ControlButton onClick={() => award(false)}>
                    Skip (no point)
                  </ControlButton>
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button size="lg" onClick={() => award(true)}>
                    ✔ Correct — award point
                  </Button>
                  <ControlButton variant="danger" onClick={() => award(false)}>
                    ✗ Wrong — no point
                  </ControlButton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Game end banner */}
        {openedCount === BOX_COUNT && activeBox === null && started && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur flex flex-col items-center justify-center gap-5 p-6">
            <GameMessage
              show
              emoji="🏆"
              title={
                teams[0].score === teams[1].score
                  ? "It's a tie!"
                  : `${teams.slice().sort((a, b) => b.score - a.score)[0].name} wins!`
              }
              subtitle={`${teams[0].name} ${teams[0].score} — ${teams[1].score} ${teams[1].name}`}
            />
            <div className="flex gap-3 mt-4">
              <Button size="lg" onClick={restart}>
                <RotateCcw className="w-5 h-5" /> Play again
              </Button>
              <Button size="lg" variant="secondary" onClick={onExit}>
                Exit
              </Button>
            </div>
          </div>
        )}
      </div>

      <GameMessage show={celebrate} emoji="🎉" title="Point banked!" subtitle="Great teamwork" />

      {/* Teacher controls */}
      <GameControls>
        <ControlButton onClick={() => setShowHelp(true)} ariaLabel="How to play">
          <HelpCircle className="w-4 h-4" /> How to play
        </ControlButton>
        <ControlButton
          onClick={() => {
            setBoxes((bs) => bs.map((b) => ({ ...b, question: b.question })));
            if (questions) deal(questions);
          }}
          disabled={activeBox !== null}
        >
          <Shuffle className="w-4 h-4" /> New questions
        </ControlButton>
        <ControlButton onClick={restart} disabled={activeBox !== null}>
          <RefreshCw className="w-4 h-4" /> Reset game
        </ControlButton>
      </GameControls>

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="How to play Mystery Box">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Split the class into two teams and enter their names.</li>
          <li>Teams take turns picking a numbered box.</li>
          <li>Read the question aloud and let the team answer.</li>
          <li>Reveal the answer, then award a point if correct.</li>
          <li>The box disappears — next team picks. Highest score wins!</li>
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          Content: {activity ? `${activity.title} question set` : 'default question set'}
        </p>
      </Modal>
    </GameShell>
  );
}
