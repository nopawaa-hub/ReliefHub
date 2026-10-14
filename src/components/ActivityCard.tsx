import { Clock, Users, Volume2, Zap } from 'lucide-react';
import type { Activity } from '../types';
import {
  ACTIVITY_TYPE_LABELS,
  DIFFICULTY_LABELS,
  NOISE_LABELS,
  SUBJECT_LABELS,
} from '../types';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Button, LinkButton } from './ui/Button';
import { cn } from '../lib/utils';

const subjectBadgeColor: Record<string, 'indigo' | 'amber' | 'emerald' | 'sky' | 'violet' | 'teal'> = {
  english: 'sky',
  'bahasa-melayu': 'teal',
  mathematics: 'indigo',
  science: 'emerald',
  'general-knowledge': 'amber',
};

function playTarget(activity: Activity): string {
  if (activity.gameId) return `/games/${activity.gameId}?activity=${activity.id}`;
  if (activity.url) return activity.url;
  return `/library?activity=${activity.id}`;
}

export function ActivityCard({
  activity,
  onInstructions,
  onLaunch,
}: {
  activity: Activity;
  onInstructions?: (activity: Activity) => void;
  onLaunch?: (activity: Activity) => void;
}) {
  const isGame = Boolean(activity.gameId);
  const isExternal = activity.type === 'baamboozle' || activity.type === 'wordwall' || activity.type === 'video' || activity.type === 'external-activity';

  return (
    <Card hover className="flex flex-col p-5 h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          {activity.title}
        </h3>
        <Badge color={activity.source === 'original' ? 'violet' : 'slate'}>
          {activity.source === 'original' ? 'Original' : 'External'}
        </Badge>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
        {activity.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge color={subjectBadgeColor[activity.subject] ?? 'slate'}>
          {SUBJECT_LABELS[activity.subject]}
        </Badge>
        <Badge color="slate">
          <Clock className="w-3 h-3" />
          {activity.durationMinutes} min
        </Badge>
        <Badge color="slate">Year {activity.years[0]}–{activity.years[activity.years.length - 1]}</Badge>
        <Badge color="slate">{DIFFICULTY_LABELS[activity.difficulty]}</Badge>
        <Badge color="slate">
          <Volume2 className="w-3 h-3" />
          {NOISE_LABELS[activity.noiseLevel]}
        </Badge>
        <Badge color="slate">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
        {activity.readyToPlay && (
          <Badge color="emerald">
            <Zap className="w-3 h-3" />
            Ready to play
          </Badge>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2">
        {isGame ? (
          onLaunch ? (
            <Button size="sm" onClick={() => onLaunch(activity)} className="flex-1">
              Play
            </Button>
          ) : (
            <LinkButton to={playTarget(activity)} size="sm" className="flex-1">
              Play
            </LinkButton>
          )
        ) : isExternal ? (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Open Source ↗
          </a>
        ) : (
          <span
            className={cn(
              'flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-lg',
              'bg-teal-600/10 text-teal-700 dark:text-teal-300',
            )}
          >
            <Users className="w-4 h-4 mr-1" />
            Teacher-led
          </span>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onInstructions?.(activity)}
          disabled={!onInstructions}
          title={!onInstructions ? 'Open the library for full details' : 'View instructions'}
          className={cn(!onInstructions && 'opacity-60')}
        >
          Instructions
        </Button>
      </div>
    </Card>
  );
}
