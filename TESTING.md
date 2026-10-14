# ReliefHub — Pilot Testing Checklist

## Automated tests (CI / pre-release)

```bash
npm test        # 29 unit tests
```

Coverage:

- **Recommender** — eligibility filtering (year / subject / noise), deterministic session
  generation, variant shuffling, no repetition within a session, duration never exceeded
  for every year × duration combination, replacement lookup, homepage single recommendation,
  closest-alternative scoring.
- **Content integrity** — unique ids, valid questions (options contain the answer, true/false
  answers are True/False), activity references resolve, warmup/main/closing coverage for
  Years 1–6, https-only external URLs.
- **Utils** — seeded shuffle determinism & non-mutation, hash stability, clamp, formatters,
  forgiving answer matching, uid uniqueness.

## Manual pilot checklist

Run through this on a laptop first, then on the actual classroom Smart TV.

### A. Teacher flows (no account)

- [ ] Open `/` — page loads without any sign-in.
- [ ] Quick Start: select **Year 2**, **30 minutes**, **English**, **Interactive** →
      **Find My Activity** shows a recommended activity within a few seconds.
- [ ] **Try Another** produces a different recommendation.
- [ ] An impossible combination (e.g. Year 6 + quiet + maths + 60 min) shows the closest
      alternatives with an explanation, never a dead end.
- [ ] **Instructions** opens the full details modal (purpose, materials, steps, management tips).
- [ ] Library: search + each filter works; combined filters narrow results; clear-all restores.
- [ ] External activity card opens the real Baamboozle / Wordwall site in a new tab.

### B. Games (on the Smart TV)

- [ ] **Mystery Box**: team setup → start → pick a box → question shows → reveal answer →
      award point → score increments and turn alternates → box disappears → play to the end
      shows the winner screen → **Play again** resets scores and boxes.
- [ ] **True or False**: statement shows → vote True/False → reveal shows correct answer +
      explanation + marks the class vote → next statement → progress bar advances →
      finish screen shows class score → reset works.
- [ ] Timer toggle: countdown rings and auto-reveals when time runs out.
- [ ] **Hidden Picture**: tiles reveal on click → random reveal works → hint banner shows →
      team guess buttons award a point and show the answer → next picture resets tiles →
      grid size 3×3 ↔ 4×4 works.
- [ ] Fullscreen button enters and exits browser fullscreen on the TV.
- [ ] Sound toggle in the header mutes/unmutes all effects.
- [ ] Exit confirmation prevents accidental loss; feedback prompt appears after exiting a
      game launched from an activity.

### C. Smart Relief session

- [ ] `/smart-relief`: Year 2 + 30 min → **Build My Session** shows warm-up + main(s) +
      closing totalling ≤ 30 minutes.
- [ ] **Shuffle plan** gives a different valid plan.
- [ ] Selecting a class profile (e.g. 2 Bakti) auto-applies its year.
- [ ] **Start Session** opens the player: timer starts, **Done — next** advances,
      **Skip** moves on, **Replace activity** swaps in a compatible activity,
      **Launch game** opens the game full-bleed, **End session** finishes with the
      completion screen.
- [ ] Session survives navigation away and back (same browser tab).

### D. Classroom Toolkit

- [ ] Timer: preset + custom minutes, start / pause / reset, alarm at zero, TV mode.
- [ ] Scoreboard: rename teams, add/remove teams (min 2), ± points, ranking & leader badge.
- [ ] Team picker: numbered pupils and pasted names, balanced teams, re-randomize.
- [ ] Spin wheel: add/remove entries, spin animation lands on a highlighted winner.
- [ ] Attention screen: each message takes over the whole screen; click exits.

### E. Administration

- [ ] `/admin` shows sign-in; wrong passcode shows a clear error.
- [ ] Sign in (local `admin123` or Firebase account) → dashboard with three tiles.
- [ ] Activity Management: add a test activity (all fields), edit it, archive it
      (disappears from teacher library), restore it, delete it.
- [ ] Question Bank: create a small question set; it becomes selectable in activity forms.
- [ ] Classes: add a profile; it appears in Smart Relief's class picker.
- [ ] Analytics: numbers only reflect real launches/feedback recorded in this browser
      (compare with the count after playing a few games).
- [ ] Sign out locks the admin routes again.

### F. Display & accessibility

- [ ] 16:9 TV: no horizontal scrolling, no tiny text, buttons reachable by TV remote/pointer.
- [ ] Laptop, tablet and phone layouts usable (responsive check).
- [ ] Dark mode toggle works site-wide.
- [ ] Keyboard: Tab focus visible on all interactive controls; Esc closes dialogs.
- [ ] No broken routes: unknown URL shows the 404 page with links home.

### G. Graceful degradation

- [ ] Admin deletes the question set a game activity references → game falls back to a
      default set (or shows a clear empty-state, never a crash).
- [ ] Reload mid-game: game restarts cleanly (scores are per-session by design).
- [ ] localStorage cleared → starter library returns.

## Known limitations (v1)

- Analytics in local mode are per-browser (no cross-device aggregation until Firebase is connected).
- Games reset on reload; scores are intentionally not persisted between lessons.
- The wheel spin animation duration is fixed at 4 s.
