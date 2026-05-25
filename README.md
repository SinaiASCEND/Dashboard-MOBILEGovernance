# ISMMS Executive Education Committee — Roster Files

Canonical roster data for the Icahn School of Medicine at Mount Sinai (ISMMS) Executive Education Committee (EEC) and its predecessor, the Executive Oversight Committee (EOC), across three governance eras.

These files are consumed by the `eec-minutes` skill to produce LCME-defensible meeting minutes. They are versioned here so curricular-affairs staff, accreditation reviewers, and downstream tooling have a single source of truth for committee membership across time.

---

## Contents

- [`roster_2024_07_to_2025_06.json`](roster_2024_07_to_2025_06.json) — **EOC era**, AY 2024–2025
- [`roster_2025_07_to_2026_06.json`](roster_2025_07_to_2026_06.json) — **EEC v1.0**, AY 2025–2026 (Bylaws v1.0, effective July 2025)
- [`roster_2026_07_onward.json`](roster_2026_07_onward.json) — **EEC v2.0**, AY 2026 onward (Bylaws v2.0, effective July 2026)

---

## Table of contents

- [Three governance eras at a glance](#three-governance-eras-at-a-glance)
- [Schema](#schema)
  - [Top-level fields](#top-level-fields)
  - [Member entry](#member-entry)
  - [Date-bounded membership](#date-bounded-membership)
  - [Role changes within an era (`roleByPeriod`)](#role-changes-within-an-era-rolebyperiod)
  - [Attendance groups](#attendance-groups)
- [Era differences](#era-differences)
  - [EOC era (AY 2024–2025)](#eoc-era-ay-20242025)
  - [EEC v1.0 (AY 2025–2026)](#eec-v10-ay-20252026)
  - [EEC v2.0 (AY 2026 onward)](#eec-v20-ay-2026-onward)
- [Subcommittees by era](#subcommittees-by-era)
- [Common reconciliation pitfalls](#common-reconciliation-pitfalls)
- [Maintenance workflow](#maintenance-workflow)
- [Change log](#change-log)

---

## Three governance eras at a glance

| Era | Window | Committee | Bylaws | Voting Seats | Quorum | Action Register |
|---|---|---|---|---|---|---|
| 1 | Jul 2024 – Jun 2025 | **EOC** (Executive Oversight Committee) | (no formal bylaws version) | 30 | 16 (derived; not codified in EOC-era practice) | Single combined (Appendix A only) |
| 2 | Jul 2025 – Jun 2026 | **EEC** (Executive Education Committee) | Version 1.0 | 19 | 10 | Dual (A curricular, B operational) |
| 3 | Jul 2026 – onward | **EEC** (Executive Education Committee) | Version 2.0 | 13 | 7 | Dual (A curricular, B operational) |

Era cutover is by **meeting date**, not by transcript content — a meeting on July 1, 2025 is EEC v1.0 even if it discusses business carried over from the EOC era.

---

## Schema

Each roster JSON file follows the same schema. The structure is intentionally flat to support deterministic merging, date-based filtering, and human review.

### Top-level fields

```json
{
  "era": "2024-07_to_2025-06",
  "label": "AY July 2024 – June 2025 EOC Membership",
  "committeeName": "Executive Oversight Committee",
  "committeeAbbreviation": "EOC",
  "effectiveFrom": "2024-07-01",
  "effectiveTo": "2025-06-30",
  "governanceVersionLabel": null,
  "useDualAppendices": false,
  "totalVotingSeats": 30,
  "quorumRequired": 16,
  "attendanceGroupLabels": { ... },
  "subcommittees": ["PCCS", "CCS", "CIS", "CSS", "AES"],
  "chair": { ... },
  "administrativeLead": { ... },
  "recordingSecretary": { ... },
  "members": [ ... ]
}
```

| Field | Type | Notes |
|---|---|---|
| `era` | string | Era identifier (snake_case, dates) |
| `label` | string | Human-readable era label used in document headers |
| `committeeName` | string | Full committee name |
| `committeeAbbreviation` | string | `EOC` or `EEC` — drives filename prefix and section headings |
| `effectiveFrom`, `effectiveTo` | ISO date | Era window. `effectiveTo` may be `null` for the current/future era |
| `governanceVersionLabel` | string\|null | E.g., `"EEC Bylaws v1.0 (effective July 2025)"`; `null` for EOC era |
| `useDualAppendices` | bool | `true` for EEC v1.0+; controls Appendix B generation |
| `totalVotingSeats` | int | Declared total at full membership |
| `quorumRequired` | int | Quorum threshold |
| `attendanceGroupLabels` | object | Display labels for the four attendance groups |
| `subcommittees` | string[] | Active subcommittees in this era (used in §3 routing) |
| `chair`, `administrativeLead`, `recordingSecretary` | object | Standing officer entries used in document headers and signatures |
| `members` | object[] | Array of member entries (see below) |

### Member entry

```json
{
  "name": "Ganesh Gunasekaran",
  "credentials": "MD",
  "voting": true,
  "group": "votingPresent",
  "role": "Faculty Educator at Large; Section Chief of Hepatobiliary Surgery"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Display name; used for fuzzy matching against transcripts |
| `credentials` | string | yes | E.g., `"MD"`, `"PhD"`, `"MD PhD"`, `"DrPH MPH"`. Empty string for students. |
| `voting` | bool | yes | Whether this seat counts toward quorum |
| `group` | string | yes | Attendance-group key (see below) |
| `role` | string | yes (if no `roleByPeriod`) | Display role string |
| `effectiveFrom` | ISO date | no | Optional start date within the era |
| `effectiveTo` | ISO date | no | Optional end date within the era |
| `roleByPeriod` | object[] | no | Alternative to static `role` for in-era role transitions |

### Date-bounded membership

Members whose seat is only active for part of the era carry `effectiveFrom` and/or `effectiveTo`. The skill applies date filtering when resolving attendance for a specific meeting date — a member outside the active window is treated as not seated at that meeting (neither present nor absent for quorum purposes).

```json
{
  "name": "Avnish Deobhakta",
  "credentials": "MD",
  "voting": true,
  "group": "votingPresent",
  "role": "Faculty Educator at Large; Ophthalmology",
  "effectiveFrom": "2024-07-26",
  "effectiveTo": "2025-01-31"
}
```

When a seat is filled successively by different people (e.g., Avnish Deobhakta → Brian Rice), enter both as separate members with non-overlapping `effectiveFrom`/`effectiveTo` ranges:

```json
{
  "name": "Brian Rice",
  "credentials": "MD",
  "voting": true,
  "group": "votingPresent",
  "role": "Faculty Educator at Large; Assistant Professor – Hospital Medicine",
  "effectiveFrom": "2025-02-01"
}
```

### Role changes within an era (`roleByPeriod`)

When the same person stays seated but their **role label** changes mid-era, use `roleByPeriod` instead of duplicating the member entry. Example: Valerie Parkas served as Interim Sr. Associate Dean for Student Affairs through December 2025, then became Sr. Associate Dean for Admissions & Recruitment in January 2026 when Steve Paik took over Student Affairs.

```json
{
  "name": "Valerie Parkas",
  "credentials": "MD",
  "voting": false,
  "group": "thirdGroup",
  "role": "Ex Officio; Interim Sr. Associate Dean for Student Affairs",
  "effectiveFrom": "2025-07-01",
  "effectiveTo": "2025-12-31",
  "roleByPeriod": [
    {
      "effectiveFrom": "2026-01-01",
      "effectiveTo": "2026-06-30",
      "role": "Ex Officio; Sr. Associate Dean for Admissions & Recruitment"
    }
  ]
}
```

When resolving for a meeting date, the skill checks `roleByPeriod` first; if no entry matches the date, it falls back to the top-level `role`.

### Attendance groups

Each member is assigned to one of four attendance groups, identified by key:

| Key | EOC + EEC v1.0 label | EEC v2.0 label |
|---|---|---|
| `votingPresent` | Voting Members Present | Voting Members Present |
| `votingAbsent` | Voting Members Absent | Voting Members Absent |
| `thirdGroup` | Guests / Ex Officio Members Present (Non-Voting) | Non-Voting EEC Members Present |
| `fourthGroup` | CA Leadership Present (Non-Voting) | Guests Present |

The display labels are stored in each roster's `attendanceGroupLabels` object so consumers can render the right header per era.

A member's `group` is the **default** assignment. When the skill processes a transcript, voting members not named in attendance move to the `votingAbsent` group for that meeting only; the roster itself is not modified.

---

## Era differences

### EOC era (AY 2024–2025)

**30 voting seats**, broad voting franchise:

- 1 Chair (Michelle Francis, MD)
- 8 Faculty Educators at Large
- 1 Library / Information Sciences (Kris Alpi, PhD)
- 4 Faculty Curricular Leaders (2 Phase 1, 2 Phase 2)
- 2 Career & Specialty Advising (CaPD + Specialty Advisor)
- 4 Representative seats (DEI, MD/PhD, GME, Faculty at Large)
- 5 Subcommittee Chairs (PCCS, CCS, AES, Electives, MSR — **CSS Chair is Rainier Soriano, who is non-voting as ex officio**, so CSS is not counted here)
- 1 Director of Student Success and Progression (Jillian Palmer)
- 4 Student Representatives (M1 ASCEND, M2 Legacy, M3 Legacy, M4 Legacy)

**Quorum**: Formally not codified in EOC-era practice. The 16-of-30 majority value used in minutes is a derived threshold; meeting minutes from this era should note that the EOC's quorum-attestation practice was not formalized until EEC Bylaws v1.0 (effective July 2025).

**Mid-year transitions in this roster:**
- Avnish Deobhakta seated Jul 26, 2024 (Ophthalmology); departed end of Jan 2025
- Brian Rice succeeds Avnish in the same Faculty Educator at Large seat, effective Feb 1, 2025
- Alan Zhang seats as M1 ASCEND student rep on Jan 10, 2025 — **no Phase 1 student in seat before that date** (ASCEND-cohort lag)

### EEC v1.0 (AY 2025–2026)

**19 voting seats** — subcommittee chairs move from voting to CA Leadership (non-voting), and several representative seats are not carried forward:

- 1 Chair
- 8 Faculty Educators at Large
- 1 Library / Information Sciences
- 4 Faculty Curricular Leaders
- 2 Career & Specialty Advising
- 3 Student Representatives (Phase 1 student lag continues — no separate M1 ASCEND seat in v1.0)

**Removed from voting body vs. EOC**: DEI rep, MD/PhD rep, GME rep, Faculty at Large, Director of Student Success and Progression, all 5 voting subcommittee chairs, MSR Chair seat.

**Off-boarded**: Brian Coakley (off at end of AY 2024–2025), Ann-Gel Palermo (DEI seat not carried into v1.0).

**Mid-year transitions in this roster:**
- Steve Paik joins as Sr. Associate Dean for Student Affairs, effective Jan 1, 2026 (replacing interim Valerie Parkas)
- Valerie Parkas transitions to Sr. Associate Dean for Admissions & Recruitment, effective Jan 1, 2026 (continuing as ex officio in the new role — recorded via `roleByPeriod`)
- Jacob Shreffler starts as Sr. Associate Dean for Assessment, Evaluation, and Accreditation, effective April 2026 (succeeding Robert Fallar's reporting line)

### EEC v2.0 (AY 2026 onward)

**13 voting seats**, narrower body with a co-chair structure:

- 1 Faculty Co-Chair (Michelle Francis, outgoing November 2026)
- 7 General Faculty seats (2 vacant TBA + 5 named, term Jul 2024–Jul 2028 staggered)
- 4 Student Representatives (Phase 1, Phase 2, Phase 3, MSTP)

**Non-voting structural changes vs. v1.0:**
- Administrative Co-Chair role established (Rainier Soriano)
- Subcommittee Co-Chairs (PCCS, CCS, CIS, AES) each have a Faculty Co-Chair and an Administrative Co-Chair, all non-voting on the EEC
- Tonia Kim, Cynthia Abraham, Eric Kutscher transition from voting (EOC + v1.0) to non-voting General Faculty in v2.0
- CSS subcommittee dissolved; MSR remains dissolved

---

## Subcommittees by era

| Era | Active subcommittees | Notes |
|---|---|---|
| EOC (AY 2024–2025) | PCCS, CCS, CIS, CSS, AES | SAS listed in bylaws but never convened; MSR existed in AY 2023–2024 but was dissolved before AY 2024–2025 |
| EEC v1.0 (AY 2025–2026) | PCCS, CCS, CIS, CSS, AES | Same five as EOC era; chairs moved from voting to CA Leadership |
| EEC v2.0 (AY 2026 onward) | PCCS, CCS, CIS, AES | CSS dissolved under v2.0 governance refactor |

The `subcommittees` array in each roster JSON should list **only the active subcommittees** that may legitimately route business to the EEC in that era. Do not include subcommittees that exist on paper but do not meet.

---

## Common reconciliation pitfalls

These patterns recur when reconciling transcripts against the roster. The first three were tracked during a multi-transcript regeneration cycle in May 2026 and are documented here so they can be caught proactively.

1. **Auto-caption phonetic artifacts on names.**
   - "Dr. Lightman" → Dr. Michael Leitman, not Dr. Staci Leisman (the auto-caption renders "Leitman" as "Lightman").
   - "Vicindra" → Dr. Vasundhara Singh.
   - "Antonia" → Dr. Tonia Kim.
   - "Best Torch" (August 2024 transcript) → likely a real POM Assistant Module Director name garbled by auto-caption; verify against contemporaneous records.
   - "Maasai / Massi" → Mr. Masih Babagoli.
   - "Dr. Trevor" (anatomy course director) — surname not in transcripts; verify before finalizing.

2. **Voting-present under-attestation in Zoom transcripts.** Voting-member counts derived from speakers-on-record will systematically under-count actual attendance, since silent attendees do not appear. Reconcile against contemporaneous sign-in logs before finalizing minutes for the LCME evidence file.

3. **Same person, multiple roles.** A single person may sit in multiple groups simultaneously (e.g., Rainier Soriano as ex officio Sr. Associate Dean for Curricular Affairs AND as Chair of the Curriculum Steering Subcommittee in EOC and EEC v1.0; Michelle Francis as EEC Faculty Co-Chair AND AES Faculty Co-Chair in EEC v2.0). Record these as separate member entries with the appropriate `group` value; do not merge.

4. **Guests are not roster members.** Treat invited speakers from outside the standing membership (e.g., admissions presenters bringing forward a policy item, working-group chairs reporting out) as guests in the document — do not add them to the roster. Examples: Jacquelyn Chudow co-presented the pre-medical requirements update at the January 10, 2025 EOC meeting as a guest, not as a standing member.

5. **Roster updates do not propagate retroactively.** A correction to a roster file does not invalidate previously generated minutes documents. When the roster changes, archive the prior version under a tag or branch before editing, so historical minutes remain reproducible against the roster as it stood when they were generated.

---

## Maintenance workflow

When updating a roster, prefer **adding date-bounded entries** over rewriting role strings. This preserves historical accuracy for past meetings.

Step-by-step:

1. **Identify the change**: new member, departure, role change, or correction.
2. **Locate the affected member entry** (or determine that a new entry is needed).
3. For role changes mid-era, **add a `roleByPeriod` entry** rather than editing the top-level `role`. The top-level `role` should remain the role as of the start of the era window.
4. For departures, **set `effectiveTo`** to the last date the member held the seat. Do not delete the entry.
5. For successor appointments to the same seat, **add a new member entry with `effectiveFrom`** set to the day after the predecessor's `effectiveTo`.
6. **Validate the JSON**: `python -m json.tool roster_XXXX.json > /dev/null` should succeed.
7. **Reconcile the declared totals**: `totalVotingSeats` should equal the count of members with `voting: true` who are active at the era's steady state. Date-bounded successors sharing a seat will inflate the raw count; that is expected.
8. **Document the change** in the [change log](#change-log) below.

---

## Change log

**May 25, 2026** — Initial publication of corrected rosters for all three eras.

Key corrections from earlier provisional/approximated versions:

- **EOC era roster** (AY 2024–2025) was previously approximated from the AY 2025–2026 EEC roster with 19 voting seats. The corrected roster has **30 voting seats**, reflecting the broader EOC-era voting franchise (subcommittee chairs, DEI/MD-PhD/GME representatives, and Director of Student Success and Progression all voting in the EOC era).
- **Quorum** for EOC era set to 16 (majority of 30, derived). Note that the EOC era did not have a formally codified quorum-attestation practice — that was first codified under EEC Bylaws v1.0.
- **Avnish Deobhakta**: effective Jul 26, 2024 – Jan 31, 2025; succeeded by Brian Rice effective Feb 1, 2025 in the same Faculty Educator at Large seat.
- **Alan Zhang** seated as M1 ASCEND student representative on Jan 10, 2025 (no Phase 1 student in that seat before that date).
- **Brian Coakley** off-boarded at end of AY 2024–2025; not carried into EEC v1.0.
- **Ann-Gel Palermo** voted in EOC era as DEI representative; not carried into EEC v1.0 (DEI seat dropped from voting body in v1.0).
- **Mary Rojas** voted in EOC era as Chair of the Medical Student Research Subcommittee; MSR Subcommittee was dissolved before EEC v1.0, and Mary's voting seat did not carry forward.
- **Vasundhara Singh** voted in EOC era as Chair of the Electives Subcommittee; transitioned to CA Leadership as Director of Medical Student Electives in EEC v1.0 (non-voting).
- **Subcommittee Chairs** (Robert Fallar/AES, Staci Leisman/PCCS, Teddy Holzer/CCS) voted in EOC era; transitioned to CA Leadership (non-voting) in EEC v1.0.
- **Curriculum Steering Subcommittee (CSS) Chair**: Rainier Soriano in both EOC and EEC v1.0 (non-voting in both, since he already holds the ex officio Sr. Associate Dean for Curricular Affairs role).
- **Jacquelyn Chudow** removed from the roster — she is a guest presenter for admissions-related items, not a standing member.
- **Valerie Parkas** role transition mid-EEC-v1.0 (Interim Sr. Associate Dean for Student Affairs → Sr. Associate Dean for Admissions & Recruitment in January 2026) captured via `roleByPeriod`.
- **Steve Paik** added effective Jan 1, 2026 as Sr. Associate Dean for Student Affairs.
- **Tonia Kim, Cynthia Abraham, Eric Kutscher** transition from voting (EOC + v1.0) to non-voting (v2.0) — captured in EEC v2.0 roster.
- **Jillian Palmer** confirmed as voting member (Director of Student Success and Progression) in EOC era.
- **Subcommittee structures cleaned**: SAS removed from all rosters (never convened); MSR removed from EEC v1.0 and v2.0; CSS removed from EEC v2.0.

---

## License and attribution

These rosters are maintained for ISMMS internal curricular-affairs use and LCME accreditation documentation. Reference these files when generating EEC or EOC meeting minutes, building governance documentation, or supporting accreditation reviews.

For questions or corrections, contact the Office of Curricular Affairs.
