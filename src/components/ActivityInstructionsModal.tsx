import type { Activity } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import {
  ACTIVITY_TYPE_LABELS,
  DIFFICULTY_LABELS,
  GROUPING_LABELS,
  LANGUAGE_LABELS,
  MOVEMENT_LABELS,
  NOISE_LABELS,
  SUBJECT_LABELS,
} from '../types';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  ListOrdered,
  Package,
  Timer,
} from 'lucide-react';

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
        <span className="text-primary-500">{icon}</span>
        {title}
      </h4>
      <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pl-6">{children}</div>
    </div>
  );
}

export function ActivityInstructionsModal({
  activity,
  open,
  onClose,
  onLaunch,
}: {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onLaunch?: (activity: Activity) => void;
}) {
  if (!activity) return null;
  const ins = activity.instructions;
  const isGame = Boolean(activity.gameId);

  return (
    <Modal open={open} onClose={onClose} title={activity.title} wide>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{activity.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        <DetailPill label={SUBJECT_LABELS[activity.subject]} />
        <DetailPill label={`Years ${activity.years.join(', ')}`} />
        <DetailPill label={`${activity.durationMinutes} min (up to ${activity.maxDurationMinutes})`} />
        <DetailPill label={DIFFICULTY_LABELS[activity.difficulty]} />
        <DetailPill label={NOISE_LABELS[activity.noiseLevel]} />
        <DetailPill label={GROUPING_LABELS[activity.grouping]} />
        <DetailPill label={MOVEMENT_LABELS[activity.movement]} />
        <DetailPill label={LANGUAGE_LABELS[activity.language]} />
        <DetailPill label={ACTIVITY_TYPE_LABELS[activity.type]} />
      </div>

      <Section icon={<GraduationCap className="w-4 h-4" />} title="Learning purpose">
        <p>{ins.learningPurpose}</p>
      </Section>

      <Section icon={<Package className="w-4 h-4" />} title="Materials required">
        {ins.materials.length ? (
          <ul className="list-disc pl-4">
            {ins.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : (
          <p>None needed.</p>
        )}
      </Section>

      <Section icon={<Timer className="w-4 h-4" />} title="Duration & preparation">
        <p>
          Runs {activity.minDurationMinutes}–{activity.maxDurationMinutes} minutes.{' '}
          {ins.preparation}
        </p>
      </Section>

      <Section icon={<ListOrdered className="w-4 h-4" />} title="Step-by-step instructions">
        <ol className="list-decimal pl-4 space-y-1">
          {ins.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Section>

      <Section icon={<AlertTriangle className="w-4 h-4" />} title="Classroom management tips">
        <ul className="list-disc pl-4">
          {ins.classroomManagement.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Section>

      {activity.url && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 mb-4 text-sm">
          <p className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <ClipboardList className="w-4 h-4" /> External resource
          </p>
          <p className="text-amber-700/90 dark:text-amber-300/80 mt-1">
            This activity opens on an external website ({activity.url}). Preview it before class.
            ReliefHub does not host or control external content.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        {isGame ? (
          onLaunch ? (
            <Button onClick={() => onLaunch(activity)} size="lg" className="flex-1">
              <BookOpen className="w-4 h-4" /> Launch game
            </Button>
          ) : null
        ) : activity.url ? (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Open external activity ↗
          </a>
        ) : (
          <div className="flex-1 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Teacher-led — follow the steps above.
          </div>
        )}
        <Button variant="secondary" size="lg" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

function DetailPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </span>
  );
}
