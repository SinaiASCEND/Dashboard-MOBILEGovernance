// desktop-app.jsx — ASCEND Curriculum Governance Dashboard (desktop layout)
// Renders into #root on wide viewports (see index.html RootApp switch).
// Consumes the SAME data layer as the mobile app, untouched:
//   window.EEC            — COMMITTEES, MEMBERS, MEETINGS, MOTIONS, ACTIONS, POLICIES, REVIEWS, LCME, MEPOS + *ById maps
//   window.MS_DATE        — parseLocal / ymdLocal
//   window.MOBILE_SCHEDULE — committeeMeetings / nextMeeting / filedCount / hasMinutesFile
//   window.MEETING_DETAILS — per-meeting governance/operational action plans
//
// Everything is wrapped in an IIFE so no top-level names collide with mobile-app.jsx.

(function () {
  const { useState, useEffect, useMemo, useRef, useCallback } = React;

  // ── Desktop-only CSS (leans on styles.css tokens + primitives) ─────────────
  const DESKTOP_CSS = `
.d-app { min-height: 100vh; display: flex; flex-direction: column; background: var(--grey-1); }
.d-app .topbar { position: sticky; top: 0; z-index: 30; }
.d-app .topbar .crumbs .cur { color: var(--ink); font-weight: 600; }
.d-app .topbar .ay { font-size: 11px; letter-spacing: 0.06em; color: var(--grey-11); display:flex; align-items:center; gap:10px; }
.d-app .topbar .ay .pill-ay { padding: 2px 8px; border: 1px solid var(--grey-3); background: var(--paper); border-radius: 4px; }

.d-body { display: flex; align-items: flex-start; flex: 1; min-height: 0; }
.d-main { flex: 1; min-width: 0; padding: 26px 30px 72px; max-width: 1220px; margin: 0 auto; width: 100%; }
.d-main > * { animation: dFade .34s ease both; }
@keyframes dFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.d-head { margin-bottom: 18px; }
.d-head h1 { font-family: var(--serif); font-size: 26px; font-weight: 600; letter-spacing: -0.02em; }
.d-head .lede { color: var(--grey-11); font-size: 13px; margin-top: 4px; max-width: 720px; line-height: 1.55; }

/* Hero cards — immediate past + next upcoming meeting (live vs access date) */
.d-hero-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 4px 0 26px; }
@media (max-width: 760px) { .d-hero-row { grid-template-columns: 1fr; } }
.d-hero { position: relative; text-align: left; border: 1px solid var(--grey-2); border-radius: var(--radius-lg); padding: 18px 20px 18px 24px; background: var(--paper); box-shadow: var(--shadow-sm); cursor: pointer; overflow: hidden; transition: box-shadow .18s ease, transform .18s ease; font: inherit; color: inherit; display: block; }
.d-hero:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.d-hero .accent { position: absolute; left: 0; top: 0; bottom: 0; width: 5px; }
.d-hero .glow { position: absolute; right: -40px; top: -40px; width: 160px; height: 160px; border-radius: 50%; opacity: .10; pointer-events: none; }
.d-hero .eyebrow { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--grey-11); }
.d-hero .eyebrow svg { width: 14px; height: 14px; }
.d-hero .when { font-family: var(--serif); font-size: 27px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); line-height: 1.1; margin: 10px 0 3px; }
.d-hero .rel { font-size: 12px; color: var(--grey-11); }
.d-hero .row { display: flex; align-items: center; gap: 9px; margin-top: 14px; flex-wrap: wrap; }
.d-hero .cname { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--ink); }
.d-hero .cname .sw { width: 9px; height: 9px; border-radius: 2px; }
.d-hero .open { position: absolute; right: 16px; bottom: 16px; color: var(--grey-7); display: inline-flex; }
.d-hero.next { background: linear-gradient(180deg, var(--brand-cyan-tint), var(--paper) 70%); }
.d-hero.empty { cursor: default; box-shadow: none; background: var(--grey-1); border-style: dashed; }
.d-hero.empty:hover { transform: none; box-shadow: none; }
.d-hero.empty .when { font-size: 16px; color: var(--grey-11); font-family: var(--sans); font-weight: 500; }
.d-rest-head { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-11); font-weight: 600; margin: 4px 0 10px; }

/* segmented committee filter */
.d-seg { display: inline-flex; gap: 2px; padding: 3px; background: var(--grey-2); border-radius: 999px; margin: 2px 0 18px; flex-wrap: wrap; }
.d-seg button { border: 0; background: transparent; padding: 6px 14px; border-radius: 999px; font: inherit; font-size: 12px; color: var(--grey-11); cursor: pointer; letter-spacing: 0.01em; }
.d-seg button.active { background: var(--paper); color: var(--ink); font-weight: 600; box-shadow: var(--shadow-sm); }
.d-seg button .swatch { display:inline-block; width:8px; height:8px; border-radius:2px; margin-right:7px; vertical-align: middle; }

.d-toolbar { display:flex; align-items:center; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
.d-toolbar .spacer { flex: 1; }
.d-toolbar .chk { display:flex; align-items:center; gap:7px; font-size:12px; color: var(--grey-11); cursor:pointer; }
.d-select { font: inherit; font-size: 12px; padding: 6px 10px; border:1px solid var(--grey-3); border-radius: var(--radius); background: var(--paper); color: var(--ink); }

/* KPI strip */
.d-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 22px; }
.d-kpis .card { padding: 16px 16px 14px; }

/* committee cards */
.d-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 14px; }
.d-cc { position: relative; overflow: hidden; cursor: pointer; transition: box-shadow .15s, transform .15s; }
.d-cc:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.d-cc .stripe { position:absolute; top:0; left:0; right:0; height:3px; }
.d-cc .short { font-family: var(--serif); font-size: 22px; font-weight: 700; line-height: 1; margin: 6px 0 2px; }
.d-cc .nm { font-size: 12px; color: var(--grey-11); line-height: 1.35; min-height: 32px; }
.d-cc .row2 { display:flex; gap: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--grey-2); }
.d-cc .stat .n { font-family: var(--serif); font-size: 18px; font-weight: 700; line-height: 1; }
.d-cc .stat .l { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--grey-7); margin-top: 3px; }

/* generic two-column section grid */
.d-grid2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; align-items: start; }
@media (max-width: 1040px){ .d-grid2 { grid-template-columns: 1fr; } }

.d-listcard .li { display:flex; align-items:center; gap: 12px; padding: 10px 4px; border-bottom: 1px solid var(--grey-2); cursor: pointer; }
.d-listcard .li:last-child { border-bottom: 0; }
.d-listcard .li:hover { background: var(--grey-1); }
.d-listcard .li .dt { font-family: var(--mono); font-size: 11px; color: var(--grey-11); min-width: 86px; }
.d-listcard .li .ttl { flex: 1; min-width: 0; font-size: 12.5px; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; }

/* tables */
.tbl .row-link { cursor: pointer; }
.tbl td .sub { color: var(--grey-7); font-size: 11px; }
.d-chips { display:flex; flex-wrap: wrap; gap: 4px; }
.d-chip { font-family: var(--mono); font-size: 10px; padding: 1px 6px; border-radius: 4px; background: var(--grey-1); border:1px solid var(--grey-2); color: var(--grey-11); }
.d-cdot { display:inline-flex; align-items:center; gap:6px; font-size: 11.5px; }
.d-cdot .sw { width: 8px; height: 8px; border-radius: 2px; }

/* attendance heatmap */
.d-heatwrap { overflow-x: auto; border:1px solid var(--grey-3); border-radius: var(--radius-lg); background: var(--paper); }
.d-heat { border-collapse: separate; border-spacing: 0; font-size: 11px; }
.d-heat th, .d-heat td { padding: 0; }
.d-heat thead th { position: sticky; top: 0; background: var(--paper); z-index: 2; }
.d-heat .namecol { position: sticky; left: 0; background: var(--paper); z-index: 3; text-align:left; padding: 6px 12px; min-width: 220px; border-right:1px solid var(--grey-3); border-bottom:1px solid var(--grey-2); }
.d-heat thead .namecol { z-index: 4; }
.d-heat .dcol { width: 34px; text-align:center; font-family: var(--mono); font-size: 9px; color: var(--grey-11); padding: 6px 0; border-bottom:1px solid var(--grey-2); vertical-align: bottom; }
.d-heat .cell { width: 34px; height: 30px; border-bottom:1px solid var(--grey-1); }
.d-heat .cell .box { width: 22px; height: 22px; border-radius: 4px; margin: 0 auto; }
.d-heat .pctcol { text-align:right; padding: 6px 12px; font-family: var(--mono); font-size: 11px; border-bottom:1px solid var(--grey-2); }
.d-heat tbody tr:hover td { background: var(--grey-1); }
.d-legend { display:flex; gap: 16px; align-items:center; margin: 12px 2px 0; font-size: 11.5px; color: var(--grey-11); }
.d-legend .it { display:flex; align-items:center; gap:6px; }
.d-legend .it .sw { width: 12px; height: 12px; border-radius: 3px; }

/* slide-over drawer */
.d-scrim { position: fixed; inset: 0; background: rgba(15,23,42,0.35); z-index: 60; animation: dScrim .2s ease both; }
@keyframes dScrim { from { opacity: 0; } to { opacity: 1; } }
.d-drawer { position: fixed; top: 0; right: 0; height: 100vh; width: min(620px, 92vw); background: var(--paper); z-index: 61;
  box-shadow: -24px 0 60px -20px rgba(0,0,0,0.4); display:flex; flex-direction: column; animation: dSlide .26s cubic-bezier(.32,.72,.34,1) both; }
@keyframes dSlide { from { transform: translateX(100%); } to { transform: none; } }
.d-drawer .dh { flex: 0 0 auto; padding: 20px 24px 16px; border-bottom: 1px solid var(--grey-2); }
.d-drawer .dh .eyebrow { font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--grey-11); font-weight: 600; }
.d-drawer .dh h2 { font-family: var(--serif); font-size: 20px; font-weight: 600; letter-spacing: -0.015em; margin-top: 4px; line-height: 1.2; }
.d-drawer .dh .x { position:absolute; top: 16px; right: 18px; width: 30px; height: 30px; border-radius: var(--radius); border:1px solid var(--grey-3); background: var(--paper); cursor: pointer; display:grid; place-items:center; color: var(--grey-11); }
.d-drawer .db { flex: 1; overflow-y: auto; padding: 18px 24px 40px; }
.d-drawer .db::-webkit-scrollbar { width: 8px; } .d-drawer .db::-webkit-scrollbar-thumb { background: var(--grey-3); border-radius: 4px; }

.d-kv { display:grid; grid-template-columns: 140px 1fr; gap: 7px 14px; font-size: 12.5px; margin: 4px 0 16px; }
.d-kv .k { color: var(--grey-11); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; padding-top: 1px; }
.d-kv .v { color: var(--ink-2); line-height: 1.45; }
.d-block { margin: 16px 0; }
.d-block h4 { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey-11); font-weight: 600; margin-bottom: 8px; }
.d-itemcard { border:1px solid var(--grey-2); border-radius: var(--radius-lg); padding: 12px 14px; margin-bottom: 8px; border-left: 3px solid var(--grey-3); }
.d-itemcard .it-top { display:flex; align-items:center; gap:8px; margin-bottom: 5px; flex-wrap: wrap; }
.d-itemcard .it-ttl { font-family: var(--serif); font-size: 13.5px; font-weight: 600; line-height: 1.3; }
.d-itemcard .it-meta { font-size: 11.5px; color: var(--grey-11); margin-top: 6px; line-height: 1.4; }
.d-dl { background: var(--brand-magenta); color:#fff; border:0; border-radius: 999px; padding: 9px 18px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; display:inline-flex; align-items:center; gap:8px; text-decoration: none; }
.d-dl:hover { background: var(--brand-magenta-deep); text-decoration: none; }

.d-empty { background: var(--paper); border:1px dashed var(--grey-3); border-radius: var(--radius-lg); padding: 40px 24px; text-align:center; color: var(--grey-11); }
.d-empty h3 { font-family: var(--serif); font-size: 16px; color: var(--ink); margin-bottom: 6px; }
.d-prose { font-size: 12.5px; line-height: 1.6; color: var(--ink-2); white-space: pre-wrap; }

/* charts */
.d-chart svg { display:block; width:100%; height:auto; }
.d-chartnote { font-size: 11.5px; color: var(--grey-11); margin-top: 10px; line-height: 1.5; }
.d-chartnote b { color: var(--ink-2); font-weight: 600; }
.d-donut-wrap { display:flex; align-items:center; gap: 20px; }
.d-donut-legend { display:flex; flex-direction:column; gap: 9px; font-size: 12px; }
.d-donut-legend .it { display:flex; align-items:center; gap: 8px; }
.d-donut-legend .it .sw { width: 10px; height: 10px; border-radius: 3px; flex: 0 0 10px; }
.d-donut-legend .it .v { margin-left: auto; font-family: var(--mono); color: var(--grey-11); padding-left: 12px; }
.d-hbars .hb { display:flex; align-items:center; gap: 10px; margin-bottom: 9px; font-size: 12px; }
.d-hbars .hb .lbl { flex: 0 0 168px; color: var(--ink-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.d-hbars .hb .lbl .std { font-family: var(--mono); color: var(--grey-7); margin-right: 6px; }
.d-hbars .hb .track { flex: 1; height: 16px; background: var(--grey-1); border-radius: 4px; overflow:hidden; display:flex; }
.d-hbars .hb .track .seg { height: 100%; }
.d-hbars .hb .n { flex: 0 0 auto; font-family: var(--mono); font-size: 11px; color: var(--grey-11); min-width: 28px; text-align:right; }
.d-stacklegend { display:flex; gap: 16px; margin-bottom: 14px; font-size: 11.5px; color: var(--grey-11); }
.d-stacklegend .it { display:flex; align-items:center; gap:6px; } .d-stacklegend .it .sw { width:11px; height:11px; border-radius:3px; }
`;

  // ── small utilities ─────────────────────────────────────────────────────
  const E = () => window.EEC;
  const D = (s) => window.MS_DATE.parseLocal(s);
  function fmt(s, style) {
    if (!s) return "—";
    const d = D(s);
    if (style === "long") return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    if (style === "mdy") return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (style === "md") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const COMMITTEE_IDS = ["EEC", "PCCS", "CCS", "CIS", "AES"];
  const cmt = (id) => E().committeeById[id] || { short: id, name: id, color: "var(--grey-7)", deep: "var(--grey-11)", tint: "var(--grey-1)" };
  const isFiled = (m) => m.minutesStatus === "Approved";

  // ── Planned agenda (scheduled meetings) ───────────────────────────────────
  function plannedItems(committee, date) {
    return (window.PLANNED_AGENDA && window.PLANNED_AGENDA.itemsFor)
      ? window.PLANNED_AGENDA.itemsFor(committee, date) : [];
  }
  // Turn a window.MOBILE_SCHEDULE entry into a meeting-like object, attaching any
  // planned agenda. Filed-but-not-yet-held records (minutesStatus "Scheduled")
  // and synthesized schedule stubs both get their planned items folded into items[].
  function scheduleEntryToMeeting(entry) {
    if (entry.kind === "filed" && entry.m) {
      const m = entry.m;
      if (m.minutesStatus === "Scheduled") {
        const planned = plannedItems(m.committee, m.date);
        const items = (m.items && m.items.length) ? m.items : planned;
        return { ...m, items, planned: items.length > 0 };
      }
      return m;
    }
    const planned = plannedItems(entry.committee, entry.date);
    return {
      id: `scheduled:${entry.committee}:${entry.date}`,
      committee: entry.committee, date: entry.date,
      type: "Regular Scheduled Meeting", time: entry.time || null,
      modality: null, presidingOfficer: null,
      items: planned, topics: [],
      present: [], absent: [], recused: [], exOfficio: [], guests: [],
      attendanceRate: null, minutesStatus: "Scheduled",
      planned: planned.length > 0, synthetic: true,
    };
  }
  // Unified meeting list across one or all committees: filed minutes + scheduled
  // sessions from the shared schedule, newest first.
  function allMeetings(committee) {
    const sched = window.MOBILE_SCHEDULE;
    if (!sched || !sched.committeeMeetings) return E().MEETINGS.slice().sort((a, b) => b.date.localeCompare(a.date));
    const ids = committee === "ALL" ? COMMITTEE_IDS : [committee];
    const out = [];
    for (const cid of ids) {
      for (const en of (sched.committeeMeetings(cid) || [])) out.push(scheduleEntryToMeeting(en));
    }
    return out.sort((a, b) => b.date.localeCompare(a.date));
  }
  // Resolve a meeting id (real or synthesized "scheduled:CID:DATE") to a meeting.
  function resolveMeeting(id) {
    const real = E().meetingById[id];
    if (real) return scheduleEntryToMeeting({ kind: "filed", m: real });
    return allMeetings("ALL").find((x) => x.id === id) || null;
  }

  function statusPill(s) {
    const n = (s || "").toLowerCase();
    if (n.includes("complete") || n === "closed") return "good";
    if (n.includes("progress")) return "cyan";
    if (n.includes("defer") || n.includes("lost")) return "warn";
    return "muted";
  }
  function resultPill(r) {
    const n = (r || "").toLowerCase();
    if (n.includes("approve")) return "good";
    if (n.includes("defer")) return "warn";
    return "muted";
  }
  function minutesPill(s) {
    const n = (s || "").toLowerCase();
    if (n.includes("approve")) return "good";
    if (n.includes("schedul")) return "cyan";
    return "muted";
  }

  function Icon({ d, size = 16, sw = 2 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    );
  }
  const ICONS = {
    dash: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
    cal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    gavel: <><path d="m14 4 6 6" /><path d="m11 7 6 6-2 2-6-6z" /><path d="m9 9-6 6 2 2 6-6" /><path d="M14 21h8" /></>,
    check: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    chev: <polyline points="9 6 15 12 9 18" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  };

  function LcmeChips({ ids }) {
    if (!ids || !ids.length) return null;
    return <span className="d-chips">{ids.map((x, i) => <span key={i} className="d-chip">{x}</span>)}</span>;
  }
  function CDot({ id }) {
    const c = cmt(id);
    return <span className="d-cdot"><span className="sw" style={{ background: c.color }} />{c.short}</span>;
  }

  // ── Charts (dependency-free SVG / HTML in the brand palette) ────────────────
  // Literal hex (not CSS vars) so colours resolve inside SVG presentation attrs.
  const PAL = {
    violet: "#221F72", cyan: "#00AEEF", cyanDeep: "#008CC0", magenta: "#D80B8C",
    good: "#1F8A4C", goodTint: "#E4F3EA", bad: "#B82B1E", badTint: "#FAE5E2",
    warn: "#B0710A", warnTint: "#FAF1DC", grey1: "#F5F6F7", grey2: "#ECEDEF",
    grey3: "#DEDFE2", grey7: "#8A8B8E", grey11: "#58595B", ink: "#141414", paper: "#FFFFFF",
  };

  // (1) Attendance trend — area + line with a dashed quorum threshold.
  // Scoped to ATTENDANCE_START via meetingsForCommittee; committee defaults to EEC.
  function AttendanceTrend({ height = 190, compact = false, committee = "EEC" }) {
    const e = E();
    const c = e.committeeById[committee] || { quorum: 7, votingSeats: 13, short: committee };
    const pts = (e.meetingsForCommittee ? e.meetingsForCommittee(committee) : e.MEETINGS.filter(isFiled))
      .filter((m) => m.attendanceRate != null)
      .map((m) => ({ date: m.date, v: Math.round(m.attendanceRate * 100) }));
    if (!pts.length) return (
      <div className="d-chart" style={{ display: "grid", placeItems: "center", minHeight: compact ? 80 : 160, color: "var(--grey-7)", fontSize: 12 }}>
        No meetings on file since {fmt(e.ATTENDANCE_START, "mdy")}.
      </div>
    );
    const quorum = Math.round((c.quorum / c.votingSeats) * 100);
    const W = 660, H = height, padL = compact ? 4 : 32, padR = compact ? 4 : 56, padT = 10, padB = compact ? 6 : 24;
    const iw = W - padL - padR, ih = H - padT - padB, n = pts.length;
    const X = (i) => padL + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
    const Y = (v) => padT + (1 - v / 100) * ih;
    const line = pts.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
    const area = `${line} L${X(n - 1).toFixed(1)},${(padT + ih).toFixed(1)} L${X(0).toFixed(1)},${(padT + ih).toFixed(1)} Z`;
    const below = pts.filter((p) => p.v < quorum).length;
    return (
      <div className="d-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${c.short} attendance by meeting`}>
          <defs><linearGradient id="dAtt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PAL.cyan} stopOpacity="0.20" /><stop offset="100%" stopColor={PAL.cyan} stopOpacity="0.02" />
          </linearGradient></defs>
          {!compact && [0, 50, 100].map((g) => (
            <g key={g}>
              <line x1={padL} x2={W - padR} y1={Y(g)} y2={Y(g)} stroke={PAL.grey2} strokeWidth="1" />
              <text x={padL - 6} y={Y(g) + 3} textAnchor="end" fontSize="9" fill={PAL.grey7} fontFamily="monospace">{g}</text>
            </g>
          ))}
          <line x1={padL} x2={W - padR} y1={Y(quorum)} y2={Y(quorum)} stroke={PAL.warn} strokeWidth="1.2" strokeDasharray="4 3" />
          {!compact && <text x={W - padR + 4} y={Y(quorum) + 3} fontSize="9" fill={PAL.warn} fontFamily="monospace">Quorum {quorum}%</text>}
          <path d={area} fill="url(#dAtt)" />
          <path d={line} fill="none" stroke={PAL.violet} strokeWidth={compact ? 1.6 : 2.2} strokeLinejoin="round" strokeLinecap="round" />
          {pts.map((p, i) => (
            <circle key={i} cx={X(i)} cy={Y(p.v)} r={compact ? 2 : 3.4} fill={p.v < quorum ? PAL.bad : PAL.good} stroke={PAL.paper} strokeWidth="1.4">
              <title>{fmt(p.date, "mdy")}: {p.v}% present</title>
            </circle>
          ))}
          {!compact && pts.map((p, i) => (i % 2 === 0 ? (
            <text key={"t" + i} x={X(i)} y={H - 6} textAnchor="middle" fontSize="8.5" fill={PAL.grey7} fontFamily="monospace">
              {D(p.date).toLocaleDateString("en-US", { month: "short" })}
            </text>
          ) : null))}
        </svg>
        {!compact && <div className="d-chartnote"><b>{pts.length}</b> meeting{pts.length === 1 ? "" : "s"} on record since {fmt(e.ATTENDANCE_START, "mdy")}{below > 0 ? <> · <b>{below}</b> below quorum ({quorum}%)</> : <> · all at or above quorum ({quorum}%)</>}.</div>}
      </div>
    );
  }

  // (3 compact) Overall action-plan status donut.
  function StatusDonut({ counts, size = 132 }) {
    const order = [["Completed", PAL.good], ["In Progress", PAL.cyan], ["Not Started", PAL.warn]];
    const total = order.reduce((s, [k]) => s + (counts[k] || 0), 0) || 1;
    const r = size / 2 - 12, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
    let acc = 0;
    return (
      <div className="d-donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Action plan status">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={PAL.grey2} strokeWidth="14" />
          {order.map(([k, col]) => {
            const v = counts[k] || 0; if (!v) return null;
            const len = (v / total) * circ;
            const seg = <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="14"
              strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-acc}
              transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />;
            acc += len; return seg;
          })}
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize="26" fontWeight="700" fill={PAL.ink} fontFamily="var(--serif)">{total}</text>
          <text x={cx} y={cy + 15} textAnchor="middle" fontSize="9" fill={PAL.grey7} letterSpacing="1.5">ITEMS</text>
        </svg>
        <div className="d-donut-legend">
          {order.map(([k, col]) => (
            <div className="it" key={k}><span className="sw" style={{ background: col }} />{k}<span className="v">{counts[k] || 0}</span></div>
          ))}
        </div>
      </div>
    );
  }

  // (2) LCME standard coverage — horizontal bars (tag frequency across motions + actions + agenda).
  const LCME_STD = { "1": "Mission & CQI", "3": "Learning Environment", "4": "Faculty", "5": "Resources", "6": "Competencies & Objectives", "7": "Curriculum Content", "8": "Curricular Mgmt & Eval", "9": "Assessment", "10": "Admissions", "11": "Academic Support", "12": "Well-being & Advising" };
  function LcmeCoverage() {
    const e = E();
    const counts = {};
    const bump = (ids) => (ids || []).forEach((id) => { const s = String(id).split(".")[0]; if (LCME_STD[s]) counts[s] = (counts[s] || 0) + 1; });
    e.MOTIONS.forEach((m) => bump(m.lcme));
    e.ACTIONS.forEach((a) => bump(a.lcme));
    e.MEETINGS.forEach((m) => (m.items || []).forEach((it) => bump(it.lcme)));
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = rows.length ? rows[0][1] : 1;
    return (
      <div className="d-hbars">
        {rows.map(([std, n]) => (
          <div className="hb" key={std}>
            <span className="lbl"><span className="std">{std}</span>{LCME_STD[std]}</span>
            <span className="track"><span className="seg" style={{ width: Math.max(2, (n / max) * 100) + "%", background: PAL.cyan }} /></span>
            <span className="n">{n}</span>
          </div>
        ))}
        <div className="d-chartnote">Activity concentrates on <b>Standard 8</b> (curricular management) and <b>Standard 9</b> (assessment). Sparse standards flag where committee attention — or just LCME tagging — is thin.</div>
      </div>
    );
  }

  // (3) Action-plan status by domain — stacked horizontal bars for the given rows.
  function StatusByDomain({ rows }) {
    const SEG = [["Not Started", PAL.warn], ["In Progress", PAL.cyan], ["Completed", PAL.good]];
    const byDom = {};
    rows.forEach((a) => { const d = a.domain || "Other"; (byDom[d] = byDom[d] || { "Not Started": 0, "In Progress": 0, "Completed": 0, total: 0 }); if (byDom[d][a.status] != null) byDom[d][a.status]++; byDom[d].total++; });
    const doms = Object.entries(byDom).sort((a, b) => b[1].total - a[1].total);
    const max = doms.length ? doms[0][1].total : 1;
    if (!doms.length) return null;
    return (
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-header"><span className="card-title">Status by domain</span><span className="card-meta">{rows.length} items shown</span></div>
        <div className="d-stacklegend">{SEG.map(([k, c]) => <span className="it" key={k}><span className="sw" style={{ background: c }} />{k}</span>)}</div>
        <div className="d-hbars">
          {doms.map(([d, cts]) => (
            <div className="hb" key={d}>
              <span className="lbl">{d}</span>
              <span className="track" style={{ width: Math.max(8, (cts.total / max) * 100) + "%", flex: "none" }}>
                {SEG.map(([k, c]) => (cts[k] ? <span key={k} className="seg" style={{ width: (cts[k] / cts.total) * 100 + "%", background: c }} title={`${k}: ${cts[k]}`} /> : null))}
              </span>
              <span className="n">{cts.total}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const NAV = [
    { group: "Overview", items: [["overview", "Dashboard", "dash"]] },
    { group: "Governance", items: [["meetings", "Meetings", "cal"], ["motions", "Motions & Votes", "gavel"], ["actions", "Action Plans", "check"]] },
    { group: "People", items: [["members", "Members", "users"], ["attendance", "Attendance", "grid"]] },
    { group: "Library", items: [["reviews", "Curriculum Reviews", "book"], ["policies", "Policies", "doc"]] },
  ];

  function Sidebar({ section, onNav, badges }) {
    return (
      <nav className="sidenav">
        <div style={{ padding: "4px 12px 14px", display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 11, height: 11, borderRadius: 3, background: "var(--brand-violet)" }} />
          <span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 15 }}>ASCEND</span>
        </div>
        {NAV.map((g) => (
          <div className="group" key={g.group}>
            <div className="group-label">{g.group}</div>
            {g.items.map(([key, label, icon]) => (
              <div key={key} className={"nav-item" + (section === key ? " active" : "")} onClick={() => onNav(key)}>
                <span style={{ display: "grid", placeItems: "center", color: section === key ? "var(--brand-cyan-deep)" : "var(--grey-7)" }}>
                  <Icon d={ICONS[icon]} size={15} sw={1.9} />
                </span>
                <span style={{ flex: 1 }}>{label}</span>
                {badges[key] != null && <span className="badge">{badges[key]}</span>}
              </div>
            ))}
          </div>
        ))}
        <div style={{ padding: "14px 12px 0", borderTop: "1px solid var(--grey-3)", marginTop: 8, fontSize: 11, color: "var(--grey-7)", lineHeight: 1.5 }}>
          Mount Sinai · MD Program<br />Office of Curricular Affairs
        </div>
      </nav>
    );
  }

  // ── Committee segmented filter ──────────────────────────────────────────────
  function CommitteeFilter({ value, onChange, includeAll = true }) {
    const opts = includeAll ? ["ALL", ...COMMITTEE_IDS] : COMMITTEE_IDS;
    return (
      <div className="d-seg">
        {opts.map((id) => (
          <button key={id} className={value === id ? "active" : ""} onClick={() => onChange(id)}>
            {id !== "ALL" && <span className="swatch" style={{ background: cmt(id).color }} />}
            {id === "ALL" ? "All committees" : id}
          </button>
        ))}
      </div>
    );
  }

  // ── Drawer shell ────────────────────────────────────────────────────────────
  function Drawer({ eyebrow, title, onClose, children }) {
    useEffect(() => {
      const k = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", k);
      return () => window.removeEventListener("keydown", k);
    }, [onClose]);
    return (
      <>
        <div className="d-scrim" onClick={onClose} />
        <aside className="d-drawer" role="dialog" aria-modal="true">
          <div className="dh" style={{ position: "relative" }}>
            <button className="x" onClick={onClose} aria-label="Close"><Icon d={ICONS.x} size={16} /></button>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 style={{ paddingRight: 40 }}>{title}</h2>
          </div>
          <div className="db">{children}</div>
        </aside>
      </>
    );
  }

  // ════════════════ OVERVIEW ════════════════
  function Overview({ onNav, onSelect }) {
    const e = E();
    const filed = e.MEETINGS.filter(isFiled);
    const scheduled = e.MEETINGS.filter((m) => !isFiled(m)).sort((a, b) => a.date.localeCompare(b.date));
    const motionsApproved = e.MOTIONS.filter((m) => resultPill(m.result) === "good").length;
    const openActions = e.ACTIONS.filter((a) => a.status !== "Completed").length;
    const tracked = e.MEMBERS.filter((m) => m.tracked).length;
    const recent = [...filed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
    const upcoming = scheduled.slice(0, 6);

    const byStatus = { "Not Started": 0, "In Progress": 0, "Completed": 0 };
    e.ACTIONS.forEach((a) => { if (byStatus[a.status] != null) byStatus[a.status]++; });
    const totalA = e.ACTIONS.length;

    const kpis = [
      ["Committees", COMMITTEE_IDS.length, "EEC + 4 subcommittees"],
      ["Meetings on record", filed.length, "approved minutes"],
      ["Motions carried", motionsApproved, `of ${e.MOTIONS.length} voted`],
      ["Open action items", openActions, `${totalA} tracked total`],
      ["Tracked members", tracked, "across all bodies"],
      ["Governing policies", e.POLICIES.length, "current versions"],
    ];

    return (
      <>
        <div className="d-head">
          <h1>Governance Dashboard</h1>
          <div className="lede">A single view across the Executive Education Committee and its four subcommittees — meetings and minutes, membership and attendance, motions, action plans, curriculum reviews, and policies.</div>
        </div>

        <div className="d-kpis">
          {kpis.map(([l, v, sub]) => (
            <div className="card" key={l}>
              <div className="kpi">
                <span className="kpi-label">{l}</span>
                <span className="kpi-value t-num">{v}</span>
                <span className="kpi-delta">{sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head"><h2 style={{ fontSize: 17 }}>Committees</h2></div>
        <div className="d-cards" style={{ marginBottom: 24 }}>
          {COMMITTEE_IDS.map((id) => {
            const c = cmt(id);
            const cFiled = filed.filter((m) => m.committee === id).length;
            const next = window.MOBILE_SCHEDULE.nextMeeting ? window.MOBILE_SCHEDULE.nextMeeting(id) : null;
            const total = (c.votingSeats || 0) + (c.nonVotingSeats || 0);
            return (
              <div className="card d-cc" key={id} onClick={() => onNav("meetings", id)}>
                <span className="stripe" style={{ background: c.color }} />
                <div className="short" style={{ color: c.deep }}>{c.short}</div>
                <div className="nm">{c.name}</div>
                <div className="row2">
                  <div className="stat"><div className="n">{c.votingSeats}<span style={{ fontSize: 11, color: "var(--grey-7)", fontWeight: 400 }}>/{total}</span></div><div className="l">Voting / seats</div></div>
                  <div className="stat"><div className="n">{c.quorum}</div><div className="l">Quorum</div></div>
                  <div className="stat"><div className="n">{cFiled || "—"}</div><div className="l">On record</div></div>
                </div>
                {next && <div style={{ marginTop: 10, fontSize: 11, color: "var(--grey-11)" }}>Next · <strong style={{ color: "var(--ink-2)" }}>{fmt(next.date, "md")}</strong></div>}
                {!cFiled && id !== "EEC" && <div style={{ marginTop: 10, fontSize: 11, fontStyle: "italic", color: "var(--grey-7)" }}>Minutes pending intake</div>}
              </div>
            );
          })}
        </div>

        <div className="d-grid2">
          <div className="card d-listcard">
            <div className="card-header"><span className="card-title">Recent meetings</span><a className="card-meta" style={{ cursor: "pointer" }} onClick={() => onNav("meetings", "ALL")}>View all →</a></div>
            {recent.map((m) => (
              <div className="li" key={m.id} onClick={() => onSelect({ type: "meeting", id: m.id })}>
                <span className="dt">{fmt(m.date, "mdy")}</span>
                <span className="ttl">{(m.items || []).filter((i) => i.title && i.title.length > 4)[0]?.title || m.summary || m.type}</span>
                <span className={"pill " + minutesPill(m.minutesStatus)}>{m.minutesStatus}</span>
              </div>
            ))}
          </div>

          <div className="col" style={{ gap: 18 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Action plan status</span><a className="card-meta" style={{ cursor: "pointer" }} onClick={() => onNav("actions", "ALL")}>Open →</a></div>
              <StatusDonut counts={byStatus} />
            </div>
            <div className="card d-listcard">
              <div className="card-header"><span className="card-title">Upcoming meetings</span></div>
              {upcoming.map((m) => (
                <div className="li" key={m.id} onClick={() => onSelect({ type: "meeting", id: m.id })}>
                  <span className="dt">{fmt(m.date, "mdy")}</span>
                  <span className="ttl" style={{ color: "var(--grey-11)" }}>{cmt(m.committee).short} · {m.type.replace("Regular Scheduled Meeting", "Regular")}</span>
                  <span className="pill cyan">Scheduled</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="d-grid2" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">EEC attendance trend</span><a className="card-meta" style={{ cursor: "pointer" }} onClick={() => onNav("attendance", "ALL")}>Detail →</a></div>
            <AttendanceTrend height={188} />
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">LCME standard coverage</span><span className="card-meta">tag frequency</span></div>
            <LcmeCoverage />
          </div>
        </div>
      </>
    );
  }

  // ════════════════ MEETINGS ════════════════
  function relWhen(dateStr, todayStr) {
    const days = Math.round((D(dateStr) - D(todayStr)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days === -1) return "Yesterday";
    return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
  }

  function MeetingHero({ kind, m, onSelect, todayStr }) {
    const isNext = kind === "next";
    const label = isNext ? "Next meeting" : "Most recent meeting";
    if (!m) {
      return (
        <div className="d-hero empty">
          <div className="eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS.cal}</svg>{label}
          </div>
          <div className="when">{isNext ? "No upcoming meeting scheduled" : "No past meeting on record"}</div>
        </div>
      );
    }
    const c = cmt(m.committee);
    const nItems = (m.items || []).length;
    const statusLabel = isFiled(m) ? m.minutesStatus : (m.planned ? "Agenda set" : m.minutesStatus);
    const statusCls = isFiled(m) ? minutesPill(m.minutesStatus) : (m.planned ? "cyan" : "muted");
    const bigDate = D(m.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return (
      <button className={"d-hero" + (isNext ? " next" : "")} onClick={() => onSelect({ type: "meeting", id: m.id })}>
        <span className="accent" style={{ background: c.color }} />
        <span className="glow" style={{ background: c.color }} />
        <div className="eyebrow" style={{ color: isNext ? "var(--brand-cyan-deep)" : "var(--grey-11)" }}>
          {isNext
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS.cal}</svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>}
          {label}
        </div>
        <div className="when">{bigDate}</div>
        <div className="rel">{relWhen(m.date, todayStr)} · {fmt(m.date, "mdy")}</div>
        <div className="row">
          <span className="cname"><span className="sw" style={{ background: c.color }} />{c.short}</span>
          <span className={"pill " + statusCls} style={{ fontSize: 10.5 }}>{statusLabel}</span>
          {nItems > 0 && <span className="pill muted" style={{ fontSize: 10.5 }}>{nItems} agenda item{nItems === 1 ? "" : "s"}</span>}
        </div>
        <span className="open"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS.chev}</svg></span>
      </button>
    );
  }

  function Meetings({ committee, setCommittee, onSelect }) {
    const e = E();
    const rows = useMemo(() => allMeetings(committee), [committee]);
    const todayStr = (window.MS_DATE && window.MS_DATE.ymdLocal) ? window.MS_DATE.ymdLocal(new Date()) : new Date().toISOString().slice(0, 10);
    const { past, next, rest } = useMemo(() => {
      const future = rows.filter((m) => m.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
      const earlier = rows.filter((m) => m.date < todayStr); // rows are already newest-first
      const nx = future[0] || null;
      const pa = earlier[0] || null;
      const keep = new Set([nx && nx.id, pa && pa.id].filter(Boolean));
      return { past: pa, next: nx, rest: rows.filter((m) => !keep.has(m.id)) };
    }, [rows, todayStr]);

    return (
      <>
        <div className="d-head"><h1>Meetings &amp; Minutes</h1><div className="lede">The two cards below jump to the most recent meeting and the next one coming up, based on today's date. Everything else is listed underneath.</div></div>
        <CommitteeFilter value={committee} onChange={setCommittee} />
        {rows.length === 0 ? (
          <div className="d-empty"><h3>Pending intake</h3><p>No meetings on record for this committee yet.</p></div>
        ) : (
          <>
            <div className="d-hero-row">
              <MeetingHero kind="past" m={past} onSelect={onSelect} todayStr={todayStr} />
              <MeetingHero kind="next" m={next} onSelect={onSelect} todayStr={todayStr} />
            </div>
            {rest.length > 0 && (
              <>
                <div className="d-rest-head">All meetings · {rest.length}</div>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <table className="tbl">
                    <thead><tr><th style={{ paddingLeft: 16 }}>Date</th><th>Committee</th><th>Type</th><th className="num">Agenda</th><th className="num">Motions</th><th>Attendance</th><th>Status</th></tr></thead>
                    <tbody>
                      {rest.map((m) => {
                        const motions = e.MOTIONS.filter((v) => v.meetingId === m.id).length;
                        const att = m.attendanceRate != null ? Math.round(m.attendanceRate * 100) + "%" : "—";
                        const nItems = (m.items || []).length;
                        const statusLabel = m.planned ? "Agenda set" : m.minutesStatus;
                        const statusCls = m.planned ? "cyan" : minutesPill(m.minutesStatus);
                        return (
                          <tr key={m.id} className="row-link" onClick={() => onSelect({ type: "meeting", id: m.id })}>
                            <td style={{ paddingLeft: 16, whiteSpace: "nowrap" }} className="mono">{fmt(m.date, "mdy")}</td>
                            <td><CDot id={m.committee} /></td>
                            <td style={{ maxWidth: 280 }}>{m.type.replace("Regular Scheduled Meeting", "Regular")}</td>
                            <td className="num">{nItems || "—"}</td>
                            <td className="num">{motions || "—"}</td>
                            <td className="t-mono" style={{ color: "var(--grey-11)" }}>{att}</td>
                            <td><span className={"pill " + statusCls}>{statusLabel}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  }

  function MeetingDrawer({ id, onClose, onSelect }) {
    const e = E();
    const m = resolveMeeting(id);
    if (!m) return null;
    const c = cmt(m.committee);
    const md = window.MEETING_DETAILS && window.MEETING_DETAILS[id];
    const gov = md ? md.actions.filter((a) => a.kind === "governance") : [];
    const ops = md ? md.actions.filter((a) => a.kind === "operational") : [];
    const motions = e.MOTIONS.filter((v) => v.meetingId === id);
    const hasFile = isFiled(m) && window.MOBILE_SCHEDULE.hasMinutesFile && window.MOBILE_SCHEDULE.hasMinutesFile(m.date);
    const fileName = `EEC_Minutes_${m.date}.docx`;

    return (
      <Drawer eyebrow={`${c.short} · ${m.type.replace("Regular Scheduled Meeting", "Regular Meeting")}`} title={fmt(m.date, "long")} onClose={onClose}>
        <div className="d-kv">
          {m.time && <><span className="k">Time</span><span className="v">{m.time}</span></>}
          {m.modality && <><span className="k">Modality</span><span className="v">{m.modality}</span></>}
          {m.presidingOfficer && <><span className="k">Presiding</span><span className="v">{m.presidingOfficer}</span></>}
          <span className="k">Minutes</span><span className="v"><span className={"pill " + minutesPill(m.minutesStatus)}>{m.minutesStatus}</span></span>
          {isFiled(m) && <><span className="k">Attendance</span><span className="v">{(m.present || []).length} present · {(m.absent || []).length} absent{m.attendanceRate != null ? ` (${Math.round(m.attendanceRate * 100)}%)` : ""}</span></>}
        </div>

        {hasFile && (
          <div className="d-block">
            <a className="d-dl" href={`minutes/${fileName}`} target="_blank" rel="noopener" download={fileName}>
              <Icon d={ICONS.download} size={15} /> Download minutes (.docx)
            </a>
          </div>
        )}

        {isFiled(m) && (m.items || []).length > 0 && (
          <div className="d-block">
            <h4>Agenda — {(m.items || []).length} items</h4>
            {m.items.map((it, i) => {
              const cat = (it.category || "").toUpperCase();
              const cls = cat.includes("VOTING") ? "violet" : cat.includes("DISCUSS") ? "cyan" : cat.includes("REVIEW") ? "muted" : "muted";
              return (
                <div className="d-itemcard" key={i} style={{ borderLeftColor: c.color }}>
                  <div className="it-top">
                    {it.idx && <span className="t-mono" style={{ fontSize: 10, color: "var(--grey-7)" }}>§{it.idx}</span>}
                    {cat && <span className={"pill " + cls} style={{ fontSize: 10 }}>{cat}</span>}
                    {it.lcme && it.lcme.length > 0 && <span style={{ marginLeft: "auto" }}><LcmeChips ids={it.lcme} /></span>}
                  </div>
                  <div className="it-ttl">{it.title}</div>
                  {it.presenter && <div className="it-meta"><strong>Presenter:</strong> {it.presenter}</div>}
                  {it.outcome && <div className="it-meta">{it.outcome}</div>}
                </div>
              );
            })}
          </div>
        )}

        {!isFiled(m) && m.planned && (m.items || []).length > 0 && (
          <div className="d-block">
            <div style={{ fontSize: 11.5, color: "var(--brand-cyan-deep)", background: "var(--brand-cyan-tint)", padding: "8px 12px", borderRadius: 8, marginBottom: 10, lineHeight: 1.45 }}>
              Planned agenda from the Agenda Tracker — items, presenters, and guests may change before the meeting; minutes are filed afterward.
            </div>
            <h4>Planned agenda — {(m.items || []).length} items</h4>
            {m.items.map((it, i) => {
              const cat = (it.category || "").toUpperCase();
              const cls = cat.includes("VOTING") ? "violet" : cat.includes("DISCUSS") ? "cyan" : cat.includes("REVIEW") ? "muted" : "muted";
              return (
                <div className="d-itemcard" key={i} style={{ borderLeftColor: c.color }}>
                  <div className="it-top">
                    {it.n && <span className="t-mono" style={{ fontSize: 10, color: "var(--grey-7)" }}>§{it.n}</span>}
                    {cat && <span className={"pill " + cls} style={{ fontSize: 10 }}>{cat}</span>}
                    {it.ready && /YES/i.test(it.ready) && <span className="pill good" style={{ fontSize: 10, marginLeft: "auto" }}>READY</span>}
                  </div>
                  <div className="it-ttl">{it.title}</div>
                  {it.subitems && it.subitems.length > 0 && (
                    <ul style={{ margin: "7px 0 0", paddingLeft: 18 }}>
                      {it.subitems.map((s, j) => <li key={j} style={{ fontSize: 11.5, color: "var(--grey-11)", lineHeight: 1.5 }}>{s}</li>)}
                    </ul>
                  )}
                  {it.owner && <div className="it-meta"><strong>Subcommittee owner:</strong> {it.owner}</div>}
                  {it.presenter && <div className="it-meta"><strong>Presenter:</strong> {it.presenter}</div>}
                  {it.guests && <div className="it-meta"><strong>Guests:</strong> {it.guests}</div>}
                  {it.goesToEEC && <div className="it-meta"><strong>Feeds EEC:</strong> {fmt(it.goesToEEC, "mdy")}</div>}
                </div>
              );
            })}
          </div>
        )}

        {motions.length > 0 && (
          <div className="d-block">
            <h4>Motions — {motions.length}</h4>
            {motions.map((v) => (
              <div className="d-itemcard" key={v.id}>
                <div className="it-top"><span className={"pill " + resultPill(v.result)}>{v.result}</span>{v.lcme && v.lcme.length > 0 && <span style={{ marginLeft: "auto" }}><LcmeChips ids={v.lcme} /></span>}</div>
                <div className="it-ttl">{v.title}</div>
                {v.body && <div className="it-meta">{v.body}</div>}
              </div>
            ))}
          </div>
        )}

        {gov.length > 0 && (
          <div className="d-block">
            <h4>Governance action plans — {gov.length}</h4>
            {gov.map((a, i) => <ActionPlanMini key={i} a={a} accent="var(--brand-cyan)" />)}
          </div>
        )}
        {ops.length > 0 && (
          <div className="d-block">
            <h4>Operational action plans — {ops.length}</h4>
            {ops.map((a, i) => <ActionPlanMini key={i} a={a} accent="var(--good)" />)}
          </div>
        )}

        {m.topics && m.topics.length > 0 && (
          <div className="d-block">
            <h4>Topics</h4>
            <div className="d-chips">{m.topics.slice(0, 12).map((t, i) => <span key={i} className="pill muted" style={{ fontSize: 11 }}>{t}</span>)}</div>
          </div>
        )}
      </Drawer>
    );
  }

  function ActionPlanMini({ a, accent }) {
    return (
      <div className="d-itemcard" style={{ borderLeftColor: accent }}>
        <div className="it-ttl" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 12.5 }}>{a.description}</div>
        <div className="d-kv" style={{ margin: "8px 0 0", gridTemplateColumns: "110px 1fr", fontSize: 11.5 }}>
          {a.responsible && <><span className="k">Responsible</span><span className="v">{a.responsible}</span></>}
          {a.target && <><span className="k">Target</span><span className="v">{a.target}</span></>}
          {a.followUp && <><span className="k">Follow-up</span><span className="v">{a.followUp}</span></>}
          {a.lcme && a.lcme.length > 0 && <><span className="k">LCME</span><span className="v"><LcmeChips ids={a.lcme} /></span></>}
        </div>
      </div>
    );
  }

  // ════════════════ MEMBERS ════════════════
  function Members({ committee, setCommittee, onSelect }) {
    const e = E();
    const [trackedOnly, setTrackedOnly] = useState(false);
    const rows = useMemo(() => {
      let ms = e.MEMBERS.filter((m) => (m.seats && m.seats.length));
      if (committee !== "ALL") ms = ms.filter((m) => (m.seats || []).some((s) => s.committee === committee));
      if (trackedOnly) ms = ms.filter((m) => m.tracked);
      return ms.sort((a, b) => {
        const ap = /^tba|^not filled|— tba|tba$/i.test(a.name) ? 1 : 0;
        const bp = /^tba|^not filled|— tba|tba$/i.test(b.name) ? 1 : 0;
        if (ap !== bp) return ap - bp;
        return a.name.localeCompare(b.name);
      });
    }, [committee, trackedOnly]);
    const attLabel = committee === "ALL" ? "Attendance" : `${cmt(committee).short} attendance`;

    return (
      <>
        <div className="d-head"><h1>Members</h1><div className="lede">AY 2026–27 (v2.0) seat holders across all governance bodies. Voting status, committee seats, and attendance for the committees shown — counted fresh from {fmt(e.ATTENDANCE_START, "mdy")}. Open a member for their full seat record.</div></div>
        <CommitteeFilter value={committee} onChange={setCommittee} />
        <div className="d-toolbar">
          <label className="chk"><input type="checkbox" checked={trackedOnly} onChange={(ev) => setTrackedOnly(ev.target.checked)} /> Attendance-tracked only</label>
          <div className="spacer" />
          <span style={{ fontSize: 12, color: "var(--grey-11)" }} className="t-num">{rows.length} members</span>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft: 16 }}>Name</th><th>Role</th><th>Seats</th><th>Voting</th><th>{attLabel}</th></tr></thead>
            <tbody>
              {rows.map((m) => {
                const seatCmts = [...new Set((m.seats || []).map((s) => s.committee))];
                const votes = (m.seats || []).some((s) => s.vote);
                const att = e.memberAttendance(m.id, committee);
                const tot = att.total;
                const pct = tot ? Math.round(att.rate * 100) : null;
                return (
                  <tr key={m.id} className="row-link" onClick={() => onSelect({ type: "member", id: m.id })}>
                    <td style={{ paddingLeft: 16 }}><strong style={{ fontWeight: 600 }}>{m.name}</strong></td>
                    <td style={{ maxWidth: 280 }}><span className="sub">{m.role}</span></td>
                    <td><div className="d-chips">{seatCmts.length ? seatCmts.map((id) => <span key={id} className="d-chip" style={{ borderColor: cmt(id).color, color: cmt(id).deep }}>{cmt(id).short}</span>) : <span className="sub">—</span>}</div></td>
                    <td>{votes ? <span className="pill good">Voting</span> : <span className="pill muted">Non-voting</span>}</td>
                    <td style={{ minWidth: 150 }}>
                      {tot ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="bar-track" style={{ flex: 1 }}><div className="bar-fill good" style={{ width: pct + "%" }} /></div>
                          <span className="t-mono" style={{ fontSize: 11, color: "var(--grey-11)", minWidth: 64, textAlign: "right" }}>{att.present}/{tot} · {pct}%</span>
                        </div>
                      ) : <span className="sub">No record</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function MemberDrawer({ id, onClose, onSelect }) {
    const e = E();
    const m = e.memberById[id];
    if (!m) return null;
    const comms = e.committeesOf(id);
    const overall = e.memberAttendance(id, "ALL");
    const tot = overall.total;
    const pct = tot ? Math.round(overall.rate * 100) : null;
    const dual = (m.seats || []).length > 1;
    return (
      <Drawer eyebrow={m.tracked ? "Attendance-tracked member" : "Member"} title={m.name} onClose={onClose}>
        <div className="d-kv">
          <span className="k">Role</span><span className="v">{m.role || "—"}</span>
          {m.email && <><span className="k">Email</span><span className="v">{m.email}</span></>}
          {tot > 0 && <><span className="k">Attendance</span><span className="v">{overall.present} present · {overall.absent} absent ({pct}%) since {fmt(e.ATTENDANCE_START, "mdy")}</span></>}
        </div>

        <div className="d-block">
          <h4>Committee seats — {(m.seats || []).length}{dual ? " (dual-seat holder)" : ""}</h4>
          {(m.seats || []).length === 0 ? <div className="d-prose">No formal voting/non-voting seat on record (ex-officio, guest, or operations).</div> :
            (m.seats || []).map((s, i) => (
              <div className="d-itemcard" key={i} style={{ borderLeftColor: cmt(s.committee).color }}>
                <div className="it-top"><CDot id={s.committee} />{s.vote ? <span className="pill good" style={{ fontSize: 10 }}>Voting</span> : <span className="pill muted" style={{ fontSize: 10 }}>Non-voting</span>}{s.section && <span className="sub" style={{ marginLeft: "auto" }}>{s.section}</span>}</div>
                <div className="it-ttl" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 12.5 }}>{s.seat}</div>
                {(s.title || s.startYear) && <div className="it-meta">{s.title}{s.title && (s.startYear) ? " · " : ""}{s.startYear ? `${s.startYear}${s.renewYear ? " – renew " + s.renewYear : ""}` : ""}</div>}
              </div>
            ))}
        </div>

        {tot > 0 && (
          <div className="d-block">
            <h4>Attendance by committee — since {fmt(e.ATTENDANCE_START, "mdy")}</h4>
            <div className="d-kv" style={{ gridTemplateColumns: "120px 1fr" }}>
              {comms.map((cid) => {
                const a = e.memberAttendance(id, cid);
                if (!a.total) return null;
                const cp = Math.round(a.rate * 100);
                return (
                  <React.Fragment key={cid}>
                    <span className="k"><span className="d-chip" style={{ borderColor: cmt(cid).color, color: cmt(cid).deep }}>{cmt(cid).short}</span></span>
                    <span className="v" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="bar-track" style={{ flex: 1, maxWidth: 160 }}><div className="bar-fill good" style={{ width: cp + "%" }} /></div>
                      <span className="t-mono" style={{ fontSize: 11, color: "var(--grey-11)" }}>{a.present}/{a.total} · {cp}%</span>
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ marginTop: 12 }} className="d-kv">
              <span className="k" style={{ color: "var(--good)" }}>Present</span>
              <span className="v"><div className="d-chips">{overall.records.filter((r) => r.status === "present").map((r) => <span key={r.meetingId} className="d-chip" style={{ background: "var(--good-tint)", borderColor: "var(--good-tint)", color: "var(--good)" }}>{cmt(r.committee).short} {fmt(r.date, "md")}</span>)}</div></span>
              <span className="k" style={{ color: "var(--bad)" }}>Absent</span>
              <span className="v">{overall.records.some((r) => r.status === "absent") ? <div className="d-chips">{overall.records.filter((r) => r.status === "absent").map((r) => <span key={r.meetingId} className="d-chip" style={{ background: "var(--bad-tint)", borderColor: "var(--bad-tint)", color: "var(--bad)" }}>{cmt(r.committee).short} {fmt(r.date, "md")}</span>)}</div> : <span className="sub">None</span>}</span>
            </div>
          </div>
        )}
      </Drawer>
    );
  }

  // ════════════════ ATTENDANCE (committee-scoped heatmap) ════════════════
  function Attendance({ onSelect }) {
    const e = E();
    const [scope, setScope] = useState("EEC");
    const bundle = useMemo(() => e.committeeAttendance(scope), [scope]);
    const meetings = useMemo(() => [...bundle.meetings].sort((a, b) => a.date.localeCompare(b.date)), [bundle]);
    const members = useMemo(() => bundle.rows
      .filter((r) => r.total > 0)
      .map((r) => ({ ...r.member, _pct: r.rate, _att: r }))
      .sort((a, b) => b._pct - a._pct || a.name.localeCompare(b.name)), [bundle]);
    const c = scope !== "ALL" ? e.committeeById[scope] : null;
    const scopeLabel = c ? c.short : "all committees";

    return (
      <>
        <div className="d-head"><h1>Attendance</h1><div className="lede">Voting attendance for {scopeLabel}, counted fresh from {fmt(e.ATTENDANCE_START, "mdy")}. Toggle a committee below; click a member for their full record.</div></div>
        <CommitteeFilter value={scope} onChange={setScope} />
        {meetings.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--grey-7)" }}>
            No filed minutes for {scopeLabel} since {fmt(e.ATTENDANCE_START, "mdy")}. Attendance will populate here once minutes are filed.
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="card-header"><span className="card-title">{scopeLabel === "all committees" ? "Attendance rate by meeting" : c.short + " attendance rate by meeting"}</span><span className="card-meta">% of voting members present</span></div>
              <AttendanceTrend height={210} committee={scope} />
            </div>
            <div className="d-heatwrap">
              <table className="d-heat">
                <thead>
                  <tr>
                    <th className="namecol">Member ({members.length})</th>
                    {meetings.map((m) => <th key={m.id} className="dcol" title={`${cmt(m.committee).short} · ${fmt(m.date, "long")}`}>{D(m.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}</th>)}
                    <th className="dcol pctcol" style={{ position: "sticky", right: 0, background: "var(--paper)" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const pres = new Set();
                    const abs = new Set();
                    for (const r of m._att.records) (r.status === "present" ? pres : abs).add(r.meetingId);
                    const pct = Math.round(m._pct * 100);
                    return (
                      <tr key={m.id}>
                        <td className="namecol" style={{ cursor: "pointer" }} onClick={() => onSelect({ type: "member", id: m.id })}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                          <div className="sub" style={{ fontSize: 10.5 }}>{(m.role || "").slice(0, 42)}</div>
                        </td>
                        {meetings.map((mt) => {
                          const st = pres.has(mt.id) ? "p" : abs.has(mt.id) ? "a" : "-";
                          const bd = st === "a" ? "1px solid var(--bad)" : "none";
                          return <td key={mt.id} className="cell"><div className="box" style={{ background: st === "p" ? "var(--good)" : (st === "a" ? "var(--bad-tint)" : "var(--grey-1)"), border: bd, opacity: st === "-" ? 0.5 : 1 }} /></td>;
                        })}
                        <td className="pctcol" style={{ position: "sticky", right: 0, background: "var(--paper)", color: pct >= 70 ? "var(--good)" : pct >= 40 ? "var(--warn)" : "var(--bad)" }}>{pct}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="d-legend">
              <span className="it"><span className="sw" style={{ background: "var(--good)" }} /> Present</span>
              <span className="it"><span className="sw" style={{ background: "var(--bad-tint)", border: "1px solid var(--bad)" }} /> Absent</span>
              <span className="it"><span className="sw" style={{ background: "var(--grey-1)", opacity: 0.6 }} /> Not on roster / no record</span>
            </div>
          </>
        )}
      </>
    );
  }

  // ════════════════ MOTIONS ════════════════
  function Motions({ committee, setCommittee, onSelect }) {
    const e = E();
    const [result, setResult] = useState("ALL");
    const rows = useMemo(() => {
      let vs = e.MOTIONS.slice();
      if (committee !== "ALL") vs = vs.filter((v) => v.committee === committee);
      if (result !== "ALL") vs = vs.filter((v) => v.result === result);
      return vs.sort((a, b) => b.date.localeCompare(a.date));
    }, [committee, result]);
    const results = [...new Set(e.MOTIONS.map((v) => v.result))];

    return (
      <>
        <div className="d-head"><h1>Motions & Votes</h1><div className="lede">Every motion put to the committees, its disposition, and the LCME elements it touches.</div></div>
        <CommitteeFilter value={committee} onChange={setCommittee} />
        <div className="d-toolbar">
          <label style={{ fontSize: 12, color: "var(--grey-11)" }}>Result&nbsp;
            <select className="d-select" value={result} onChange={(ev) => setResult(ev.target.value)}>
              <option value="ALL">All</option>
              {results.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <div className="spacer" /><span className="t-num" style={{ fontSize: 12, color: "var(--grey-11)" }}>{rows.length} motions</span>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft: 16 }}>Date</th><th>Committee</th><th>Motion</th><th>Result</th><th>LCME</th></tr></thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="row-link" onClick={() => onSelect({ type: "meeting", id: v.meetingId })}>
                  <td style={{ paddingLeft: 16, whiteSpace: "nowrap" }} className="mono">{fmt(v.date, "mdy")}</td>
                  <td><CDot id={v.committee} /></td>
                  <td style={{ maxWidth: 460 }}>{v.title}</td>
                  <td><span className={"pill " + resultPill(v.result)}>{v.result}</span></td>
                  <td><LcmeChips ids={v.lcme} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ════════════════ ACTION PLANS ════════════════
  function Actions({ committee, setCommittee, onSelect }) {
    const e = E();
    const [source, setSource] = useState("tracker");
    const [status, setStatus] = useState("ALL");
    const rows = useMemo(() => {
      let as = e.ACTIONS.slice();
      if (source === "tracker") as = as.filter((a) => a.kind === "tracker");
      else if (source === "meeting") as = as.filter((a) => a.kind !== "tracker");
      if (committee !== "ALL") as = as.filter((a) => a.committee === committee);
      if (status !== "ALL") as = as.filter((a) => a.status === status);
      return as;
    }, [source, committee, status]);

    return (
      <>
        <div className="d-head"><h1>Action Plans</h1><div className="lede">The CQI action-plan tracker (curriculum review findings) plus operational and CQI items captured from meeting appendices.</div></div>
        <CommitteeFilter value={committee} onChange={setCommittee} />
        <div className="d-toolbar">
          <div className="d-seg" style={{ margin: 0 }}>
            {[["tracker", "CQI tracker"], ["meeting", "From meetings"], ["all", "All"]].map(([k, l]) => (
              <button key={k} className={source === k ? "active" : ""} onClick={() => setSource(k)}>{l}</button>
            ))}
          </div>
          <label style={{ fontSize: 12, color: "var(--grey-11)" }}>Status&nbsp;
            <select className="d-select" value={status} onChange={(ev) => setStatus(ev.target.value)}>
              <option value="ALL">All</option><option>Not Started</option><option>In Progress</option><option>Completed</option>
            </select>
          </label>
          <div className="spacer" /><span className="t-num" style={{ fontSize: 12, color: "var(--grey-11)" }}>{rows.length} items</span>
        </div>
        <StatusByDomain rows={rows} />
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft: 16 }}>ID</th><th>Action</th><th>Domain</th><th>Committee</th><th>Status</th><th style={{ minWidth: 120 }}>Progress</th><th>Target</th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="row-link" onClick={() => onSelect({ type: "action", id: a.id })}>
                  <td style={{ paddingLeft: 16 }} className="mono" >{a.id}</td>
                  <td style={{ maxWidth: 380 }}>{a.title}</td>
                  <td><span className="sub">{a.domain}</span></td>
                  <td><CDot id={a.committee} /></td>
                  <td><span className={"pill " + statusPill(a.status)}>{a.status}</span></td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="bar-track" style={{ flex: 1 }}><div className={"bar-fill " + (a.percent >= 100 ? "good" : "")} style={{ width: (a.percent || 0) + "%" }} /></div><span className="t-mono" style={{ fontSize: 11, color: "var(--grey-11)" }}>{a.percent || 0}%</span></div></td>
                  <td style={{ whiteSpace: "nowrap" }}><span className="sub">{a.target || "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function ActionDrawer({ id, onClose }) {
    const e = E();
    const a = e.actionById[id];
    if (!a) return null;
    const fields = [
      ["Domain", a.domain], ["Committee", cmt(a.committee).name], ["Owner", a.ownerLabel || "—"],
      ["Stakeholders", a.stakeholders], ["Opened", a.openedDate ? fmt(a.openedDate, "mdy") : null],
      ["Target", a.target], ["Due", a.dueDate ? fmt(a.dueDate, "mdy") : null], ["Follow-up", a.followUp],
    ].filter(([, v]) => v);
    const prose = [["Baseline", a.baseline], ["Target metric", a.targetMetric], ["Intervention", a.intervention], ["Follow-up items", a.followUpItems], ["Evidence of closure", a.evidence], ["Notes", a.notes]].filter(([, v]) => v);
    return (
      <Drawer eyebrow={`${a.id} · ${a.kind === "tracker" ? "CQI tracker" : a.kind} · ${a.status}`} title={a.title} onClose={onClose}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span className={"pill " + statusPill(a.status)}>{a.status}</span>
          <div className="bar-track" style={{ flex: 1 }}><div className={"bar-fill " + (a.percent >= 100 ? "good" : "")} style={{ width: (a.percent || 0) + "%" }} /></div>
          <span className="t-mono" style={{ fontSize: 12, color: "var(--grey-11)" }}>{a.percent || 0}%</span>
        </div>
        {a.description && a.description !== a.title && <div className="d-prose" style={{ marginBottom: 16 }}>{a.description}</div>}
        <div className="d-kv">{fields.map(([k, v]) => <React.Fragment key={k}><span className="k">{k}</span><span className="v">{v}</span></React.Fragment>)}</div>
        {(a.lcme && a.lcme.length || a.mepos && a.mepos.length) ? (
          <div className="d-block">
            {a.lcme && a.lcme.length > 0 && <><h4>LCME elements</h4><LcmeChips ids={a.lcme} /></>}
            {a.mepos && a.mepos.length > 0 && <div style={{ marginTop: 10 }}><h4>MEPOs</h4><div className="d-chips">{a.mepos.map((x, i) => <span key={i} className="d-chip">{x}</span>)}</div></div>}
          </div>
        ) : null}
        {prose.map(([k, v]) => <div className="d-block" key={k}><h4>{k}</h4><div className="d-prose">{v}</div></div>)}
      </Drawer>
    );
  }

  // ════════════════ REVIEWS ════════════════
  function Reviews({ onSelect }) {
    const e = E();
    return (
      <>
        <div className="d-head"><h1>Curriculum Reviews</h1><div className="lede">Phase and full-curriculum reviews that anchor the CQI action-plan tracker.</div></div>
        <div className="d-cards">
          {e.REVIEWS.map((r) => (
            <div className="card d-cc" key={r.id} onClick={() => onSelect({ type: "review", id: r.id })}>
              <span className="stripe" style={{ background: "var(--brand-violet)" }} />
              <div className="t-eyebrow" style={{ marginTop: 4 }}>{fmt(r.date, "mdy")}</div>
              <div className="it-ttl" style={{ fontFamily: "var(--serif)", fontSize: 15, margin: "6px 0" }}>{r.title}</div>
              <div className="nm" style={{ minHeight: 0 }}>{r.presenter}</div>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--brand-cyan-deep)", fontWeight: 600 }}>Open review →</div>
            </div>
          ))}
        </div>
      </>
    );
  }
  function ReviewDrawer({ id, onClose }) {
    const e = E();
    const r = e.reviewById[id];
    if (!r) return null;
    return (
      <Drawer eyebrow={fmt(r.date, "long")} title={r.title} onClose={onClose}>
        <div className="d-kv"><span className="k">Presenter</span><span className="v">{r.presenter}</span></div>
        {r.file && <div className="d-block"><a className="d-dl" href={r.file} target="_blank" rel="noopener"><Icon d={ICONS.download} size={15} /> Download review</a></div>}
        {r.summary && <div className="d-block"><h4>Summary</h4><div className="d-prose">{r.summary}</div></div>}
        {(r.sections || []).map((s, i) => (
          <div className="d-block" key={i}><h4>{s.heading || ("Section " + (i + 1))}</h4><div className="d-prose">{s.body}</div></div>
        ))}
      </Drawer>
    );
  }

  // ════════════════ POLICIES ════════════════
  function Policies({ onSelect }) {
    const e = E();
    const rows = [...e.POLICIES].sort((a, b) => (b.effectiveDate || "").localeCompare(a.effectiveDate || ""));
    return (
      <>
        <div className="d-head"><h1>Policies</h1><div className="lede">Governed documents with current versions, approval lineage, and source meetings.</div></div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft: 16 }}>Policy</th><th>Version</th><th>Effective</th><th>Status</th><th>Next review</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="row-link" onClick={() => onSelect({ type: "policy", id: p.id })}>
                  <td style={{ paddingLeft: 16, maxWidth: 380 }}><strong style={{ fontWeight: 600 }}>{p.title}</strong><div className="sub">{p.owner}</div></td>
                  <td className="mono">v{p.version}</td>
                  <td className="mono">{p.effectiveDate ? fmt(p.effectiveDate, "mdy") : "—"}</td>
                  <td><span className={"pill " + (p.status && p.status.toLowerCase().includes("pending") ? "warn" : "good")}>{p.status}</span></td>
                  <td><span className="sub">{p.nextReview || "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  function PolicyDrawer({ id, onClose, onSelect }) {
    const e = E();
    const p = e.policyById[id];
    if (!p) return null;
    return (
      <Drawer eyebrow={`v${p.version} · ${p.owner}`} title={p.title} onClose={onClose}>
        <div className="d-kv">
          <span className="k">Status</span><span className="v"><span className={"pill " + (p.status && p.status.toLowerCase().includes("pending") ? "warn" : "good")}>{p.status}</span></span>
          {p.effectiveDate && <><span className="k">Effective</span><span className="v">{fmt(p.effectiveDate, "long")}</span></>}
          {p.approvedBy && <><span className="k">Approved by</span><span className="v">{p.approvedBy}</span></>}
          {p.nextReview && <><span className="k">Next review</span><span className="v">{p.nextReview}</span></>}
        </div>
        {p.fileUrl && <div className="d-block"><a className="d-dl" href={p.fileUrl} target="_blank" rel="noopener"><Icon d={ICONS.download} size={15} /> Download policy</a></div>}
        {p.summary && <div className="d-block"><h4>Summary</h4><div className="d-prose">{p.summary}</div></div>}
        {p.lcme && p.lcme.length > 0 && <div className="d-block"><h4>LCME elements</h4><LcmeChips ids={p.lcme} /></div>}
        {(p.sections || []).length > 0 && (
          <div className="d-block"><h4>Sections</h4>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.7, color: "var(--ink-2)" }}>
              {p.sections.map((s, i) => <li key={i}>{typeof s === "string" ? s : (s.heading || JSON.stringify(s))}</li>)}
            </ol>
          </div>
        )}
        {(p.revisionHistory || []).length > 0 && (
          <div className="d-block"><h4>Revision history</h4>
            {p.revisionHistory.map((r, i) => (
              <div className="d-itemcard" key={i}>
                <div className="it-top"><span className="t-mono" style={{ fontSize: 11, fontWeight: 600 }}>v{r.version}</span><span className="sub">{r.date} · {r.approver}</span></div>
                <div className="it-meta" style={{ marginTop: 2 }}>{r.summary}</div>
              </div>
            ))}
          </div>
        )}
        {(p.sourceMeetingIds || []).length > 0 && (
          <div className="d-block"><h4>Source meetings</h4>
            <div className="d-chips">{p.sourceMeetingIds.map((mid) => { const m = e.meetingById[mid]; return m ? <span key={mid} className="pill cyan" style={{ cursor: "pointer", fontSize: 11 }} onClick={() => onSelect({ type: "meeting", id: mid })}>{fmt(m.date, "mdy")}</span> : null; })}</div>
          </div>
        )}
      </Drawer>
    );
  }

  // ── App shell ───────────────────────────────────────────────────────────────
  function DesktopApp() {
    const [section, setSection] = useState("overview");
    const [committee, setCommittee] = useState("ALL");
    const [selected, setSelected] = useState(null);
    const mainRef = useRef(null);

    useEffect(() => {
      if (document.getElementById("__d_css")) return;
      const s = document.createElement("style"); s.id = "__d_css"; s.textContent = DESKTOP_CSS; document.head.appendChild(s);
    }, []);

    const e = E();
    const badges = {
      meetings: e.MEETINGS.filter(isFiled).length,
      motions: e.MOTIONS.length,
      actions: e.ACTIONS.filter((a) => a.status !== "Completed").length,
      members: e.MEMBERS.filter((m) => m.tracked).length,
      policies: e.POLICIES.length,
      reviews: e.REVIEWS.length,
    };

    const nav = useCallback((key, cmtFilter) => {
      setSection(key);
      if (cmtFilter) setCommittee(cmtFilter);
      setSelected(null);
      if (mainRef.current) mainRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }, []);
    const onSelect = useCallback((s) => setSelected(s), []);
    const closeDrawer = useCallback(() => setSelected(null), []);

    const lastSync = e.TODAY instanceof Date ? e.TODAY : new Date(e.TODAY);
    const crumbLabel = NAV.flatMap((g) => g.items).find(([k]) => k === section)?.[1] || "Dashboard";

    return (
      <div className="d-app">
        <header className="topbar">
          <div className="logo"><span className="dot" /> ASCEND Governance</div>
          <div className="crumbs"><span>Curricular Affairs</span><span className="sep">/</span><span className="cur">{crumbLabel}</span></div>
          <div className="spacer" />
          <div className="ay"><span className="pill-ay">AY 2025–26</span><span>Last sync · {lastSync.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
        </header>

        <div className="d-body">
          <Sidebar section={section} onNav={nav} badges={badges} />
          <main className="d-main" ref={mainRef}>
            {section === "overview" && <Overview onNav={nav} onSelect={onSelect} />}
            {section === "meetings" && <Meetings committee={committee} setCommittee={setCommittee} onSelect={onSelect} />}
            {section === "members" && <Members committee={committee} setCommittee={setCommittee} onSelect={onSelect} />}
            {section === "attendance" && <Attendance onSelect={onSelect} />}
            {section === "motions" && <Motions committee={committee} setCommittee={setCommittee} onSelect={onSelect} />}
            {section === "actions" && <Actions committee={committee} setCommittee={setCommittee} onSelect={onSelect} />}
            {section === "reviews" && <Reviews onSelect={onSelect} />}
            {section === "policies" && <Policies onSelect={onSelect} />}
          </main>
        </div>

        {selected && selected.type === "meeting" && <MeetingDrawer id={selected.id} onClose={closeDrawer} onSelect={onSelect} />}
        {selected && selected.type === "member" && <MemberDrawer id={selected.id} onClose={closeDrawer} onSelect={onSelect} />}
        {selected && selected.type === "action" && <ActionDrawer id={selected.id} onClose={closeDrawer} />}
        {selected && selected.type === "review" && <ReviewDrawer id={selected.id} onClose={closeDrawer} />}
        {selected && selected.type === "policy" && <PolicyDrawer id={selected.id} onClose={closeDrawer} onSelect={onSelect} />}
      </div>
    );
  }

  window.DesktopApp = DesktopApp;
})();
