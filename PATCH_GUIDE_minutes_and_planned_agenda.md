# Patch guide — minutes + planned-agenda changes

Apply these to your **current** files (the ones with the sticky month strip). Each
edit is a find/replace. None of them touch the month strip, scroll logic, or layout.

Files affected: `mobile-schedules.js`, `mobile-app.jsx`, `desktop-app.jsx`, plus one
new file `planned-agenda.js` (already delivered separately) and a one-line `index.html`
script tag.

`eec-data.js` is already done — the 5/22 meeting is filed in the copy I returned this
session. No edits needed there.

---

## 1. `mobile-schedules.js` — make minutes availability derive from "Approved" status

This removes the need to ever hand-maintain the minutes registry again, and it works
whether your `MINUTES_AVAILABLE` set is committee-keyed (`"EEC|2026-05-22"`) or the older
date-only form (`"2026-05-22"`). You do **not** need to edit `MINUTES_AVAILABLE`.

**FIND** your existing function (it may be just two lines like
`return MINUTES_AVAILABLE.has(date);`):

```js
function hasMinutesFile(date) {
  return MINUTES_AVAILABLE.has(date);
}
```

**REPLACE WITH:**

```js
// True when eec-data.js has a filed (Approved) meeting record for this
// committee + date. This is what lets the registry be optional: once a
// meeting is marked "Approved", its minutes link turns on automatically.
function approvedMeetingExists(committee, date) {
  try {
    const M = (window.EEC && window.EEC.MEETINGS) || [];
    return M.some(m => m.committee === committee && m.date === date
      && /approved|filed/i.test(m.minutesStatus || ""));
  } catch (e) { return false; }
}

function hasMinutesFile(committee, date) {
  // Preferred: hasMinutesFile(committee, date).
  // Available if the meeting is Approved, OR listed in MINUTES_AVAILABLE
  // (committee-keyed or legacy date-only form both accepted).
  if (date !== undefined) {
    return approvedMeetingExists(committee, date)
      || MINUTES_AVAILABLE.has(committee + "|" + date)
      || MINUTES_AVAILABLE.has(date);
  }
  // Back-compat single-arg: any committee on that date.
  const d = committee;
  if (MINUTES_AVAILABLE.has(d)) return true;
  for (const key of MINUTES_AVAILABLE) {
    if (typeof key === "string" && key.endsWith("|" + d)) return true;
  }
  const M = (window.EEC && window.EEC.MEETINGS) || [];
  return M.some(m => m.date === d && /approved|filed/i.test(m.minutesStatus || ""));
}
```

> If your `hasMinutesFile` already takes `(committee, date)` from an earlier patch,
> just replace its body with the version above and add `approvedMeetingExists`.

---

## 2. `mobile-app.jsx` — five edits

### 2a. Add the planned-agenda lookup helper

Add this **immediately above** your `entryToMeeting` function:

```js
// ─── Planned (pre-meeting) agenda lookup ──────────────────────────────────────
// Pulls upcoming agenda items from window.PLANNED_AGENDA (planned-agenda.js) for
// a committee + date. Normalizes each item so its planned number (`n`) shows in
// the §badge that AgendaItem reads from `idx`. Returns [] when nothing planned.
function plannedFor(committee, date) {
  const raw = (window.PLANNED_AGENDA && window.PLANNED_AGENDA.itemsFor)
    ? window.PLANNED_AGENDA.itemsFor(committee, date) : [];
  return Array.isArray(raw) ? raw.map(it => ({ ...it, idx: it.idx || it.n })) : [];
}
```

### 2b. Replace `entryToMeeting`

**FIND** (your current version — the scheduled-stub branch sets `items: []`):

```js
function entryToMeeting(entry) {
  if (entry.kind === "filed" && entry.m) return { ...entry.m, scheduled: false };
  // Synthesize a stub for scheduled-only entries.
  return {
    id: `scheduled:${entry.committee}:${entry.date}`,
    date: entry.date,
    committee: entry.committee,
    type: entry.session || "Scheduled",
    time: entry.time || null,
    modality: null,
    presidingOfficer: null,
    items: [], topics: [],
    present: [], absent: [], exOfficio: [], guests: [], recused: [],
    attendanceRate: null,
    minutesStatus: "Pending intake",
    scheduled: true,
  };
}
```

**REPLACE WITH:**

```js
function entryToMeeting(entry) {
  if (entry.kind === "filed" && entry.m) {
    const m = entry.m;
    // A filed record that hasn't happened yet (future stub, minutesStatus
    // "Scheduled") is treated like a scheduled meeting and gets any planned
    // agenda folded in, exactly as the desktop view does.
    if (m.minutesStatus === "Scheduled") {
      const planned = plannedFor(m.committee, m.date);
      const items = (m.items && m.items.length) ? m.items : planned;
      return { ...m, items, scheduled: true, hasPlanned: items.length > 0 };
    }
    return { ...m, scheduled: false };
  }
  // Synthesize a stub for scheduled-only entries (subcommittees, future dates).
  const planned = plannedFor(entry.committee, entry.date);
  return {
    id: `scheduled:${entry.committee}:${entry.date}`,
    date: entry.date,
    committee: entry.committee,
    type: entry.session || "Scheduled",
    time: entry.time || null,
    modality: null,
    presidingOfficer: null,
    items: planned, topics: [],
    present: [], absent: [], exOfficio: [], guests: [], recused: [],
    attendanceRate: null,
    minutesStatus: "Pending intake",
    scheduled: true,
    hasPlanned: planned.length > 0,
  };
}
```

