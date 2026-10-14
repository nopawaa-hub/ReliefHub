# ReliefHub — Firebase Setup Guide

The app runs fully **without Firebase** (local repository + localStorage + passcode admin).
Connect Firebase only when you want school-wide shared data and real administrator accounts.

## 1. Create the project

1. Go to <https://console.firebase.google.com> and **Add project** (e.g. `reliefhub-school`).
2. You can disable Google Analytics for the project — ReliefHub does not need it.

## 2. Register a Web app

1. Project Overview → the **`</>`** (Web) button.
2.Nickname: `reliefhub-web`. Do **not** tick Firebase Hosting setup yet.
3. Copy the generated `firebaseConfig` object — you will need its six values.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values from the config you copied:

```
VITE_FIREBASE_API_KEY=AIza…
VITE_FIREBASE_AUTH_DOMAIN=reliefhub-school.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=reliefhub-school
VITE_FIREBASE_STORAGE_BUCKET=reliefhub-school.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

> `.env` is git-ignored. Never commit real credentials.
> These values identify your project — they are not secrets on their own, which is why
> Firestore security rules (not env vars) protect the data.

## 4. Enable Authentication

1. Build → **Authentication** → Get started.
2. Enable the **Email/Password** provider.
3. Users tab → **Add user**: enter each administrator's school email and a strong password.

## 5. Create Firestore and deploy rules

1. Build → **Firestore Database** → Create database → **Production mode**.
2. Install the CLI and deploy the included rules:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore     # accept defaults; use the existing firestore.rules
firebase deploy --only firestore:rules
```

3. **Important:** open `firestore.rules` and replace the placeholder email in `isAdmin()`
   with your real administrator emails, then deploy again.

## 6. Hosting (optional)

```bash
npm run build
firebase init hosting        # public directory: dist ; SPA rewrite: yes
firebase deploy --only hosting
```

Your school URL will be `https://<project-id>.web.app`.

## 7. Seed starter content (optional)

The local starter library (23 activities, 30+ question sets, 4 picture packs, 6 class
profiles) lives in `src/data/`. When running against Firestore, either:

- re-enter content through the Admin → Activity Management / Question Bank UI, or
- write a one-off import script that pushes the objects from `src/data/*.ts` into the
  `activities`, `questionSets`, `picturePacks` and `classes` collections (schemas match
  the TypeScript types in `src/types/index.ts`).

## How local mode differs

| | Local mode (default) | Firebase mode |
|---|---|---|
| Content storage | `localStorage` in each browser | Firestore, shared school-wide |
| Admin sign-in | local passcode (`VITE_LOCAL_ADMIN_PASSCODE`, default `admin123`) | Firebase Auth email + password |
| Analytics | this browser only | all classroom browsers |
| Setup needed | none | steps above |

The admin UI shows which mode is active after sign-in.
