import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { isFirebaseConfigured } from '../lib/firebase';

export interface AdminUser {
  email: string;
}

interface AdminAuth {
  isAdmin: boolean;
  user: AdminUser | null;
  mode: 'firebase' | 'local' | 'none';
  signIn: (identifier: string, secret: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminContext = createContext<AdminAuth | null>(null);
const SESSION_KEY = 'reliefhub.admin.session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  });
  const mode: AdminAuth['mode'] = isFirebaseConfigured() ? 'firebase' : 'local';

  // Firebase mode: mirror Firebase Auth state into the context.
  useEffect(() => {
    if (mode !== 'firebase') return;
    let unsub: (() => void) | undefined;
    void (async () => {
      const fb = await import('../lib/firebase');
      const inst = fb.getFirebase();
      if (!inst) return;
      unsub = fb.onAuthStateChanged(inst.auth, (u) => {
        if (u?.email) {
          const admin: AdminUser = { email: u.email };
          setUser(admin);
          try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(admin));
          } catch {
            /* ignore */
          }
        } else {
          setUser(null);
          try {
            sessionStorage.removeItem(SESSION_KEY);
          } catch {
            /* ignore */
          }
        }
      });
    })();
    return () => unsub?.();
  }, [mode]);

  const signIn = useCallback(
    async (identifier: string, secret: string) => {
      if (mode === 'firebase') {
        const fb = await import('../lib/firebase');
        const inst = fb.getFirebase();
        if (!inst) throw new Error('Firebase is not configured correctly.');
        await fb.signInWithEmailAndPassword(inst.auth, identifier.trim(), secret);
        return;
      }
      // Local demo mode: compare against the local passcode env var.
      const expected = (import.meta.env.VITE_LOCAL_ADMIN_PASSCODE ?? 'admin123').trim();
      if (secret !== expected) {
        throw new Error('Incorrect passcode. Check with your administrator.');
      }
      const admin: AdminUser = { email: identifier.trim() || 'Administrator' };
      setUser(admin);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(admin));
      } catch {
        /* ignore */
      }
    },
    [mode],
  );

  const signOut = useCallback(async () => {
    if (mode === 'firebase') {
      const fb = await import('../lib/firebase');
      const inst = fb.getFirebase();
      if (inst) await fb.signOut(inst.auth);
    }
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return (
    <AdminContext.Provider
      value={{ isAdmin: user !== null, user, mode, signIn, signOut }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAuth(): AdminAuth {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminProvider');
  return ctx;
}
