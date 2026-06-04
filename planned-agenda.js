/* ============================================================================
 * planned-agenda.js  —  ASCEND Curriculum Governance Dashboard
 * ----------------------------------------------------------------------------
 * Supplies UPCOMING (pre-meeting) agendas for any committee + date, without
 * having to add a meeting record to eec-data.js. The dashboard apps call
 * window.PLANNED_AGENDA.itemsFor(committee, date); for a "Scheduled" meeting
 * those items are folded into the meeting's agenda and shown as the planned
 * agenda. Once real minutes are filed for that date, the meeting record in
 * eec-data.js takes over and this planned agenda is no longer used.
 *
 * SOURCE: MASTER_Agenda_Tracker (2026-05-18) — "EEC Agenda" sheet plus the four
 * subcommittee sheets (PCCS / CCS / CIS / AES). Regenerate from that workbook
 * when it changes. 78 items across EEC + all four subcommittees.
 *
 * LOAD ORDER: include this file AFTER eec-data.js / mobile-schedules.js and
 * BEFORE desktop-app.jsx / mobile-app.jsx, e.g.:
 *     <script src="eec-data.js"></script>
 *     <script src="mobile-schedules.js"></script>
 *     <script src="planned-agenda.js"></script>     <-- this line
 *     <script type="text/babel" src="mobile-app.jsx"></script>
 *
 * ----------------------------------------------------------------------------
 * AGENDA ITEM SHAPE (every field optional except `title`):
 *   {
 *     n:        "2",                   // section/agenda number (shown as §2)
 *     category: "VOTING ITEM",         // drives the pill color/label. Use one of:
 *                                      //   "VOTING ITEM"    -> voting pill
 *                                      //   "FOR DISCUSSION" -> cyan pill
 *                                      //   "FOR REVIEW"     -> review pill
 *                                      //   "INFORMATIONAL"  -> muted pill
 *                                      //   (anything else)  -> muted pill
 *     ready:    "YES",                 // if it contains "YES", shows a READY badge
 *     title:    "Module Review — Renal",        // REQUIRED
 *     subitems: ["Background", "Action plan"],  // optional bullet list
 *     owner:    "PCCS",                // "Subcommittee owner:" line (EEC items)
 *     presenter:"Staci Leisman, MD",   // "Presenter:" line
 *     guests:   "Dr. Jane Doe",        // "Guests:" line
 *     goesToEEC:"2026-07-10",          // EEC meeting a subcommittee item feeds
 *   }
 *
 * KEY FORMAT: "COMMITTEE|YYYY-MM-DD"  (committee must match an id in
 * eec-data.js COMMITTEES: EEC, PCCS, CCS, CIS, AES — and the date must match a
 * scheduled meeting date for that committee in mobile-schedules.js, otherwise
 * there is no scheduled meeting for the agenda to attach to.)
 *
 * NOTE — AES Jan–Jun 2027: the tracker lists these AES meetings as month-only
 * placeholders (no firm day), so the two item-bearing ones are keyed to the 1st
 * (AES|2027-03-01, AES|2027-04-01) to match the placeholders in
 * mobile-schedules.js. Re-key once the AES 2027 dates are finalized.
 * ==========================================================================*/

