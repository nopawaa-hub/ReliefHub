# ReliefHub — Smart Relief Classroom Platform

**One Click. One Class. Endless Learning.**

A hybrid web platform helping Malaysian primary-school relief teachers (guru ganti) launch a
meaningful classroom activity in about 60 seconds — built for one Smart TV, one teacher, and a
whole class. No pupil accounts, no pupil devices.

## What's inside

| Area | Route | What it does |
|---|---|---|
| Homepage | `/` | Quick Start: pick year (1–6), duration (10/20/30/60 min), subject and atmosphere → "Find My Activity" recommends a ready activity instantly |
| Activity Library | `/library` | 23 starter activities, searchable and filterable by year, subject, duration, difficulty, type, noise, grouping, language and movement |
| Original Games | `/games` | Three fully playable TV-sized games with team scores, sounds and fullscreen |
| Smart Relief Mode | `/smart-relief` | Deterministic rule-based session builder: warm-up + mains + closing fitted to your available minutes |
| Session Player | `/session/:id` | Follows the plan with a countdown timer, progress, launch / skip / replace controls |
| Classroom Toolkit | `/toolkit` | Timer, scoreboard, random team picker, spinning wheel, full-screen attention messages |
| Classroom Profiles | `/classes` | Class-level preferences (noise, movement) that Smart Relief can apply automatically |
| Admin | `/admin` | Secure sign-in; activity management, question bank, real usage analytics |

## Original games (mechanics ⨯ content)

The game engines are fully separated from educational content — any question set powers any game:

- **Mystery Box** — two teams pick numbered boxes hiding questions; open, answer, reveal, award points.
- **True or False** — big statements, whole-class voting, explanations, optional countdown, progress tracking.
- **Hidden Picture** — a picture behind numbered tiles; reveal one-by-one or randomly, hints, team guessing, 3×3 / 4×4 grids.

Question sets cover English, Bahasa Melayu, Mathematics, Science and General Knowledge for
Years 1–6, with picture packs for Hidden Picture (works fully offline — no external assets).

## Quick start

```bash
# Requires Node.js 18+ (built and tested on Node 24)
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm test           # unit tests (recommender, filters, content integrity, utils)
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build locally
```

**No configuration is needed to run.** Without Firebase the app uses a local repository
(starter content + admin edits persisted in `localStorage`) and admin sign-in uses a local
passcode (default `admin123` — see `.env.example`).

## Connecting Firebase (school-wide data + real admin accounts)

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Add a **Web app** and copy its config values.
3. `cp .env.example .env` and fill in the six `VITE_FIREBASE_*` variables.
4. Enable **Authentication → Email/Password** and create the administrator account(s).
5. Deploy the Firestore rules and indexes below.
6. `npm run build` and deploy (`firebase deploy` or any static host).

### Firestore security rules (`firestore.rules`)

Ships in this repo. Summary of the policy:

- **Anyone (teachers)** can read approved activities, question sets, picture packs and class profiles —
  browsing and playing never requires an account.
- **Only authenticated users** can write anything, send feedback, or read analytics collections.
- For a school pilot, admin accounts are allow-listed by email in the rules — replace the
  placeholder with your real administrator emails before deploying.

### Content collections

```
activities/{id}        — the activity catalogue (status: approved | pending | archived)
questionSets/{id}      — question banks powering the games
picturePacks/{id}      — hidden-picture packs
classes/{id}           — classroom profiles (no pupil personal data)
launchEvents/{id}      — anonymous activity-launch counter events
feedback/{id}          — anonymous post-activity ratings + optional comment
sessionCompletions/…   — simple counters
```

The app talks to repositories through the `ContentRepository` interface
(`src/data/repository.ts`). Local mode is fully functional today; the Firestore
implementation plugs into the same interface when the env vars are present.

## Project structure

```
src/
├── components/
│   ├── games/        # GameShell + 3 game engines + shared QuestionDisplay
│   ├── toolkit/      # Timer, Scoreboard, TeamPicker, SpinWheel, AttentionScreen
│   ├── ui/           # Button, Card, Badge, Modal, Inputs, Tabs, States
│   ├── layout/       # Header, Footer
│   └── …             # ActivityCard, InstructionsModal, FeedbackModal
├── data/
│   ├── questionSets/ # Starter question bank (English, BM, Maths, Science, GK)
│   ├── activities.ts # 23 starter activities
│   ├── picturePacks.ts
│   ├── classrooms.ts
│   └── repository.ts # ContentRepository interface + LocalRepository
├── lib/
│   ├── recommender.ts     # deterministic session builder (rule-based, no AI)
│   ├── sessionStorage.ts  # relief-session persistence
│   ├── sound.ts           # WebAudio chimes (no audio files)
│   ├── useFullscreen.ts
│   ├── firebase.ts        # env-driven bootstrap; inert when unconfigured
│   └── utils.ts           # seeded shuffle, formatting, answer matching
├── pages/           # Home, Library, Games, GamePlayer, SmartRelief, SessionPlayer,
│                    # Toolkit, Classes, NotFound, admin/*
├── store/           # AppStore (content+analytics), SettingsStore, AdminAuthStore
└── types/           # shared domain types
```

## Design decisions worth knowing

- **Deterministic Smart Relief.** `buildSession()` is a pure function seeded from the request —
  same inputs always produce the same plan; the "Shuffle" button just increments a variant
  number. Tested with 29 unit tests including duration-never-exceeded for every year × duration.
- **No fabricated analytics.** The admin analytics dashboard starts empty and only ever shows
  genuinely recorded launch events, feedback and session completions from this browser/school.
- **Honest content labelling.** Original ReliefHub content is badged "Original"; external
  links (Baamboozle, Wordwall) open the source site in a new tab and are marked "External".
  External URLs are real, verified platform pages — nothing is invented.
- **TV-first sizing.** Games run full-bleed with oversized text, high contrast, big touch
  targets, fullscreen support, and a slim teacher toolbar kept out of the pupils' sight-line.
  Base font scales up on ≥1536 px displays.
- **Sound without assets.** All sound effects are synthesised with WebAudio — no files, and a
  global mute toggle in the header.
- **No pupil data.** Classroom profiles store only class-level facts (name, year, pupil count,
  preferences). Feedback is anonymous.

## Deployment

Any static host works for the local-mode build. For Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting     # after firebase init hosting (public: dist)
```

See `SETUP.md` for the full Firebase walkthrough and `TESTING.md` for the pilot testing
checklist.
