import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../store/AppStore';
import {
  ACTIVITY_TYPE_LABELS,
  DIFFICULTY_LABELS,
  GROUPING_LABELS,
  LANGUAGE_LABELS,
  MOVEMENT_LABELS,
  NOISE_LABELS,
  SUBJECT_LABELS,
  YEAR_LEVELS,
  PHASE_LABELS,
  type Activity,
  type ActivityStatus,
  type ActivityType,
  type Difficulty,
  type GroupingFormat,
  type ContentLanguage,
  type MovementRequirement,
  type NoiseLevel,
  type SessionPhase,
  type Subject,
  type YearLevel,
} from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Select, TextArea, TextInput } from '../../components/ui/Inputs';
import { Badge } from '../../components/ui/Badge';
import { uid } from '../../lib/utils';

/** Create / edit activity form shared by add and edit flows. */
function ActivityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Activity | null;
  onSave: (a: Activity) => void;
  onCancel: () => void;
}) {
  const { repo } = useStore();
  const [questionSets, setQuestionSets] = useState<{ id: string; title: string }[]>([]);
  const [packs, setPacks] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    void (async () => {
      const sets = await repo.listQuestionSets();
      const p = await repo.listPicturePacks();
      setQuestionSets(sets.map((s) => ({ id: s.id, title: s.title })));
      setPacks(p.map((x) => ({ id: x.id, title: x.title })));
    })();
  }, [repo]);

  const now = new Date().toISOString();
  const blank: Activity = {
    id: uid('act'),
    title: '',
    description: '',
    type: 'reliefhub-game',
    source: 'original',
    subject: 'english',
    years: [2],
    durationMinutes: 15,
    minDurationMinutes: 10,
    maxDurationMinutes: 20,
    difficulty: 'easy',
    noiseLevel: 'moderate',
    grouping: 'whole-class',
    language: 'en',
    movement: 'seated',
    phase: 'main',
    readyToPlay: true,
    instructions: {
      learningPurpose: '',
      materials: [],
      preparation: 'None — ready to play immediately.',
      steps: [],
      classroomManagement: [],
    },
    status: 'approved',
    createdAt: now,
    updatedAt: now,
  };

  const [form, setForm] = useState<Activity>(initial ?? blank);
  const [error, setError] = useState<string | null>(null);
  const [materialsText, setMaterialsText] = useState(
    (initial?.instructions.materials ?? []).join('\n'),
  );
  const [stepsText, setStepsText] = useState((initial?.instructions.steps ?? []).join('\n'));
  const [managementText, setManagementText] = useState(
    (initial?.instructions.classroomManagement ?? []).join('\n'),
  );

  const set = <K extends keyof Activity>(key: K, value: Activity[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleYear = (y: YearLevel) =>
    setForm((f) => ({
      ...f,
      years: f.years.includes(y) ? f.years.filter((x) => x !== y) : [...f.years, y].sort(),
    }));

  const save = () => {
    if (form.title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (form.years.length === 0) {
      setError('Select at least one year level.');
      return;
    }
    if (form.minDurationMinutes > form.maxDurationMinutes) {
      setError('Minimum duration cannot exceed maximum duration.');
      return;
    }
    const lines = (t: string) =>
      t
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      updatedAt: now,
      instructions: {
        ...form.instructions,
        learningPurpose: form.instructions.learningPurpose.trim(),
        materials: lines(materialsText),
        steps: lines(stepsText),
        classroomManagement: lines(managementText),
      },
    });
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Title"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        placeholder="e.g. Mystery Box: Science Lab"
      />
      <TextArea
        label="Short description"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        rows={2}
        placeholder="One or two sentences shown on the activity card."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => set('type', e.target.value as ActivityType)}
          options={(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((t) => ({
            value: t,
            label: ACTIVITY_TYPE_LABELS[t],
          }))}
        />
        <Select
          label="Subject"
          value={form.subject}
          onChange={(e) => set('subject', e.target.value as Subject)}
          options={(Object.keys(SUBJECT_LABELS) as (Subject | 'any')[])
            .filter((s) => s !== 'any')
            .map((s) => ({ value: s, label: SUBJECT_LABELS[s] }))}
        />
        <Select
          label="Difficulty"
          value={form.difficulty}
          onChange={(e) => set('difficulty', e.target.value as Difficulty)}
          options={(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => ({
            value: d,
            label: DIFFICULTY_LABELS[d],
          }))}
        />
        <Select
          label="Noise level"
          value={form.noiseLevel}
          onChange={(e) => set('noiseLevel', e.target.value as NoiseLevel)}
          options={(Object.keys(NOISE_LABELS) as NoiseLevel[]).map((n) => ({
            value: n,
            label: NOISE_LABELS[n],
          }))}
        />
        <Select
          label="Grouping"
          value={form.grouping}
          onChange={(e) => set('grouping', e.target.value as GroupingFormat)}
          options={(Object.keys(GROUPING_LABELS) as GroupingFormat[]).map((g) => ({
            value: g,
            label: GROUPING_LABELS[g],
          }))}
        />
        <Select
          label="Language"
          value={form.language}
          onChange={(e) => set('language', e.target.value as ContentLanguage)}
          options={(Object.keys(LANGUAGE_LABELS) as ContentLanguage[]).map((l) => ({
            value: l,
            label: LANGUAGE_LABELS[l],
          }))}
        />
        <Select
          label="Movement"
          value={form.movement}
          onChange={(e) => set('movement', e.target.value as MovementRequirement)}
          options={(Object.keys(MOVEMENT_LABELS) as MovementRequirement[]).map((m) => ({
            value: m,
            label: MOVEMENT_LABELS[m],
          }))}
        />
        <Select
          label="Session phase"
          value={form.phase}
          onChange={(e) => set('phase', e.target.value as SessionPhase)}
          options={(Object.keys(PHASE_LABELS) as SessionPhase[]).map((p) => ({
            value: p,
            label: PHASE_LABELS[p],
          }))}
        />
      </div>

      {/* Years */}
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

      {/* Durations */}
      <div className="grid grid-cols-3 gap-3">
        <TextInput
          label="Typical minutes"
          type="number"
          min={1}
          max={120}
          value={form.durationMinutes}
          onChange={(e) => set('durationMinutes', Number(e.target.value) || 0)}
        />
        <TextInput
          label="Min minutes"
          type="number"
          min={1}
          max={120}
          value={form.minDurationMinutes}
          onChange={(e) => set('minDurationMinutes', Number(e.target.value) || 0)}
        />
        <TextInput
          label="Max minutes"
          type="number"
          min={1}
          max={120}
          value={form.maxDurationMinutes}
          onChange={(e) => set('maxDurationMinutes', Number(e.target.value) || 0)}
        />
      </div>

      {/* Game / external content links */}
      {form.type === 'reliefhub-game' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Game"
            value={form.gameId ?? ''}
            onChange={(e) =>
              set(
                'gameId',
                (e.target.value || undefined) as Activity['gameId'],
              )
            }
            options={[
              { value: '', label: '— none —' },
              { value: 'mystery-box', label: 'Mystery Box' },
              { value: 'true-false', label: 'True or False' },
              { value: 'hidden-picture', label: 'Hidden Picture' },
            ]}
          />
          <Select
            label="Question set / picture pack"
            value={form.questionSetId ?? form.picturePackId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (v.startsWith('pack-')) {
                set('picturePackId', v);
                set('questionSetId', undefined);
              } else {
                set('questionSetId', v || undefined);
                set('picturePackId', undefined);
              }
            }}
            options={[
              { value: '', label: '— none —' },
              ...questionSets.map((s) => ({ value: s.id, label: `❓ ${s.title}` })),
              ...packs.map((p) => ({ value: p.id, label: `🖼 ${p.title}` })),
            ]}
          />
        </div>
      )}
      {(form.type === 'baamboozle' ||
        form.type === 'wordwall' ||
        form.type === 'video' ||
        form.type === 'external-activity' ||
        form.type === 'presentation') && (
        <TextInput
          label="External URL (must be verified before publishing)"
          type="url"
          value={form.url ?? ''}
          onChange={(e) => set('url', e.target.value || undefined)}
          placeholder="https://…"
        />
      )}

      {/* Instructions */}
      <TextArea
        label="Learning purpose"
        value={form.instructions.learningPurpose}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            instructions: { ...f.instructions, learningPurpose: e.target.value },
          }))
        }
        rows={2}
      />
      <TextArea
        label="Materials (one per line)"
        value={materialsText}
        onChange={(e) => setMaterialsText(e.target.value)}
        rows={2}
      />
      <TextArea
        label="Steps (one per line)"
        value={stepsText}
        onChange={(e) => setStepsText(e.target.value)}
        rows={4}
      />
      <TextArea
        label="Classroom management tips (one per line)"
        value={managementText}
        onChange={(e) => setManagementText(e.target.value)}
        rows={2}
      />

      {/* Status */}
      <Select
        label="Status"
        value={form.status}
        onChange={(e) => set('status', e.target.value as ActivityStatus)}
        options={[
          { value: 'approved', label: 'Approved (visible to teachers)' },
          { value: 'pending', label: 'Pending review' },
          { value: 'archived', label: 'Archived (hidden)' },
        ]}
      />

      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={save}>Save activity</Button>
      </div>
    </div>
  );
}