### 2c. Pass committee into the minutes-file check

**FIND:**

```js
  const hasFile = !m.scheduled && window.MOBILE_SCHEDULE.hasMinutesFile(m.date);
```

**REPLACE WITH:**

```js
  const hasFile = !m.scheduled && window.MOBILE_SCHEDULE.hasMinutesFile(m.committee, m.date);
```

### 2d. Enable/relabel the Meeting Summary button when a planned agenda exists

**FIND** (your current summary button config object):

```js
    { kind: "summary",     label: "Meeting Summary",          count: m.scheduled ? null : (m.items?.length || 0), sub: m.scheduled ? "not circulated" : "agenda items", color: "var(--brand-violet)", disabled: m.scheduled },
```

**REPLACE WITH:**

```js
    { kind: "summary",     label: m.scheduled && m.hasPlanned ? "Planned Agenda" : "Meeting Summary", count: (m.items && m.items.length) ? m.items.length : (m.scheduled ? null : 0), sub: m.scheduled ? (m.hasPlanned ? "planned agenda" : "not circulated") : "agenda items", color: "var(--brand-violet)", disabled: m.scheduled && !m.hasPlanned },
```

### 2e. Make the summary detail planned-aware (heading, subline, read-only items)

In `SummaryDetail`, **FIND:**

```js
        <h2>Meeting Summary</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.5 }}>
          {items.length} agenda item{items.length === 1 ? "" : "s"} · {motions.length} motion{motions.length === 1 ? "" : "s"} voted · {m.present?.length || 0} voting members present
        </div>
```

**REPLACE WITH:**

```js
        <h2>{m.scheduled ? "Planned Agenda" : "Meeting Summary"}</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.5 }}>
          {m.scheduled
            ? <>{items.length} planned agenda item{items.length === 1 ? "" : "s"} · circulated before the meeting</>
            : <>{items.length} agenda item{items.length === 1 ? "" : "s"} · {motions.length} motion{motions.length === 1 ? "" : "s"} voted · {m.present?.length || 0} voting members present</>}
        </div>
```

Then, in the same component, **FIND** the items map:

```js
      {items.map((it, i) => <AgendaItem key={i} item={it} onClick={() => onItem && onItem("agenda-item", { meetingId: m.id, idx: it.idx })} />)}
```

**REPLACE WITH:**

```js
      {m.scheduled && items.length > 0 && (
        <div style={{ fontSize: 11.5, color: "var(--brand-cyan-deep)", background: "var(--brand-cyan-tint)", padding: "8px 12px", borderRadius: 8, marginBottom: 12, lineHeight: 1.45 }}>
          Planned agenda — items, presenters, and order may change before the meeting. Minutes are filed afterward.
        </div>
      )}
      {items.map((it, i) => (
        <AgendaItem
          key={i}
          item={it}
          onClick={m.scheduled ? null : (() => onItem && onItem("agenda-item", { meetingId: m.id, idx: it.idx }))}
        />
      ))}
```

### 2f. Committee-aware minutes filename

In `DownloadDetail`, **FIND:**

```js
  const filename = `EEC_Minutes_${m.date}.docx`;
```

**REPLACE WITH:**

```js
  const filename = `${(c.short || m.committee || "EEC").replace(/[^A-Za-z0-9]/g, "")}_Minutes_${m.date}.docx`;
```

---

## 3. `desktop-app.jsx` — two lines

In the download/minutes area (the `DownloadDetail`-equivalent), **FIND:**

```js
    const hasFile = isFiled(m) && window.MOBILE_SCHEDULE.hasMinutesFile && window.MOBILE_SCHEDULE.hasMinutesFile(m.date);
    const fileName = `EEC_Minutes_${m.date}.docx`;
```

**REPLACE WITH:**

```js
    const hasFile = isFiled(m) && window.MOBILE_SCHEDULE.hasMinutesFile && window.MOBILE_SCHEDULE.hasMinutesFile(m.committee, m.date);
    const fileName = `${(c.short || m.committee || "EEC").replace(/[^A-Za-z0-9]/g, "")}_Minutes_${m.date}.docx`;
```

> If your desktop `hasFile` line already passes `(m.committee, m.date)`, only the
> `fileName` line needs changing.

---

## 4. New file + script tag

- Add `planned-agenda.js` (delivered separately) to the repo root.
- In your HTML, add this line **after** `mobile-schedules.js` and **before** the app
  `.jsx` scripts:

```html
<script src="planned-agenda.js"></script>
```

---

## Result

- 5/22 minutes (and any future "Approved" meeting) surfaces automatically — no registry
  upkeep.
- Subcommittee minutes use `PCCS_Minutes_<date>.docx`, `CCS_…`, etc.
- Upcoming meetings with a planned agenda show it (mobile + desktop); the month strip and
  everything else from the merging chat are untouched.
