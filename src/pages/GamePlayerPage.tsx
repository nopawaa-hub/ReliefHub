import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import type { Activity, GameId } from '../types';
import { useStore } from '../store/AppStore';
import { LoadingState, EmptyState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import MysteryBoxGame from '../components/games/MysteryBoxGame';
import TrueFalseGame from '../components/games/TrueFalseGame';
import HiddenPictureGame from '../components/games/HiddenPictureGame';

/**
 * Game Player shell — resolves the activity (from ?activity=) and its question
 * set / picture pack, then renders the matching game engine. Mechanics stay
 * independent of content: swap the question set and the game is new.
 */
export default function GamePlayerPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const activityParam = searchParams.get('activity');
  const navigate = useNavigate();
  const { activities, repo, recordLaunch, loading } = useStore();

  const [questionSetIds, setQuestionSetIds] = useState<string[]>([]);
  const [packIds, setPackIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sets = await repo.listQuestionSets();
      const packs = await repo.listPicturePacks();
      if (!cancelled) {
        setQuestionSetIds(sets.map((s) => s.id));
        setPackIds(packs.map((p) => p.id));
        setDataLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  const activity: Activity | undefined = useMemo(
    () => activities.find((a) => a.id === activityParam),
    [activities, activityParam],
  );

  // Content selection: activity's own set/pack, or teacher's pick below.
  const [chosenSet, setChosenSet] = useState<string>('');
  const [chosenPack, setChosenPack] = useState<string>('');

  useEffect(() => {
    if (activity?.questionSetId) setChosenSet(activity.questionSetId);
    if (activity?.picturePackId) setChosenPack(activity.picturePackId);
  }, [activity?.questionSetId, activity?.picturePackId]);

  // Record launch once the game actually starts rendering.
  useEffect(() => {
    if (activity && gameId) void recordLaunch(activity.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity?.id, gameId]);

  if (!gameId || !['mystery-box', 'true-false', 'hidden-picture'].includes(gameId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <EmptyState
          title="Game not found"
          description="That game does not exist (yet). Head back to the game collection."
          action={
            <Button onClick={() => navigate('/games')} size="lg">
              Back to Games
            </Button>
          }
        />
      </div>
    );
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <LoadingState label="Loading game…" />
      </div>
    );
  }

  const game = gameId as GameId;

  // Provide sensible defaults when arriving without an activity context.
  const defaultSetFor = (g: GameId): string => {
    if (chosenSet) return chosenSet;
    switch (g) {
      case 'mystery-box':
        return questionSetIds.find((id) => id.startsWith('en-vocab')) ?? questionSetIds[0] ?? '';
      case 'true-false':
        return (
          questionSetIds.find((id) => id.includes('tf-mixed')) ?? questionSetIds[0] ?? ''
        );
      default:
        return '';
    }
  };

  if (game === 'mystery-box') {
    return (
      <MysteryBoxGame
        activity={activity}
        questionSetId={defaultSetFor('mystery-box')}
        onExit={() => navigate(activity ? `/library?activity=${activity.id}` : '/games')}
      />
    );
  }
  if (game === 'true-false') {
    return (
      <TrueFalseGame
        activity={activity}
        questionSetId={defaultSetFor('true-false')}
        onExit={() => navigate(activity ? `/library?activity=${activity.id}` : '/games')}
      />
    );
  }
  return (
    <HiddenPictureGame
      activity={activity}
      packId={chosenPack || packIds[0] || ''}
      onExit={() => navigate(activity ? `/library?activity=${activity.id}` : '/games')}
    />
  );
}
