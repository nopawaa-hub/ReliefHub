import { useState } from 'react';
import { useStore } from '../store/AppStore';
import { FEEDBACK_RATING_LABELS, type Activity, type FeedbackRating } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { TextArea } from './ui/Inputs';
import { cn } from '../lib/utils';

/**
 * Post-activity feedback: "Was this activity suitable for your relief class?"
 * Optional comment. Stored anonymously (no teacher or pupil identity).
 */
export function FeedbackModal({
  activity,
  open,
  onClose,
}: {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
}) {
  const { recordFeedback } = useStore();
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!activity) return null;

  const submit = async () => {
    if (!rating) return;
    setBusy(true);
    await recordFeedback(activity.id, rating, comment);
    setBusy(false);
    setSaved(true);
  };

  const close = () => {
    onClose();
    // Reset for the next time it's opened.
    setTimeout(() => {
      setRating(null);
      setComment('');
      setSaved(false);
    }, 250);
  };

  return (
    <Modal open={open} onClose={close} title="Quick feedback">
      {saved ? (
        <div className="text-center py-6">
          <span className="text-5xl" aria-hidden="true">🙏</span>
          <p className="font-bold text-slate-900 dark:text-white mt-3">
            Thank you — feedback recorded!
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            It helps the school improve ReliefHub&apos;s activity library.
          </p>
          <Button className="mt-5" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
            Was “{activity.title}” suitable for your relief class?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Suitability rating">
            {(Object.keys(FEEDBACK_RATING_LABELS) as FeedbackRating[]).map((r) => (
              <button
                key={r}
                role="radio"
                aria-checked={rating === r}
                onClick={() => setRating(r)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all text-center',
                  rating === r
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300'
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-primary-300',
                )}
              >
                {FEEDBACK_RATING_LABELS[r]}
              </button>
            ))}
          </div>
          <TextArea
            label="Comments (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Anything to note for the next teacher?"
            className="mt-4"
          />
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="secondary" onClick={close}>
              Skip
            </Button>
            <Button onClick={() => void submit()} disabled={!rating || busy}>
              {busy ? 'Saving…' : 'Submit feedback'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