export default function AdminActivitiesPage() {
  const { activities, saveActivity, deleteActivity, loading } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Activity | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...activities];
    return (
      q ? list.filter((a) => `${a.title} ${a.description}`.toLowerCase().includes(q)) : list
    ).sort((a, b) => a.title.localeCompare(b.title));
  }, [activities, query]);

  const setStatus = async (a: Activity, status: ActivityStatus) => {
    setBusyId(a.id);
    await saveActivity({ ...a, status });
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Activity Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activities.length} activities · only &quot;approved&quot; items are visible to teachers
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" /> Add activity
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activities…"
          aria-label="Search activities"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} className="p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-56">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 dark:text-white">{a.title}</h3>
                  <Badge
                    color={
                      a.status === 'approved' ? 'emerald' : a.status === 'pending' ? 'amber' : 'slate'
                    }
                  >
                    {a.status}
                  </Badge>
                  {a.source === 'external' && <Badge color="slate">External</Badge>}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {SUBJECT_LABELS[a.subject]} · Years {a.years.join(',')} · {a.durationMinutes} min
                  · {DIFFICULTY_LABELS[a.difficulty]} · {ACTIVITY_TYPE_LABELS[a.type]}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {a.status !== 'approved' && (
                  <button
                    onClick={() => void setStatus(a, 'approved')}
                    disabled={busyId === a.id}
                    aria-label={`Approve ${a.title}`}
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                    title="Approve"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                {a.status === 'approved' && (
                  <button
                    onClick={() => void setStatus(a, 'archived')}
                    disabled={busyId === a.id}
                    aria-label={`Archive ${a.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}
                {a.status === 'archived' && (
                  <button
                    onClick={() => void setStatus(a, 'approved')}
                    disabled={busyId === a.id}
                    aria-label={`Restore ${a.title}`}
                    className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setEditing(a)}
                  aria-label={`Edit ${a.title}`}
                  className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${a.title}"? This cannot be undone.`)) {
                      void deleteActivity(a.id);
                    }
                  }}
                  aria-label={`Delete ${a.title}`}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> No activities match this search.
            </p>
          )}
        </div>
      )}

      {/* Editor modals */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Add activity" wide>
        <ActivityForm
          initial={null}
          onCancel={() => setCreating(false)}
          onSave={(a) => {
            void saveActivity(a);
            setCreating(false);
          }}
        />
      </Modal>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit activity" wide>
        {editing && (
          <ActivityForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(a) => {
              void saveActivity(a);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
