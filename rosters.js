// rosters.js — Canonical committee membership rosters.
// Source of truth for the Membership screen.
// Patches window.EEC.MEMBERS at load to (a) add the missing TBA AES Faculty Co-Chair
// EEC seat and (b) refresh roles / emails / term dates from the May 2026 EEC sheet.

(function () {
  // ── EEC ROSTER (24 members, 13 voting · quorum 7) ──────────────────────
  // From the Executive Education Committee sheet (final, May 2026).
  // existingId points to the member already in eec-data.js if matched (we
  // preserve their attendance history). null means "create a new member".
  const EEC_ROSTER = [
    { existingId:"p011", name:"Michelle Francis, MD",          govTitle:"General Faculty Co-Chair (outgoing)", profTitle:"",                                                                            voting:true,  email:"michelle.francis@mountsinai.org", start:"Nov 2026", renew:"Nov 2029" },
    { existingId:"p024", name:"Rainier Soriano, MD",           govTitle:"Administrative Co-Chair",             profTitle:"Senior Associate Dean for Curricular Affairs",                                  voting:false, email:"rainier.soriano@mssm.edu",        start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p200", name:"TBA — General Faculty A",       govTitle:"General Faculty",                     profTitle:"",                                                                            voting:true,  email:"",                                start:"TBD",      renew:"TBD" },
    { existingId:"p201", name:"TBA — General Faculty B",       govTitle:"General Faculty",                     profTitle:"",                                                                            voting:true,  email:"",                                start:"TBD",      renew:"TBD" },
    { existingId:"p012", name:"Ganesh Gunasekaran, MD",        govTitle:"General Faculty",                     profTitle:"Section Chief of Hepatobiliary Surgery",                                       voting:true,  email:"ganesh.gunasekaran@mountsinai.org",start:"Jul 2025", renew:"Jul 2028" },
    { existingId:"p013", name:"Arvind Kamthan, MD",            govTitle:"General Faculty",                     profTitle:"Associate Professor — Hematology and Medical Oncology",                       voting:true,  email:"Arvind.Kamthan@mountsinai.org",   start:"Jul 2025", renew:"Jul 2028" },
    { existingId:"p007", name:"Brian Rice, MD",                govTitle:"General Faculty",                     profTitle:"Assistant Professor — Hospital Medicine",                                     voting:true,  email:"Brian.Rice@mountsinai.org",       start:"Jul 2025", renew:"Jul 2028" },
    { existingId:"p003", name:"Kyunghyun Lee, MD",             govTitle:"General Faculty",                     profTitle:"Assistant Professor — Hospital Medicine",                                     voting:true,  email:"Kyunghyun.Lee@mountsinai.org",    start:"Jul 2024", renew:"Jul 2027" },
    { existingId:"p008", name:"Richard Stern, MD",             govTitle:"General Faculty",                     profTitle:"Associate Professor — Radiology, Medical Education",                           voting:true,  email:"Richard.Stern@mountsinai.org",    start:"Jul 2024", renew:"Jul 2027" },
    { existingId:"p005", name:"Sreekala Raghavan, MD",         govTitle:"General Faculty",                     profTitle:"Associate Professor — General Internal Medicine, Medical Education",          voting:true,  email:"sreekala.raghavan@mssm.edu",      start:"Jul 2024", renew:"Jul 2027" },
    { existingId:"p001", name:"Tonia Kim, MD",                 govTitle:"General Faculty",                     profTitle:"PCCS Faculty Co-Chair",                                                       voting:false, email:"tonia.kim@mountsinai.org",        start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p072", name:"Deanna Chieco, MD",             govTitle:"General Faculty",                     profTitle:"CCS Faculty Co-Chair",                                                        voting:false, email:"deanna.chieco@mountsinai.org",    start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p094", name:"Leona Hess, PhD",               govTitle:"General Faculty",                     profTitle:"CIS Faculty Co-Chair",                                                        voting:false, email:"leona.hess@mssm.edu",             start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p999_aes_chair_tba", name:"TBA — AES Faculty Co-Chair", govTitle:"General Faculty", profTitle:"AES Faculty Co-Chair", voting:false, email:"", start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p014", name:"Cynthia Abraham, MD",           govTitle:"General Faculty",                     profTitle:"Module Director (Pre-clerkship)",                                              voting:false, email:"cynthia.abraham@mountsinai.org",  start:"Dec 2025", renew:"Dec 2028" },
    { existingId:"p028", name:"Eve Merrill, MD",               govTitle:"General Faculty",                     profTitle:"Clerkship Director (Inpatient Medicine)",                                      voting:false, email:"eve.merrill@mountsinai.org",      start:"",         renew:"" },
    { existingId:"p002", name:"Eric Kutscher, MD",             govTitle:"General Faculty",                     profTitle:"Assistant Professor — General Internal Medicine",                              voting:false, email:"Eric.Kutscher@mountsinai.org",    start:"Jul 2025", renew:"Jul 2028" },
    { existingId:"p010", name:"Brad Rosenberg, MD, PhD",       govTitle:"General Faculty",                     profTitle:"Associate Professor in the Department of Microbiology",                        voting:false, email:"brad.rosenberg@mssm.edu",         start:"Jul 2026", renew:"Jul 2029" },
    { existingId:"p029", name:"Craig Katz, MD",                govTitle:"General Faculty",                     profTitle:"Clinical Professor — Psychiatry, Medical Education, and Health System Design & Global Health", voting:false, email:"craig.katz@mssm.edu",       start:"Dec 2025", renew:"Dec 2028" },
    { existingId:"p041", name:"Vannita Simma-Chiang, MD",      govTitle:"General Faculty",                     profTitle:"Director of Specialty Advising",                                               voting:false, email:"vannita.simma-chiang@mountsinai.org", start:"Mar 2026", renew:"Mar 2029" },
    { existingId:"p202", name:"Phase 1 Student — TBA",         govTitle:"General Faculty",                     profTitle:"Student Representative, Phase 1",                                              voting:true,  email:"",                                start:"Jul 2026", renew:"" },
    { existingId:"p048", name:"Alan Zhang",                    govTitle:"General Faculty",                     profTitle:"Student Representative, Phase 2",                                              voting:true,  email:"alan.zhang@icahn.mssm.edu",       start:"Jan 2025", renew:"" },
    { existingId:"p015", name:"Jamie Frost",                   govTitle:"General Faculty",                     profTitle:"Student Representative, Phase 3",                                              voting:true,  email:"jamie.frost@icahn.mssm.edu",      start:"Jul 2024", renew:"" },
    { existingId:"p119", name:"Jillian Palmer",                govTitle:"General Faculty",                     profTitle:"Director of Student Success and Progression",                                  voting:true,  email:"",                                start:"Jul 2025", renew:"Dec 2025", termStart:"2025-07-01", termEnd:"2025-12-31" },
    { existingId:"p203", name:"MSTP Student — TBA",            govTitle:"General Faculty",                     profTitle:"Student Representative, MSTP",                                                 voting:true,  email:"",                                start:"Jul 2026", renew:"" },
  ];

  // ── Patch EEC.MEMBERS in-place ─────────────────────────────────────────
  function applyRosterToEEC() {
    const E = window.EEC;
    if (!E) { console.warn("[rosters] window.EEC not loaded"); return; }

    // 1) Build the new list of EEC member IDs (in roster order). For each
    //    entry: reuse existing record if possible, otherwise synthesise.
    const rosterIds = [];
    let nextSyntheticId = 300;

    for (const r of EEC_ROSTER) {
      let m;
      if (r.existingId && E.memberById[r.existingId]) {
        m = E.memberById[r.existingId];
      } else {
        // Create a fresh record.
        const id = "p" + String(nextSyntheticId++).padStart(3, "0");
        m = {
          id, name: r.name,
          canonical: r.name.toLowerCase().replace(/[^a-z0-9 ]+/g, "").replace(/\s+/g, " ").trim(),
          role: "", email: "", seats: [],
          presentCount: 0, absentCount: 0,
          meetingsPresent: [], meetingsAbsent: [],
          tracked: false,
        };
        E.MEMBERS.push(m);
        E.memberById[id] = m;
      }
      rosterIds.push(m.id);

      // Refresh name + role + email from the sheet.
      m.name = r.name;
      m.email = r.email || "";
      m.role  = r.profTitle || r.govTitle || m.role;

      // Replace the EEC seat (preserve other-committee seats).
      const others = (m.seats || []).filter(s => s.committee !== "EEC");
      const newSeat = {
        committee: "EEC",
        seat: r.govTitle || "General Faculty",
        vote: r.voting,
        title: r.profTitle || "",
        startYear: r.start || "",
        renewYear: r.renew || "",
        termStart: r.termStart || null,
        termEnd:   r.termEnd   || null,
      };
      m.seats = [newSeat, ...others];
    }

    // 2) Strip the EEC seat from anyone NOT in the new roster — they no
    //    longer hold an EEC seat under the May 2026 roster.
    const rosterSet = new Set(rosterIds);
    for (const m of E.MEMBERS) {
      if (rosterSet.has(m.id)) continue;
      if ((m.seats || []).some(s => s.committee === "EEC")) {
        m.seats = m.seats.filter(s => s.committee !== "EEC");
      }
    }

    // 3) Update committee meta for EEC. Roster length is the source of truth;
    //    quorum remains 7 per the final bylaws sheet.
    const eec = E.committeeById.EEC;
    if (eec) {
      const total = rosterIds.length;
      const votingCount = EEC_ROSTER.filter(r => r.voting).length;
      eec.votingSeats    = votingCount;
      eec.nonVotingSeats = total - votingCount;
      eec.quorum         = 7;
    }
  }

  // ── Build presenter rosters for the Membership screen ───────────────────
  function rosterFor(committeeId, opts) {
    opts = opts || {};
    const E = window.EEC;
    const all = E.MEMBERS.filter(m => (m.seats || []).some(s => s.committee === committeeId));
    let rows = all.map(m => {
      const seat = (m.seats || []).find(s => s.committee === committeeId);
      const total = m.presentCount + m.absentCount;
      // Attendance percentage is only meaningful for the EEC roster.
      const eecRate = total > 0 ? Math.round(100 * m.presentCount / total) : null;
      return {
        id: m.id,
        name: m.name,
        email: m.email || "",
        committee: committeeId,
        seat: seat?.seat || "",
        voting: !!seat?.vote,
        title: seat?.title || "",
        start: seat?.startYear || "",
        renew: seat?.renewYear || "",
        termStart: seat?.termStart || null,
        termEnd:   seat?.termEnd   || null,
        attendanceRate: eecRate, // only fill from EEC tally
        presentCount: m.presentCount,
        absentCount: m.absentCount,
      };
    });

    // Filter by an explicit date (live tracker) — member must be active that day.
    if (opts.date) {
      rows = rows.filter(r => {
        if (r.termStart && opts.date < r.termStart) return false;
        if (r.termEnd   && opts.date > r.termEnd)   return false;
        return true;
      });
    }
    // Filter by AY — member's term must overlap the AY range.
    if (opts.ay && AY_RANGES[opts.ay]) {
      const range = AY_RANGES[opts.ay];
      rows = rows.filter(r => {
        if (r.termStart && r.termStart > range.end) return false;
        if (r.termEnd   && r.termEnd   < range.start) return false;
        return true;
      });
    }

    return rows.sort((a, b) => {
      // Strictly alphabetical by surname; TBA placeholders sink to the bottom.
      const tbaA = /\bTBA\b/i.test(a.name);
      const tbaB = /\bTBA\b/i.test(b.name);
      if (tbaA !== tbaB) return tbaA ? 1 : -1;
      return surname(a.name).localeCompare(surname(b.name));
    });
  }

  function surname(name) {
    const base = (name || "").replace(/,.*$/, "").trim();
    const parts = base.split(/\s+/);
    return parts[parts.length - 1] || base;
  }

  // Academic-year helpers. AY runs Jul 1 → Jun 30.
  const AY_RANGES = {
    "2024-25": { start: "2024-07-01", end: "2025-06-30", label: "AY 2024–25" },
    "2025-26": { start: "2025-07-01", end: "2026-06-30", label: "AY 2025–26" },
    "2026-27": { start: "2026-07-01", end: "2027-06-30", label: "AY 2026–27" },
  };
  const AY_KEYS = ["2026-27"];
  const CURRENT_AY = "2026-27";

  function ayOf(dateStr) {
    if (!dateStr) return null;
    for (const k of AY_KEYS) {
      if (dateStr >= AY_RANGES[k].start && dateStr <= AY_RANGES[k].end) return k;
    }
    return null;
  }

  function ayStatsFor(memberId, ay) {
    const m = window.EEC.memberById[memberId];
    if (!m) return { presentCount: 0, absentCount: 0, total: 0, rate: null, meetingsPresent: [], meetingsAbsent: [] };
    const r = AY_RANGES[ay];
    const inRange = (d) => r && d >= r.start && d <= r.end;
    const present = (m.meetingsPresent || []).filter(inRange);
    const absent  = (m.meetingsAbsent  || []).filter(inRange);
    const total = present.length + absent.length;
    return {
      presentCount: present.length,
      absentCount:  absent.length,
      total,
      rate: total > 0 ? Math.round(100 * present.length / total) : null,
      meetingsPresent: present,
      meetingsAbsent:  absent,
    };
  }

  function meetingsInAY(committeeId, ay) {
    const r = AY_RANGES[ay];
    if (!r) return [];
    return window.EEC.MEETINGS.filter(m =>
      m.committee === committeeId &&
      m.attendanceRate != null &&
      m.date >= r.start && m.date <= r.end
    );
  }

  function allMembers() {
    // Flat list across the four committees — one row per member, with all
    // their seats. Useful for the "ALL" filter.
    const E = window.EEC;
    const ids = ["EEC", "PCCS", "CCS", "CIS"];
    const seen = new Map();
    for (const cid of ids) {
      for (const r of rosterFor(cid)) {
        if (!seen.has(r.id)) {
          const member = E.memberById[r.id];
          const total = member.presentCount + member.absentCount;
          seen.set(r.id, {
            id: r.id,
            name: r.name,
            email: r.email,
            seats: (member.seats || []).filter(s => ids.includes(s.committee)),
            attendanceRate: total > 0 ? Math.round(100 * member.presentCount / total) : null,
            presentCount: member.presentCount,
            absentCount: member.absentCount,
          });
        }
      }
    }
    return [...seen.values()].sort((a, b) => {
      const tbaA = /\bTBA\b/i.test(a.name);
      const tbaB = /\bTBA\b/i.test(b.name);
      if (tbaA !== tbaB) return tbaA ? 1 : -1;
      return surname(a.name).localeCompare(surname(b.name));
    });
  }

  // ── Expose ──────────────────────────────────────────────────────────────
  function init() {
    if (!window.EEC) return false;
    applyRosterToEEC();
    window.ROSTERS = {
      EEC_ROSTER_DEF: EEC_ROSTER,
      rosterFor,
      allMembers,
      surname,
      AY_RANGES, AY_KEYS, CURRENT_AY,
      ayOf, ayStatsFor, meetingsInAY,
    };
    return true;
  }

  // eec-data.js is loaded synchronously before this file (per index.html),
  // so window.EEC is already populated when this IIFE runs.
  if (!init()) {
    // Defensive fallback.
    document.addEventListener("DOMContentLoaded", init);
  }
})();
