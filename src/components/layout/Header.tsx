import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  LayoutDashboard,
  LibraryBig,
  Lock,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { useSettings } from '../../store/SettingsStore';
import { useAdminAuth } from '../../store/AdminAuthStore';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/library', label: 'Library', icon: LibraryBig },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/smart-relief', label: 'Smart Relief', icon: Sparkles },
  { to: '/toolkit', label: 'Toolkit', icon: Wrench },
];

function NavLink({
  to,
  label,
  icon,
  end,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  onClick?: () => void;
}) {
  const location = useLocation();
  const active = end ? location.pathname === to : location.pathname.startsWith(to);
  const Icon = icon;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors',
        active
          ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/25'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="ReliefHub home">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-teal-500 flex items-center justify-center shadow-glow">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
            Relief<span className="text-primary-600 dark:text-primary-400">Hub</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Smart Relief Classroom
          </div>
        </div>
      )}
    </Link>
  );
}

export function Header() {
  const { theme, toggleTheme, soundOn, toggleSound } = useSettings();
  const { isAdmin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  // Close mobile menu on navigation.
  useEffect(() => {
    if (lastPath.current !== location.pathname) {
      setMobileOpen(false);
      lastPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
            <NavLink
              to="/admin"
              label={isAdmin ? 'Admin' : 'Admin'}
              icon={isAdmin ? LayoutDashboard : Lock}
            />
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleSound}
              aria-label={soundOn ? 'Turn sound effects off' : 'Turn sound effects on'}
              title={soundOn ? 'Sound on' : 'Sound off'}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {[...NAV_ITEMS, { to: '/admin', label: 'Admin', icon: Lock }].map((item) => (
                <NavLink key={item.to} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/60 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold">ReliefHub</span>
          <span className="hidden sm:inline">— One Click. One Class. Endless Learning.</span>
        </div>
        <p>Built for Malaysian primary schools · For teacher use on classroom displays</p>
      </div>
    </footer>
  );
}
