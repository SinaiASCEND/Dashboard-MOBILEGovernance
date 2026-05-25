# ASCEND Governance — Mobile

A read-only iPhone-shaped web app for the Mount Sinai MD Program Office of Curricular Affairs. Surfaces the Executive Education Committee (EEC) and its subcommittees (PCCS · CCS · CIS · AES) so a phone user can find a meeting, scan minutes, browse membership, and run a live attendance check.

Live-served from a single static HTML host — no backend, no build step.

## Quick start

```
# clone, then just open index.html in any modern browser:
open index.html
# or serve locally if your browser blocks file:// scripts:
python3 -m http.server 8080
# → http://localhost:8080
```

On a real phone the explainer + bezel are dropped and the app fills the screen (responsive `@media (max-width: 820px)` block in `index.html`).

## File map

| File | Purpose |
|---|---|
| `index.html` | Entry point. Loads fonts, ships the device-frame chrome, mounts the React app into `#root`. |
| `styles.css` | Design-system tokens (colors, type, shadow, spacing). |
| `eec-data.js` | Source of truth for committees, members, meetings, motions, action items, reviews, policies. ~422 KB JSON inlined. |
| `rosters.js` | Canonical AY 2025–26 EEC roster (25 members · 14 voting · quorum 7). Patches `EEC.MEMBERS` on load with refreshed titles, emails, term dates, and `termStart` / `termEnd` for time-bounded seats. Exposes `window.ROSTERS` (AY helpers, `rosterFor`, `ayStatsFor`, …). |
| `mobile-schedules.js` | Schedule shape per committee + helpers `nextMeeting`, `totalCount`, `filedCount`, `committeeMeetings`, `hasMinutesFile`. |
| `meeting-details.js` | Parsed appendix tables for each filed meeting (governance / operational action plans). |
| `mobile-sections.jsx` | Section screens that mirror the desktop dashboard — Overview, Actions, Motions, Members, Reviews, Policies, Attendance, Linkage, Phase Reviews, Action Plans. |
| `membership-attendance.jsx` | New **Membership** listing (All / EEC / PCCS / CCS / CIS filters with AY toggle) and the **EEC Attendance** screen (3 tabs — By meeting · By member · Grid — with Print/PDF + CSV). |
| `live-tracker.jsx` | The **live tracker**: tick-box attendance with a quorum flag, guest field, free-text notes, and a categorized output screen (voting present/absent · non-voting present/absent · guests · notes). Auto-persists to `localStorage` by meeting date. |
| `mobile-app.jsx` | App shell, route stack, screen dispatcher, status / nav chrome, home + committee + meeting screens. |
| `minutes/` | Approved EEC minutes (`.docx`) referenced by the Download Minutes screen. |

## Loading order matters

`index.html` loads scripts in this order so each one finds what it needs already on `window`:

```
eec-data.js          → window.EEC
rosters.js           → window.ROSTERS  (patches EEC.MEMBERS)
mobile-schedules.js  → window.MOBILE_SCHEDULE
meeting-details.js   → window.MEETING_DETAILS
mobile-sections.jsx  → window.MobileSections.{...}
membership-attendance.jsx → augments window.MobileSections
live-tracker.jsx     → augments window.MobileSections.LiveAttendanceTracker
mobile-app.jsx       → window.MobileApp  (React root)
```

JSX files run through Babel Standalone in the browser.

## Routing

The app keeps a route stack in `mobile-app.jsx`. Screens:

- `home` — OCA hero + 2×2 committee grid + Explore list (Membership, Full Review, Phase Reviews, Action Plans)
- `committee` — meetings list for one committee, grouped by month
- `meeting` — 2×2 buttons (Summary · Governance · Operational · Download)
- `detail` — one of the four sub-screens
- `section` — Membership / Attendance / Overview / Actions / Motions / Members / Reviews / Policies / etc.
- `take-attendance` — live tracker
- `item` — member / action / motion / review / policy / agenda-item detail

Pass `focusMemberId` to `section: "attendance"` to land on the **By member** tab with that member highlighted; pass `ay` to scope by academic year.

## Academic-year model

```
AY 2024-25  →  2024-07-01 … 2025-06-30
AY 2025-26  →  2025-07-01 … 2026-06-30   (current)
AY 2026-27  →  2026-07-01 … 2027-06-30
```

`rosters.js#ayStatsFor(memberId, ay)` reduces a member's `meetingsPresent` / `meetingsAbsent` to just the meetings inside that AY window, so toggling AY resets all counters and percentages cleanly.

Members with bounded terms (e.g. `termStart` / `termEnd`) are filtered out of the roster outside their term. Jillian Palmer's seat is bounded `2025-07-01 … 2025-12-31` — she appears only when the AY overlaps her term, and disappears from the live tracker for any meeting date past Dec 2025.

## Live attendance tracker

- Date-bound to the selected AY
- Tap-to-toggle rows, mark-all / clear-all per voting bucket
- Live quorum flag (green / amber) against the AY-active voting count
- Add multiple guests (free text)
- Free-text "Additional notes"
- Autosaves to `localStorage[`eec-att:<date>`]` on every change — switch dates and back to resume
- Output review: six categorized buckets — Voting present · Voting absent · Non-voting present · Non-voting absent · Guests · Additional notes
- Export: Print/PDF (clean popup), CSV, Copy summary

## Conventions

- Mobile-first CSS lives inside each component file (`MOBILE_CSS`, `MM_CSS`, `LT_CSS`) so each module is self-contained.
- Babel-loaded files don't share scope — anything that needs to cross files is hung on `window` (e.g. `window.MobileSections`, `window.ROSTERS`).
- Date strings are local YYYY-MM-DD; `window.MS_DATE.parseLocal()` handles parsing without timezone surprises.

## License / data

The committee membership and minutes are Mount Sinai institutional records; treat the repo as private.
