import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../../store/AdminAuthStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TextInput } from '../../components/ui/Inputs';
import { Lock } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, user, mode, signIn, signOut } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ── Signed-in dashboard ────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Administrator Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Signed in as <strong>{user?.email}</strong> ·{' '}
              {mode === 'firebase' ? 'Firebase Authentication' : 'Local demo mode'}
            </p>
          </div>
          <Button variant="secondary" onClick={() => void signOut()}>
            Sign out
          </Button>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <AdminTile
            title="Activity Management"
            description="Add, edit, archive or approve activities. Set years, subjects, durations."
            to="/admin/activities"
            emoji="📚"
          />
          <AdminTile
            title="Question Bank"
            description="Manage question sets powering the original games."
            to="/admin/questions"
            emoji="❓"
          />
          <AdminTile
            title="Usage Analytics"
            description="Launches, ratings, feedback and session completions."
            to="/admin/analytics"
            emoji="📊"
          />
        </div>

        <Card className="p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-2">Administration notes</h2>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
            <li>
              Classroom profiles are managed on the{' '}
              <a href="/classes" className="text-primary-600 dark:text-primary-400 font-semibold underline">
                Classes page
              </a>{' '}
              (admin sign-in required there too).
            </li>
            <li>Only approved activities appear to teachers — pending items stay hidden.</li>
            <li>
              {mode === 'local'
                ? 'This build stores data in this browser (localStorage). Connect Firebase to share content school-wide.'
                : 'Changes are written to Firestore and visible to every teacher immediately.'}
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  // ── Sign-in ────────────────────────────────────────────────────────────
  const redirect = searchParams.get('redirect') ?? '/admin/activities';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(identifier, passcode);
      navigate(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary-600 dark:text-primary-300" />
        </div>
        <h1 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white">
          Administrator Sign-In
        </h1>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {mode === 'firebase'
            ? 'Use your administrator email and password.'
            : 'Demo build — enter any name and the local passcode (default: admin123).'}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <TextInput
            label="Your name"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. Pn. Aisyah"
            autoComplete="username"
          />
          <TextInput
            label={mode === 'firebase' ? 'Password' : 'Admin passcode'}
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {error && (
            <p role="alert" className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          <Button size="lg" className="w-full" disabled={busy || !passcode}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-4">
          Teachers do not need an account — only administrators sign in to manage content.
        </p>
      </Card>
    </div>
  );
}

function AdminTile({
  title,
  description,
  to,
  emoji,
}: {
  title: string;
  description: string;
  to: string;
  emoji: string;
}) {
  return (
    <Card hover className="p-5">
      <a href={to} className="block">
        <span className="text-3xl" aria-hidden="true">{emoji}</span>
        <h3 className="font-bold text-slate-900 dark:text-white mt-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </a>
    </Card>
  );
}
