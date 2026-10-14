import { useEffect, useState } from 'react';
import { Lock, Pencil, Plus, Save, Trash2, Users } from 'lucide-react';
import { useStore } from '../store/AppStore';
import { useAdminAuth } from '../store/AdminAuthStore';
import {
  MOVEMENT_LABELS,
  NOISE_LABELS,
  YEAR_LEVELS,
  type ClassroomProfile,
  type MovementRequirement,
  type NoiseLevel,
  type YearLevel,
} from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Select, TextArea, TextInput } from '../components/ui/Inputs';
import { EmptyState } from '../components/ui/States';
import { uid } from '../lib/utils';

/**
 * Classroom Profiles — class-level preferences only (no pupil records or
 * personal data). Selecting a class in Smart Relief applies its preferences.
 */
export default function ClassesPage() {
  const { repo } = useStore();
  const { isAdmin } = useAdminAuth();
  const [classes, setClasses] = useState<ClassroomProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClassroomProfile | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    setLoading(true);
    const list = await repo.listClasses();
    setClasses(list);
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (profile: ClassroomProfile) => {
    await repo.saveClass(profile);
    await reload();
    setEditing(null);
    setCreating(false);
  };

  const remove = async (id: string) => {
    await repo.deleteClass(id);
    await reload();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Classroom Profiles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Class-level preferences used by Smart Relief — no pupil records are stored.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4" /> Add class
          </Button>
        )}
      </header>

      {!isAdmin && (
        <Card className="p-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          Sign in as an administrator (via the Admin menu) to add or edit classroom profiles.
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No classroom profiles yet"
          description="Add a class profile so Smart Relief can apply its noise and movement preferences automatically."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{c.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Year {c.year} · {c.pupilCount} pupils
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(c)}
                      aria-label={`Edit ${c.name}`}
                      className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete class profile "${c.name}"?`)) void remove(c.id);
                      }}
                      aria-label={`Delete ${c.name}`}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge color="slate">Noise: {NOISE_LABELS[c.noisePreference]}</Badge>
                <Badge color="slate">{MOVEMENT_LABELS[c.movementPreference]}</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {c.preferredActivities}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Editor */}
      <Modal
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? `Edit ${editing.name}` : 'Add classroom profile'}
      >
        <ClassForm
          initial={editing}
          onSave={(p) => void save(p)}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}

function ClassForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ClassroomProfile | null;
  onSave: (p: ClassroomProfile) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ClassroomProfile>(
    initial ?? {
      id: uid('class'),
      name: '',
      year: 1,
      pupilCount: 30,
      preferredActivities: '',
      noisePreference: 'moderate',
      movementPreference: 'seated',
    },
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ClassroomProfile>(key: K, value: ClassroomProfile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    if (form.name.trim().length < 1) {
      setError('Class name is required.');
      return;
    }
    if (form.pupilCount < 1 || form.pupilCount > 60) {
      setError('Pupil count should be between 1 and 60.');
      return;
    }
    onSave({ ...form, name: form.name.trim() });
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Class name"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        placeholder="e.g. 2 Bakti"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Year"
          value={String(form.year)}
          onChange={(e) => set('year', Number(e.target.value) as YearLevel)}
          options={YEAR_LEVELS.map((y) => ({ value: String(y), label: `Year ${y}` }))}
        />
        <TextInput
          label="Number of pupils"
          type="number"
          min={1}
          max={60}
          value={form.pupilCount}
          onChange={(e) => set('pupilCount', Number(e.target.value) || 0)}
        />
      </div>
      <Select
        label="Noise preference"
        value={form.noisePreference}
        onChange={(e) => set('noisePreference', e.target.value as NoiseLevel)}
        options={(Object.keys(NOISE_LABELS) as NoiseLevel[]).map((n) => ({
          value: n,
          label: NOISE_LABELS[n],
        }))}
      />
      <Select
        label="Movement preference"
        value={form.movementPreference}
        onChange={(e) => set('movementPreference', e.target.value as MovementRequirement)}
        options={(Object.keys(MOVEMENT_LABELS) as MovementRequirement[]).map((m) => ({
          value: m,
          label: MOVEMENT_LABELS[m],
        }))}
      />
      <TextArea
        label="Preferred activities"
        value={form.preferredActivities}
        onChange={(e) => set('preferredActivities', e.target.value)}
        rows={2}
        placeholder="e.g. Whole-class quizzes and team games"
      />
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
          <Save className="w-4 h-4" /> Save profile
        </Button>
      </div>
    </div>
  );
}
