import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { LinkButton } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-500/15 flex items-center justify-center mb-6">
        <Compass className="w-10 h-10 text-primary-500" />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-2">Error 404</p>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        This page took a relief period
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to something
        useful.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <LinkButton to="/" size="lg">
          Back to home
        </LinkButton>
        <LinkButton to="/library" size="lg" variant="secondary">
          Browse library
        </LinkButton>
      </div>
      <p className="text-xs text-slate-400 mt-8">
        Are you an administrator?{' '}
        <Link to="/admin" className="underline font-semibold">
          Sign in here
        </Link>
        .
      </p>
    </div>
  );
}
