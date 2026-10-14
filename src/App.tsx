import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Header, Footer } from './components/layout/Header';
import { SettingsProvider } from './store/SettingsStore';
import { StoreProvider } from './store/AppStore';
import { AdminProvider, useAdminAuth } from './store/AdminAuthStore';
import { Button } from './components/ui/Button';
import { EmptyState } from './components/ui/States';

import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import GamesPage from './pages/GamesPage';
import GamePlayerPage from './pages/GamePlayerPage';
import SmartReliefPage from './pages/SmartReliefPage';
import SessionPlayerPage from './pages/SessionPlayerPage';
import ToolkitPage from './pages/ToolkitPage';
import ClassesPage from './pages/ClassesPage';
import AdminPage from './pages/admin/AdminPage';
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';
import { Link } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Gate for admin-only pages. Unauthenticated users get a friendly sign-in card. */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, mode } = useAdminAuth();
  const location = useLocation();
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          icon={<span className="text-3xl">🔒</span>}
          title="Administrator sign-in required"
          description={
            mode === 'firebase'
              ? 'Sign in with your administrator account to manage published resources.'
              : 'Demo build without Firebase — sign in with the local administrator passcode (default: admin123, set VITE_LOCAL_ADMIN_PASSCODE to change it).'
          }
          action={
            <Link to={`/admin?redirect=${encodeURIComponent(location.pathname)}`}>
              <Button size="lg">Go to sign-in</Button>
            </Link>
          }
        />
      </div>
    );
  }
  return <>{children}</>;
}

/** Wraps normal pages with shared chrome (header, container, footer). */
function PageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">{children}</div>
  );
}

export default function App() {
  const location = useLocation();
  // Game & session players run full-bleed for maximum TV display area.
  const immersive =
    location.pathname.startsWith('/games/') || location.pathname.startsWith('/session/');

  return (
    <SettingsProvider>
      <StoreProvider>
        <AdminProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            {!immersive && <Header />}
            <main className="flex-1 w-full">
              <ScrollToTop />
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageChrome>
                      <HomePage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/library"
                  element={
                    <PageChrome>
                      <LibraryPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/games"
                  element={
                    <PageChrome>
                      <GamesPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/smart-relief"
                  element={
                    <PageChrome>
                      <SmartReliefPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/toolkit"
                  element={
                    <PageChrome>
                      <ToolkitPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/classes"
                  element={
                    <PageChrome>
                      <ClassesPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PageChrome>
                      <AdminPage />
                    </PageChrome>
                  }
                />
                <Route
                  path="/admin/activities"
                  element={
                    <PageChrome>
                      <AdminRoute>
                        <AdminActivitiesPage />
                      </AdminRoute>
                    </PageChrome>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <PageChrome>
                      <AdminRoute>
                        <AdminQuestionsPage />
                      </AdminRoute>
                    </PageChrome>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <PageChrome>
                      <AdminRoute>
                        <AdminAnalyticsPage />
                      </AdminRoute>
                    </PageChrome>
                  }
                />
                {/* Immersive full-bleed routes */}
                <Route path="/games/:gameId" element={<GamePlayerPage />} />
                <Route path="/session/:sessionId" element={<SessionPlayerPage />} />
                <Route
                  path="*"
                  element={
                    <PageChrome>
                      <NotFoundPage />
                    </PageChrome>
                  }
                />
              </Routes>
            </main>
            {!immersive && <Footer />}
          </div>
        </AdminProvider>
      </StoreProvider>
    </SettingsProvider>
  );
}
