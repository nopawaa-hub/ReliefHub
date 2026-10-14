/**
 * Firebase bootstrap. All values come from environment variables — no secrets
 * live in source code. When any variable is missing the app runs in local mode
 * (LocalRepository + passcode admin) and this module stays inert.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth';

const env = import.meta.env as Record<string, string | undefined>;

export interface FirebaseEnv {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function readFirebaseEnv(): FirebaseEnv | null {
  const cfg: FirebaseEnv = {
    apiKey: env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: env.VITE_FIREBASE_APP_ID ?? '',
  };
  const complete = Object.values(cfg).every((v) => v.length > 0);
  return complete ? cfg : null;
}

export function isFirebaseConfigured(): boolean {
  return readFirebaseEnv() !== null;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

/** Initialises Firebase once. Returns null in local mode. */
export function getFirebase(): { app: FirebaseApp; auth: Auth } | null {
  const cfg = readFirebaseEnv();
  if (!cfg) return null;
  if (!app) {
    app = initializeApp(cfg);
    auth = getAuth(app);
  }
  return app && auth ? { app, auth } : null;
}

export { onAuthStateChanged, signInWithEmailAndPassword, signOut };
