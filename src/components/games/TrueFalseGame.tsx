import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  RotateCcw,
  Timer as TimerIcon,
  X,
} from 'lucide-react';
import type { Activity, Question } from '../../types';
import { useStore } from '../../store/AppStore';
import { sfx } from '../../store/SettingsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState, LoadingState } from '../ui/States';
import {
  ControlButton,
  GameControls,
  GameShell,
  TeamSetup,
  useTeams,
} from './GameShell';

/**
 * True or False — teacher-paced statement game with whole-class voting,
 * optional countdown timer, progress bar, score tracking and explanations.
 */
export default function TrueFalseGame({
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
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<'True' | 'False' | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const { teams, rename, addPoint, resetScores } = useTeams();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const set = await repo.getQuestionSet(questionSetId);
      if (!cancelled) setQuestions(set?.questions ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [repo, questionSetId]);

  const current = useMemo(() => questions?.[index] ?? null, [questions, index]);

  // Countdown timer (optional, pauses on reveal, resets each statement).
  useEffect(() => {
    if (!started || !timerEnabled || revealed || finished) return;
    if (secondsLeft <= 0) {
      sfx('wrong');
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timerEnabled, revealed, secondsLeft, finished]);

  const next = () => {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      sfx('finish');
      setFinished(true);
      return;
    }
    sfx('click');
    setIndex((i) => i + 1);
    setRevealed(false);
    setChoice(null);
    setSecondsLeft(15);
  };

  const prev = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setRevealed(false);
    setChoice(null);
    setSecondsLeft(15);
  };

  const vote = (value: 'True' | 'False') => {
    if (revealed || !current) return;
    setChoice(value);
    sfx('click');
  };

  const reveal = () => {
    if (!current || revealed) return;
    sfx('reveal');
    setRevealed(true);
    const isCorrect = choice !== null && choice === current.answer;
    if (choice !== null) {
      if (isCorrect) {
        sfx('correct');
        setScore((s) => ({ ...s, correct: s.correct + 1 }));
        addPoint(teams[0].id, 1);
      } else {
        sfx('wrong');
        setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
      }
    }
  };

  const restart = () => {
    resetScores();
    setIndex(0);
    setRevealed(false);
    setChoice(null);
    setScore({ correct: 0, wrong: 0 });
    setSecondsLeft(15);
    setFinished(false);
  };

  if (questions === null) {
    return (
      <GameShell title="True or False" onExit={onExit}>
        <LoadingState label="Loading statements…" />
      </GameShell>
    );
  }

  if (questions.length === 0) {
    return (
      <GameShell title="True or False" onExit={onExit}>
        <EmptyState
          title="No statements in this set"
          description="Ask an administrator to add true/false statements to this question set."
          action={<Button onClick={onExit}>Back</Button>}
        />
      </GameShell>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <GameShell title="True or False" onExit={onExit} activity={activity}>
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
        {/* Top bar: class score + progress + optional timer */}
        <div className="px-4 sm:px-8 pt-3 pb-2 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white/80">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                ✔ {score.correct}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300">
                ✗ {score.wrong}
              </span>
            </div>
            <span className="text-sm font-bold text-white/60">
              Statement {index + 1} / {questions.length}
            </span>
            {timerEnabled && !revealed && (
              <span
                className={`
                flex items-center gap-1.5 px-3 py-1 rounded-lg font-black tabular-nums
                ${secondsLeft <= 5 ? 'bg-rose-500/30 text-rose-200 animate-pulse' : 'bg-white/10 text-white/80'}
              `}
              >
                <TimerIcon className="w-4 h-4" />
                {secondsLeft}s
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress"
            />
          </div>
        </div>

        {/* Statement */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-5xl"
            >
              <div className="rounded-3xl bg-white/95 dark:bg-slate-800 p-8 sm:p-14 shadow-2xl">
                <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white text-center leading-snug">
                  {current?.prompt}
                </p>

                {/* Reveal */}
                <AnimatePresence>
                  {revealed && current && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <div className="flex justify-center gap-4 mb-4">
                        <VoteResult label="True" isAnswer={current.answer === 'True'} choice={choice} />
                        <VoteResult label="False" isAnswer={current.answer === 'False'} choice={choice} />
                      </div>
                      {current.explanation && (
                        <p className="text-center text-lg text-slate-600 dark:text-slate-300 px-2">
                          {current.explanation}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Voting buttons + nav */}
        <div className="pb-24 px-4">
          {!revealed ? (
            <div className="flex justify-center gap-6">
              <BigVoteButton value="True" disabled={!started} onVote={vote} chosen={choice} />
              <BigVoteButton value="False" disabled={!started} onVote={vote} chosen={choice} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Button size="lg" onClick={next} className="min-w-48">
                {index + 1 >= questions.length ? (
                  'Finish'
                ) : (
                  <>
                    Next statement <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Finished overlay */}
      {finished && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur flex flex-col items-center justify-center gap-4 p-6">
          <span className="text-7xl" aria-hidden="true">🏁</span>
          <p className="text-4xl font-black text-white">All done!</p>
          <p className="text-xl text-white/80">
            Class score: {score.correct} correct · {score.wrong} wrong
          </p>
          <div className="flex gap-3 mt-2">
            <Button size="lg" onClick={restart}>
              <RotateCcw className="w-5 h-5" /> Play again
            </Button>
            <Button size="lg" variant="secondary" onClick={onExit}>
              Exit
            </Button>
          </div>
        </div>
      )}

      <GameControls>
        <ControlButton onClick={prev} disabled={index === 0 || !started} ariaLabel="Previous statement">
          <ArrowLeft className="w-4 h-4" /> Back
        </ControlButton>
        <ControlButton onClick={() => setShowHelp(true)}>
          <HelpCircle className="w-4 h-4" /> How to play
        </ControlButton>
        <ControlButton
          onClick={() => {
            setTimerEnabled((t) => !t);
            setSecondsLeft(15);
          }}
          className={timerEnabled ? '!bg-amber-400/30 !border-amber-300/50' : ''}
        >
          <TimerIcon className="w-4 h-4" /> Timer {timerEnabled ? 'on' : 'off'}
        </ControlButton>
        <ControlButton onClick={restart} disabled={!started}>
          <RotateCcw className="w-4 h-4" /> Reset game
        </ControlButton>
        {!revealed && started && (
          <Button size="md" variant="accent" onClick={reveal}>
            Reveal answer
          </Button>
        )}
      </GameControls>

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="How to play True or False">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Read the statement aloud (twice for younger classes).</li>
          <li>Pupils vote together — hands up for True, thumbs down for False.</li>
          <li>Tap True or False to record the class vote (optional).</li>
          <li>Reveal the answer and read the explanation.</li>
          <li>Move on — the class score keeps itself automatically.</li>
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          Content: {activity ? activity.title : 'default question set'}
        </p>
      </Modal>
    </GameShell>
  );
}

function BigVoteButton({
  value,
  onVote,
  chosen,
  disabled,
}: {
  value: 'True' | 'False';
  onVote: (v: 'True' | 'False') => void;
  chosen: 'True' | 'False' | null;
  disabled: boolean;
}) {
  const isTrue = value === 'True';
  const isChosen = chosen === value;
  return (
    <button
      onClick={() => onVote(value)}
      disabled={disabled}
      className={`
        flex items-center gap-3 px-10 sm:px-16 py-5 rounded-2xl text-2xl sm:text-3xl font-black
        border-4 transition-all duration-150 active:scale-95 disabled:opacity-40
        ${
          isTrue
            ? 'bg-sky-500/15 border-sky-400 text-sky-200 hover:bg-sky-500/25'
            : 'bg-rose-500/15 border-rose-400 text-rose-200 hover:bg-rose-500/25'
        }
        ${isChosen ? 'ring-4 ring-amber-400/70 scale-105' : ''}
      `}
      aria-pressed={isChosen}
    >
      {isTrue ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
      {value}
    </button>
  );
}

function VoteResult({
  label,
  isAnswer,
  choice,
}: {
  label: 'True' | 'False';
  isAnswer: boolean;
  choice: 'True' | 'False' | null;
}) {
  return (
    <div
      className={`
        flex flex-col items-center gap-1 px-8 py-4 rounded-2xl border-2
        ${
          isAnswer
            ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_24px_-4px_rgba(52,211,153,0.5)]'
            : choice === label
              ? 'border-rose-400 bg-rose-500/10 opacity-80'
              : 'border-white/15 bg-white/5 opacity-50'
        }
      `}
    >
      <span className="text-2xl font-black text-white">{label}</span>
      {isAnswer && <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Correct</span>}
      {choice === label && !isAnswer && (
        <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Your vote</span>
      )}
    </div>
  );
}
