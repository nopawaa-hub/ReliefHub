import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useStore } from '../../store/AppStore';
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  SUBJECT_LABELS,
  YEAR_LEVELS,
  type Difficulty,
  type Question,
  type QuestionKind,
  type QuestionSet,
  type Subject,
  type YearLevel,
  type ContentLanguage,
} from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Select, TextInput } from '../../components/ui/Inputs';
import { Badge } from '../../components/ui/Badge';
import { uid } from '../../lib/utils';

interface SetDraft {
  id: string;
  title: string;
  subject: Subject;
  years: YearLevel[];
  difficulty: Difficulty;
  language: ContentLanguage;
  questions: Question[];
}

function QuestionEditor({
  question,
  onChange,
  onDelete,
}: {
  question: Question;
  onChange: (q: Question) => void;
  onDelete: () => void;
}) {
  const kind = question.kind;
  const setKind = (k: QuestionKind) => {
    if (k === question.kind) return;
    if (k === 'true-false') {
      onChange({ ...question, kind: k, options: undefined, answer: 'True' });
    } else if (k === 'multiple-choice') {
      onChange({ ...question, kind: k, options: ['', '', '', ''], answer: '' });
    } else {
      onChange({ ...question, kind: k, options: undefined, answer: '' });
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Select
          value={kind}
          onChange={(e) => setKind(e.target.value as QuestionKind)}
          options={[
            { value: 'multiple-choice', label: 'Multiple choice' },
            { value: 'true-false', label: 'True / False' },
            { value: 'open-ended', label: 'Open-ended' },
          ]}
          className="w-44"
        />
        <Button variant="ghost" size="sm" onClick={onDelete} className="!text-rose-500">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <TextInput
        label={kind === 'true-false' ? 'Statement' : 'Question'}
        value={question.prompt}
        onChange={(e) => onChange({ ...question, prompt: e.target.value })}
      />

      {kind === 'multiple-choice' && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Options — the correct one is the answer below
          </span>
          {(question.options ?? ['', '', '', '']).map((opt, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-6 self-center text-center font-black text-slate-400">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                value={opt}
                onChange={(e) => {
                  const options = [...(question.options ?? [])];
                  options[i] = e.target.value;
                  onChange({ ...question, options });
                }}
                aria-label={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
          <Select
            label="Correct answer"
            value={question.answer}
            onChange={(e) => onChange({ ...question, answer: e.target.value })}
            options={(question.options ?? []).map((o) => ({ value: o, label: o || '(empty)' }))}
          />
        </div>
      )}

      {kind === 'true-false' && (
        <Select
          label="Correct answer"
          value={question.answer}
          onChange={(e) => onChange({ ...question, answer: e.target.value })}
          options={[
            { value: 'True', label: 'True' },
            { value: 'False', label: 'False' },
          ]}
        />
      )}

      {kind === 'open-ended' && (
        <TextInput
          label="Expected answer"
          value={question.answer}
          onChange={(e) => onChange({ ...question, answer: e.target.value })}
        />
      )}

      <TextInput
        label="Explanation (optional)"
        value={question.explanation ?? ''}
        onChange={(e) => onChange({ ...question, explanation: e.target.value || undefined })}
        placeholder="Shown after the answer reveal"
      />
    </Card>
  );
}

function SetForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: SetDraft | null;
  onSave: (s: QuestionSet) => void;
  onCancel: () => void;
}) {
  const now = new Date().toISOString();
  const blank: SetDraft = {
    id: uid('qs'),
    title: '',
    subject: 'english',
    years: [2],
    difficulty: 'easy',
    language: 'en',
    questions: [],
  };
  const [form, setForm] = useState<SetDraft>(initial ?? blank);
  const [error, setError] = useState<string | null>(null);

  const toggleYear = (y: YearLevel) =>
    setForm((f) => ({
      ...f,
      years: f.years.includes(y) ? f.years.filter((x) => x !== y) : [...f.years, y].sort(),
    }));

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        {
          id: uid('q'),
          kind: 'multiple-choice',
          prompt: '',
          options: ['', '', '', ''],
          answer: '',
        },
      ],
    }));

  const save = () => {
    if (form.title.trim().length < 3) {
      setError('Give this set a title (3+ characters).');
      return;
    }
    if (form.years.length === 0) {
      setError('Pick at least one year level.');
      return;
    }
    const valid = form.questions.filter(
      (q) =>
        q.prompt.trim() &&
        (q.kind !== 'multiple-choice' ||
          (q.options?.every((o) => o.trim()) && q.options.includes(q.answer))),
    );
    if (valid.length === 0) {
      setError('Add at least one complete question (prompt + valid options/answer).');
      return;
    }
    onSave({
      ...form,
      title: form.title.trim(),
      questions: valid.map((q) => ({ ...q, prompt: q.prompt.trim() })),
    });
    void now;
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Set title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="e.g. English: Past Tense Practice"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Subject"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value as Subject }))}
          options={(Object.keys(SUBJECT_LABELS) as (Subject | 'any')[])
            .filter((s) => s !== 'any')
            .map((s) => ({ value: s, label: SUBJECT_LABELS[s] }))}
        />
        <Select
          label="Difficulty"
          value={form.difficulty}
          onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}
          options={(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => ({
            value: d,
            label: DIFFICULTY_LABELS[d],
          }))}
        />
        <Select
          label="Language"
          value={form.language}
          onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as ContentLanguage }))}
          options={(Object.keys(LANGUAGE_LABELS) as ContentLanguage[]).map((l) => ({
            value: l,
            label: LANGUAGE_LABELS[l],
          }))}
        />
      </div>
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Year levels
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {YEAR_LEVELS.map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={form.years.includes(y)}
              onClick={() => toggleYear(y)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                form.years.includes(y)
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
              }`}
            >
              Year {y}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {form.questions.map((q) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={(nq) =>
              setForm((f) => ({
                ...f,
                questions: f.questions.map((x) => (x.id === q.id ? nq : x)),
              }))
            }
            onDelete={() =>
              setForm((f) => ({
                ...f,
                questions: f.questions.filter((x) => x.id !== q.id),
              }))
            }
          />
        ))}
        <Button variant="secondary" onClick={addQuestion}>
          <Plus className="w-4 h-4" /> Add question ({form.questions.length})
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={save}>
          <Save className="w-4 h-4" /> Save question set
        </Button>
      </div>
    </div>
  );
}

export default function AdminQuestionsPage() {
  const { repo } = useStore();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SetDraft | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    setLoading(true);
    const list = await repo.listQuestionSets();
    setSets(list);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalQuestions = useMemo(
    () => sets.reduce((s, x) => s + x.questions.length, 0),
    [sets],
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Question Bank
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {sets.length} question sets · {totalQuestions} questions powering the original games
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" /> New question set
        </Button>
      </header>

      {loading ? (
        <p className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((s) => (
            <Card key={s.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{s.title}</h3>
                <Badge color="indigo">{s.questions.length} Q</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                {SUBJECT_LABELS[s.subject]} · Years {s.years.join(',')} ·{' '}
                {DIFFICULTY_LABELS[s.difficulty]}
              </p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">
                id: {s.id}
              </p>
              <div className="mt-auto flex gap-1.5 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    setEditing({
                      id: s.id,
                      title: s.title,
                      subject: s.subject,
                      years: s.years,
                      difficulty: s.difficulty,
                      language: s.language,
                      questions: s.questions,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-rose-500"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete question set "${s.title}"? Activities using it will fall back to their default content.`,
                      )
                    ) {
                      void repo.deleteQuestionSet(s.id).then(reload);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New question set" wide>
        <SetForm
          initial={null}
          onCancel={() => setCreating(false)}
          onSave={(s) => {
            void repo.saveQuestionSet(s).then(reload);
            setCreating(false);
          }}
        />
      </Modal>
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit question set"
        wide
      >
        {editing && (
          <SetForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(s) => {
              void repo.saveQuestionSet(s).then(reload);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