(function () {
  "use strict";

  // ── Planned agendas, keyed "COMMITTEE|YYYY-MM-DD" ─────────────────────────
  // Add/edit entries here. To remove one, delete its key. Editing is safe at
  // any time — nothing else in the dashboard needs to change.
  const AGENDAS = {

    // ===== EEC ===============================================================
    "EEC|2026-06-05": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", category: "VOTING ITEM", ready: "YES", title: "Module Review — THINQ (Class of 2028)",
        owner: "CIS",
        presenter: "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
        guests: "Leona Hess, Bess Storch, David Portnoy, Maaike vanGerwen, Aveena Kochar, CIS student Reps",
      },
      { n: "3", category: "FOR REVIEW", ready: "YES", title: "Year 3 Legacy Clerkship Year (Transitions)",
        owner: "CCS",
        presenter: "Teddy Holzer, MD (CCS Admin Co-Chair)",
        guests: "CCS Student Reps",
      },
      { n: "4", category: "INFORMATIONAL", ready: "YES", title: "ASCEND Curriculum Review Process",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
    ],
    "EEC|2026-06-26": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", category: "VOTING ITEM", title: "Class of 2028 Semester 3 Review",
        subitems: ["(Endocrinology, Gastroenterology, GUSRH, MSK, Renal)"],
        owner: "PCCS",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
      },
      { n: "3", category: "VOTING ITEM", title: "Class of 2029 Semester 1 Review",
        subitems: ["(Foundations: MCG, Anatomy, FIM, Pathology)"],
        owner: "PCCS",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
      },
      { n: "4", category: "VOTING ITEM", ready: "YES", title: "Outcomes of NBME Examinations Performance and Resident Review Survey Results - Criteria for Sucess",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
    ],
    "EEC|2026-07-10": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", category: "VOTING ITEM", title: "Phase 1 Module Learning Objectives",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
      },
      { n: "3", category: "VOTING ITEM", title: "Review of MD Program Policies - HIGH PRIORITY",
        subitems: ["Advancement/Progression Policy", "Academic Remediation Policy", "Grading Policy", "Grade Appeal Policy", "Technical Standards Policy", "Attendance Policy", "LOA Policy", "Characteristics of Accepted Applicants", "Student Work Hours", "Pre-med requirements", "Timeliness of Grades Policy", "MM/C Feedback Policy", "Narrative Assessment Policy", "Student Eval Completion Policy", "COI in Student Assessment", "Elective Requirements"],
        owner: "Other",
        presenter: "Other",
        guests: "Kris Alpi, Val Parkas, Jackie Chudow",
      },
    ],
    "EEC|2026-08-07": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", category: "VOTING ITEM", title: "AY 2025-26 Year-End Governance Closeout Report",
        owner: "PCCS",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
        guests: "Staci Leisman",
      },
      { n: "3", category: "VOTING ITEM", title: "Clinical Skills Review: Class of 2028 (POM 1, POM 2, and POM 3)",
        owner: "CCS",
        presenter: "Chris Strother (Chair, CCWG)",
        guests: "Horatio Holzer, MD (CCS Admin Co-Chair), Mike Herscher",
      },
    ],
    "EEC|2026-09-04": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", category: "VOTING ITEM", title: "PEAKS 1 Review",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "3", category: "VOTING ITEM", title: "Review of MD Program Policies - MEDIUM PRIORITY",
        subitems: ["Clinical Supervision Policy", "RCE Policy", "Mistreatment Policy", "Residents as Teachers Policy", "FERPA", "Student Promotions Committee"],
        owner: "Other",
        presenter: "Other",
      },
      { n: "4", category: "VOTING ITEM", title: "Class of 2029 Semester 2 Review",
        subitems: ["(Neuroscience, Behavioral Science, Hematology, Cardiology, Pulmonary)"],
        owner: "PCCS",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
        guests: "Staci Leisman",
      },
    ],
    "EEC|2026-10-02": [
      { n: "1", category: "VOTING ITEM", ready: "YES", title: "Minutes Approval",
        presenter: "Michelle Francis, MD (EEC Co-Chair)",
      },
      { n: "2", title: "AES Mid-Cycle Assessment Outcomes Report",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
        guests: "Jacob Shreffler",
      },
      { n: "3", title: "Areas of Concentration (AOC) Presentation #1",
        presenter: "AOC Director (TBD)",
      },
      { n: "4", title: "Class of 2029 Sem 1 Module Reviews — [remaining, if any]",
        owner: "PCCS",
        presenter: "Staci Leisman, MD (PCCS Admin Co-Chair)",
      },
    ],
    "EEC|2026-11-06": [
      { n: "1", title: "THINQ Integration Update",
        owner: "CIS",
        presenter: "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
      },
      { n: "2", title: "Step 1 Results & Subject Area Performance",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "3", title: "Match Data Class of 2026 + Program Directors Survey",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "4", title: "Areas of Concentration (AOC) Presentation #2",
        presenter: "AOC Director (TBD)",
      },
    ],
    "EEC|2026-12-04": [
      { n: "1", title: "Mid-Year Curricular Review",
        presenter: "Rainier Soriano, MD",
      },
      { n: "2", title: "AES — Assessment Policy Updates",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "3", title: "Areas of Concentration (AOC) Presentation #3",
        presenter: "AOC Director (TBD)",
      },
      { n: "4", title: "Class of 2029 POM 2 Module Review",
        owner: "CCS",
        presenter: "Horatio Holzer, MD (CCS Admin Co-Chair)",
      },
    ],
    "EEC|2027-01-08": [
      { n: "1", title: "Electives Summary — Class of 2026 + New Electives + Grading",
        owner: "CCS",
        presenter: "Horatio Holzer, MD (CCS Admin Co-Chair)",
      },
    ],
    "EEC|2027-02-05": [
      { n: "1", title: "Phase 1 Remediation Outcomes Report",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "2", title: "Areas of Concentration (AOC) Presentation #4",
        presenter: "AOC Director (TBD)",
      },
    ],
    "EEC|2027-03-05": [
      { n: "1", title: "Class of 2029 Sem 3 — Phase 1 Module Review Bundle",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
      { n: "2", title: "Class of 2029 Sem 3 — POM 3 Module Review",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
      { n: "3", title: "LCME DCI Preparation Update",
        presenter: "Rainier Soriano, MD",
      },
      { n: "4", title: "Phase 1 → Phase 2 Transition Report",
        owner: "CIS",
        presenter: "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
      },
    ],
    "EEC|2027-04-02": [
      { n: "1", title: "Class of 2030 Sem 1 — Phase 1 Module Review Bundle",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
      { n: "2", title: "Combined ASCEND Phase 1 Review — Class of 2028 + Class of 2029" },
      { n: "3", title: "Class of 2030 Sem 1 — POM 1 Module Review",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
      { n: "4", title: "Match Outcomes Report — Class of 2027 (Legacy Y4)",
        owner: "AES",
        presenter: "Steve Paik, MD",
        guests: "Steve Paik",
      },
      { n: "5", title: "Medical Student Research Day Recap",
        presenter: "MSRO",
      },
    ],
    "EEC|2027-05-07": [
      { n: "1", title: "AES — Year-End Assessment Outcomes Report",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "2", title: "PEAKS II Outcomes Report",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      },
      { n: "3", title: "AY 27-28 Policy Package [PLACEHOLDER — specific policies TBD]",
        presenter: "Rainier Soriano, MD",
      },
    ],
    "EEC|2027-06-04": [
      { n: "1", title: "Combined ASCEND Phase 2/3 Review — Class of 2028 + Class of 2029",
        owner: "AES",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
      { n: "2", title: "AY 2026-27 Year-End Closeout & AY 27-28 Planning",
        presenter: "Rainier Soriano, MD",
      },
      { n: "3", title: "AY 27-28 Policy Package — Final Approval (if needed)",
        presenter: "Rainier Soriano, MD",
      },
      { n: "4", title: "Heads-Up: Class of 2028 Full Curriculum Review (AY 27-28)",
        presenter: "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
      },
    ],

    // ===== PCCS ==============================================================
    "PCCS|2026-06-11": [
      { n: "1", title: "MSK (Class of 2028 Sem 3)",
        presenter: "Module Directors",
        goesToEEC: "2026-06-26",
      },
      { n: "2", title: "FIM (Class of 2029 Sem 1)",
        presenter: "Module Directors",
      },
      { n: "3", title: "Pathology (Class of 2029 Sem 1)",
        presenter: "Module Director",
      },
    ],
    "PCCS|2026-07-09": [
      { n: "1", title: "Neuro (Class of 2029 Sem 2) — Module Directors",
        presenter: "Module Directors",
        goesToEEC: "2026-08-07",
      },
      { n: "2", title: "BS (Class of 2029 Sem 2) — Module Director",
        presenter: "Module Director",
      },
      { n: "3", title: "Heme (Class of 2029 Sem 2) — Module Director",
        presenter: "Module Director",
      },
    ],
    "PCCS|2026-08-13": [
      { n: "1", title: "Cardiology (Class of 2029 Sem 2)",
        presenter: "Module Directors",
        goesToEEC: "2026-09-04",
      },
      { n: "2", title: "Pulmonary (Class of 2029 Sem 2)",
        presenter: "Module Directors",
      },
      { n: "3", title: "Clinical Supervision Policy",
        subitems: ["RCE Policy", "Mistreatment Policy", "Residents as Teachers Policy", "FERPA", "Student Promotions Committee"],
      },
    ],
    "PCCS|2027-02-11": [
      { n: "1", title: "Class of 2029 Sem 3 — Phase 1 Module Review Bundle (AES)",
        goesToEEC: "2027-03-05",
      },
    ],
    "PCCS|2027-03-11": [
      { n: "1", title: "Combined ASCEND Phase 1 Review — C/o 2028 + C/o 2029 (AES)",
        goesToEEC: "2027-04-02",
      },
    ],
    "PCCS|2027-04-08": [
      { n: "1", title: "Class of 2030 Sem 1 — Phase 1 Module Review Bundle (AES)",
        goesToEEC: "2027-05-07",
      },
    ],

    // ===== CCS ===============================================================
    "CCS|2026-08-11": [
      { n: "1", title: "POM 2 (Class of 2028 Sem 2 — Leftover) — Module Director",
        goesToEEC: "2026-09-04",
      },
      { n: "2", title: "Clinical Supervision Policy",
        subitems: ["RCE Policy", "Mistreatment Policy", "Residents as Teachers Policy", "FERPA", "Student Promotions Committee"],
      },
    ],
    "CCS|2026-11-10": [
      { n: "1", title: "Class of 2029 POM 2 — Module Director",
        goesToEEC: "2026-12-04",
      },
    ],
    "CCS|2026-12-08": [
      { n: "1", title: "Electives Summary — Class of 2026 + New Electives + Grading (Holzer)",
        goesToEEC: "2027-01-08",
      },
    ],
    "CCS|2027-02-02": [
      { n: "1", title: "Class of 2029 Sem 3 — POM 3 Module Review (AES)",
        goesToEEC: "2027-02-05",
      },
    ],
    "CCS|2027-03-16": [
      { n: "1", title: "Class of 2030 Sem 1 — POM 1 Module Review (AES)",
        goesToEEC: "2027-04-02",
      },
    ],
    "CCS|2027-05-18": [
      { n: "1", title: "Combined ASCEND Phase 2/3 Review — C/o 2028 + C/o 2029 (AES)",
        goesToEEC: "2027-06-04",
      },
    ],

    // ===== CIS ===============================================================
    "CIS|2026-10-15": [
      { n: "1", title: "THINQ Integration Update (Ramaswamy)",
        goesToEEC: "2026-11-06",
      },
    ],
    "CIS|2027-02-11": [
      { n: "1", title: "Phase 1 → Phase 2 Transition Report (Ramaswamy)",
        goesToEEC: "2027-03-05",
      },
    ],

    // ===== AES ===============================================================
    "AES|2026-09-15": [
      { n: "1", title: "AES Mid-Cycle Assessment Outcomes Report",
        goesToEEC: "2026-10-02",
      },
    ],
    "AES|2026-10-20": [
      { n: "1", title: "Step 1 Results & Subject Area Performance",
        goesToEEC: "2026-11-06",
      },
      { n: "2", title: "Match Data Class of 2026 + Program Directors Survey" },
    ],
    "AES|2026-11-17": [
      { n: "1", title: "Assessment Policy Updates",
        goesToEEC: "2026-12-04",
      },
    ],
    "AES|2026-12-15": [
      { n: "1", title: "Phase 1 Remediation Outcomes Report (advance)",
        goesToEEC: "2027-02-05",
      },
    ],
    "AES|2027-03-01": [
      { n: "1", title: "Match Outcomes Report — Class of 2027 (Legacy Y4)",
        goesToEEC: "2027-04-02",
      },
    ],
    "AES|2027-04-01": [
      { n: "1", title: "Year-End Assessment Outcomes Report",
        goesToEEC: "2027-05-07",
      },
      { n: "2", title: "PEAKS II Outcomes Report" },
    ],
  };

  // ── Public interface ──────────────────────────────────────────────────────
  function key(committee, date) {
    return String(committee) + "|" + String(date);
  }

  window.PLANNED_AGENDA = {
    // Raw table, exposed for inspection/debugging.
    AGENDAS,

    // Primary interface the dashboard calls. Returns [] when nothing is planned
    // (callers already treat an empty array as "no planned agenda").
    itemsFor(committee, date) {
      const items = AGENDAS[key(committee, date)];
      return Array.isArray(items) ? items : [];
    },

    // Convenience: list the dates that have a planned agenda for a committee.
    datesFor(committee) {
      const prefix = String(committee) + "|";
      return Object.keys(AGENDAS)
        .filter((k) => k.indexOf(prefix) === 0)
        .map((k) => k.slice(prefix.length))
        .sort();
    },

    // Convenience: add/replace a planned agenda at runtime (handy for testing
    // from the console). Persisting still means editing the AGENDAS table above.
    set(committee, date, items) {
      AGENDAS[key(committee, date)] = Array.isArray(items) ? items : [];
      return AGENDAS[key(committee, date)];
    },
  };
})();
