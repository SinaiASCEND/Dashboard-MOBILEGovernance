// membership-attendance.jsx — Membership listing + 3-tab Attendance checker.
// Loads AFTER mobile-sections.jsx. Augments window.MobileSections.

const { useState: useStateMM, useMemo: useMemoMM, useEffect: useEffectMM, useRef: useRefMM } = React;

// ─── Local CSS (mounted once on first render) ─────────────────────────────
const MM_CSS = `
/* AY toggle row */
.m-ay-row {
  display: flex; gap: 6px; align-items: center;
  background: var(--paper);
  border-radius: 10px; padding: 4px;
  margin: 0 0 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-ay-row .lbl {
  font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--grey-7); font-weight: 700;
  padding: 0 8px 0 10px;
  border-right: 1px solid var(--grey-2);
  margin-right: 4px; line-height: 1.6;
}
.m-ay-row button {
  flex: 1; border: 0; background: transparent;
  font-family: var(--sans); font-size: 11.5px; font-weight: 600;
  color: var(--grey-11);
  padding: 7px 6px; border-radius: 7px;
  cursor: pointer;
}
.m-ay-row button.active {
  background: var(--brand-violet); color: #fff;
  box-shadow: 0 1px 3px rgba(34,31,114,0.25);
}

.m-vote {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9.5px; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 1px 6px; border-radius: 4px;
  font-weight: 700;
}
.m-vote.voting    { background: var(--good-tint);    color: var(--good); }
.m-vote.nonvoting { background: var(--grey-2);       color: var(--grey-11); }

/* Membership row */
.m-mem-row {
  display: grid; grid-template-columns: 1fr auto; gap: 8px;
  padding: 11px 14px;
  background: var(--paper);
  border-bottom: 1px solid var(--grey-2);
  cursor: pointer;
  border-left: 0; border-right: 0; border-top: 0;
  text-align: left; width: 100%;
}
.m-mem-row:active { background: var(--grey-1); }
.m-mem-row .name {
  font-family: var(--serif); font-size: 14px; font-weight: 600;
  color: var(--ink); line-height: 1.25;
  letter-spacing: -0.005em;
}
.m-mem-row .role {
  font-size: 11.5px; color: var(--grey-11);
  margin-top: 2px; line-height: 1.4;
}
.m-mem-row .row1 {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  margin-top: 6px;
}
.m-mem-row .row2 {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  margin-top: 6px;
  font-size: 11px; color: var(--grey-11);
}
.m-mem-row .ico-btn {
  width: 30px; height: 30px; border-radius: 8px;
  display: grid; place-items: center;
  background: var(--grey-1); color: var(--grey-11);
  border: 0; cursor: pointer;
  flex: 0 0 30px;
}
.m-mem-row .ico-btn.att { background: var(--brand-violet-tint); color: var(--brand-violet); }
.m-mem-row .ico-btn.mail { background: var(--brand-cyan-tint);  color: var(--brand-cyan-deep); }
.m-mem-row .right-col {
  display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
}
.m-mem-row .att-pct {
  font-family: var(--mono); font-weight: 700; font-size: 13px;
  font-variant-numeric: tabular-nums;
}

/* "Section header" row when grouping in ALL view */
.m-group-head {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 4px 6px;
}
.m-group-head .stripe {
  width: 10px; height: 10px; border-radius: 2px;
}
.m-group-head .ttl {
  font-family: var(--serif); font-size: 13px; font-weight: 700;
  letter-spacing: -0.005em;
}
.m-group-head .count {
  font-family: var(--mono); font-size: 11px; color: var(--grey-7);
  font-weight: 600; font-variant-numeric: tabular-nums;
  margin-left: auto;
}

/* Big primary action button (e.g. Check EEC Attendance) */
.m-cta-btn {
  display: flex; align-items: center; gap: 12px;
  width: 100%; border: 0;
  background: var(--brand-violet); color: #fff;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 4px 12px -6px rgba(34,31,114,0.5);
}
.m-cta-btn .icon {
  width: 36px; height: 36px; border-radius: 9px;
  background: rgba(255,255,255,0.16);
  display: grid; place-items: center;
}
.m-cta-btn .ttl {
  font-family: var(--serif); font-size: 14.5px; font-weight: 600;
  letter-spacing: -0.005em; line-height: 1.2;
}
.m-cta-btn .sub {
  font-size: 11px; opacity: 0.82; margin-top: 2px; line-height: 1.4;
}

/* Tabs */
.m-tabs {
  display: flex; gap: 4px;
  background: var(--grey-1);
  border-radius: 10px;
  padding: 3px;
  margin: 4px 0 10px;
}
.m-tabs button {
  flex: 1; border: 0; background: transparent;
  font-family: var(--sans); font-size: 12px; font-weight: 600;
  color: var(--grey-11);
  padding: 8px 6px; border-radius: 7px;
  cursor: pointer; letter-spacing: -0.005em;
}
.m-tabs button.active {
  background: var(--paper); color: var(--ink);
  box-shadow: 0 1px 3px rgba(20,20,20,0.10), 0 0 0 1px rgba(20,20,20,0.05);
}

/* Toolbar (Print + CSV) */
.m-toolbar {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin: 0 0 10px;
}
.m-tool-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--paper); color: var(--ink);
  border: 0;
  font-family: var(--sans); font-size: 12px; font-weight: 600;
  padding: 7px 11px; border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
}
.m-tool-btn svg { stroke-width: 2; }

/* Attendance grid (members × meetings) */
.m-grid-wrap {
  background: var(--paper); border-radius: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  overflow: hidden;
}
.m-grid-scroll {
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  max-height: 440px; overflow-y: auto;
}
.m-grid {
  border-collapse: separate; border-spacing: 0;
  font-size: 11px;
}
.m-grid th, .m-grid td {
  padding: 6px 4px;
  border-bottom: 1px solid var(--grey-2);
  border-right: 1px solid var(--grey-2);
  text-align: center;
  white-space: nowrap;
  background: var(--paper);
  font-variant-numeric: tabular-nums;
}
.m-grid th {
  position: sticky; top: 0; z-index: 2;
  font-weight: 600; color: var(--grey-11);
  background: var(--grey-1);
}
.m-grid td.name, .m-grid th.name {
  position: sticky; left: 0; z-index: 3;
  text-align: left;
  padding: 6px 10px;
  min-width: 130px; max-width: 150px;
  font-weight: 500; color: var(--ink-2);
  font-family: var(--sans);
  white-space: normal; line-height: 1.25;
  border-right: 1px solid var(--grey-3);
}
.m-grid th.name { background: var(--grey-2); z-index: 4; }
.m-grid td.cell-p { background: var(--good-tint); color: var(--good); font-weight: 700; }
.m-grid td.cell-a { background: var(--bad-tint);  color: var(--bad);  font-weight: 700; }
.m-grid td.cell-blank { color: var(--grey-5); }
.m-grid td.summary { font-weight: 700; color: var(--ink); }
.m-grid .pct { font-family: var(--mono); font-weight: 700; }

/* By-member detail (when a row is expanded / focused) */
.m-mem-att-card {
  background: var(--paper); border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(20,20,20,0.04), 0 0 0 1px rgba(20,20,20,0.06);
  border-left: 3px solid var(--brand-violet);
}
.m-mem-att-card .name {
  font-family: var(--serif); font-size: 16px; font-weight: 600;
  letter-spacing: -0.01em;
}
.m-mem-att-card .role {
  font-size: 11.5px; color: var(--grey-11); margin-top: 2px;
}
.m-mem-att-card .rate-line {
  display: flex; align-items: baseline; gap: 8px;
  margin: 10px 0 6px;
}
.m-mem-att-card .rate-line .big {
  font-family: var(--serif); font-size: 26px; font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.m-mem-att-card .rate-line .small {
  font-size: 11px; color: var(--grey-11);
}
.m-mem-att-card .mtg-list {
  margin-top: 8px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  font-size: 11.5px;
}
.m-mem-att-card .mtg-pill {
  display: flex; align-items: center; gap: 5px;
  font-variant-numeric: tabular-nums;
}
.m-mem-att-card .mtg-pill .dot {
  width: 7px; height: 7px; border-radius: 50%;
}
.m-mem-att-card .mtg-pill.p .dot { background: var(--good); }
.m-mem-att-card .mtg-pill.a .dot { background: var(--bad); }
`;

function ensureMMCss() {
  if (document.getElementById("__mm_css")) return;
  const s = document.createElement("style");
  s.id = "__mm_css";
  s.textContent = MM_CSS;
  document.head.appendChild(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function shortNameMM(name) {
  if (!name) return "—";
  return name.split(",")[0].trim();
}
function fmtDMM(s, style = "medium") {
  if (!s) return "—";
  const d = window.MS_DATE.parseLocal(s);
  if (style === "short")  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
  if (style === "medium") return d.toLocaleDateString("en-US", { month: "short",   day: "numeric", year: "numeric" });
  if (style === "long")   return d.toLocaleDateString("en-US", { weekday: "long",  month: "long",  day: "numeric", year: "numeric" });
  return d.toLocaleDateString();
}

// ─── AY toggle component ────────────────────────────────────────────────
function AYToggle({ value, onChange }) {
  const R = window.ROSTERS;
  if (!R) return null;
  // If there's only one academic year to choose from, render a compact
  // read-only label instead of a toggle (no value to switch to).
  if (R.AY_KEYS.length <= 1) {
    return (
      <div className="m-ay-row" style={{ justifyContent: "flex-start" }}>
        <span className="lbl">AY</span>
        <span style={{
          fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600,
          color: "var(--ink)", padding: "5px 10px",
        }}>
          {R.AY_KEYS[0] || ""}
        </span>
      </div>
    );
  }
  return (
    <div className="m-ay-row">
      <span className="lbl">AY</span>
      {R.AY_KEYS.map(k => (
        <button key={k} className={value === k ? "active" : ""} onClick={() => onChange(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

function csvCell(v) {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Open a printable popup window with clean styles.
function openPrintWindow(title, bodyHtml) {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) { alert("Pop-up was blocked — please allow pop-ups to print."); return; }
  w.document.write(`<!doctype html>
<html><head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: "Inter Tight", -apple-system, system-ui, sans-serif;
    color: #1a1d22; margin: 0; padding: 32px;
    font-size: 12px; line-height: 1.45;
  }
  h1 { font-family: "Source Serif 4", Georgia, serif; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 4px; }
  h2 { font-family: "Source Serif 4", Georgia, serif; font-size: 15px; font-weight: 600; margin: 22px 0 8px; }
  .meta { color: #5a6373; font-size: 11px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { padding: 6px 8px; border: 1px solid #d8dde5; text-align: left; vertical-align: top; }
  th { background: #f1f3f6; font-weight: 600; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: ui-monospace, Menlo, monospace; }
  td.p { background: #e1f3e6; color: #176D3B; text-align: center; font-weight: 700; }
  td.a { background: #fbe2e2; color: #b3261e; text-align: center; font-weight: 700; }
  td.blank { color: #9aa0a8; text-align: center; }
  .legend { display: flex; gap: 14px; font-size: 11px; margin: 10px 0 16px; color: #5a6373; }
  .legend span { display: inline-flex; align-items: center; gap: 4px; }
  .legend .sw { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
  .foot { margin-top: 24px; font-size: 10px; color: #7a8290; border-top: 1px solid #d8dde5; padding-top: 10px; }
  @media print {
    body { padding: 20px; }
    h1 { font-size: 18px; }
    table { font-size: 10px; }
    th, td { padding: 4px 6px; }
  }
</style>
</head><body>${bodyHtml}<div class="foot">Generated ${new Date().toLocaleString("en-US")} · ASCEND Governance Dashboard</div></body></html>`);
  w.document.close();
  // give the browser a tick to layout fonts/styles
  setTimeout(() => { w.focus(); w.print(); }, 250);
}

// ─── MEMBERSHIP LISTING ────────────────────────────────────────────────────
function MembershipScreen({ onItem, onSection }) {
  ensureMMCss();
  const COMMITTEES = ["EEC", "PCCS", "CCS", "CIS"];
  const R = window.ROSTERS;
  const [committee, setCommittee] = useStateMM("EEC");
  const [q, setQ] = useStateMM("");
  const [ay, setAy] = useStateMM(R ? R.CURRENT_AY : "2025-26");

  // Build the data, with attendance rates scoped to the selected AY.
  function withAyStats(rows) {
    return rows.map(r => {
      if (r.committee !== "EEC" || !R) return r;
      const st = R.ayStatsFor(r.id, ay);
      return { ...r, attendanceRate: st.rate, presentCount: st.presentCount, absentCount: st.absentCount };
    });
  }

  const data = useMemoMM(() => {
    if (!R) return [];
    if (committee === "ALL") {
      return COMMITTEES.map(cid => ({
        committee: cid,
        c: window.EEC.committeeById[cid],
        rows: withAyStats(R.rosterFor(cid, { ay })),
      }));
    }
    return [{
      committee,
      c: window.EEC.committeeById[committee],
      rows: withAyStats(R.rosterFor(committee, { ay })),
    }];
  }, [committee, ay]);

  const Q = q.trim().toLowerCase();
  const filtered = useMemoMM(() => {
    if (!Q) return data;
    return data.map(g => ({
      ...g,
      rows: g.rows.filter(r =>
        r.name.toLowerCase().includes(Q) ||
        (r.title || "").toLowerCase().includes(Q) ||
        (r.seat || "").toLowerCase().includes(Q)),
    })).filter(g => g.rows.length > 0);
  }, [data, Q]);

  const totalCount = filtered.reduce((s, g) => s + g.rows.length, 0);

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">Governance bodies · AY 2025–26</div>
        <h2>Membership</h2>
        <div style={{ fontSize: 12, color: "var(--grey-11)", marginTop: 6, lineHeight: 1.45 }}>
          Members of the EEC and its subcommittees. Filter by committee, tap a row for detail, or jump to the attendance checker.
        </div>
      </div>

      {/* CTA: Check EEC Attendance */}
      <button className="m-cta-btn" onClick={() => onSection("attendance", null, { ay })} style={{ marginBottom: 12 }}>
        <span className="icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>
            <path d="m9 15 2 2 4-4"/>
          </svg>
        </span>
        <span style={{ flex: 1 }}>
          <div className="ttl">Check EEC Attendance</div>
          <div className="sub">Per-meeting · per-member · grid view · printable</div>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
      </button>

      <AYToggle value={ay} onChange={setAy} />

      {/* Search */}
      <div className="m-search">
        <span className="ic">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, title, or seat…" />
      </div>

      {/* Filter chips */}
      <div className="m-chiprow">
        <button className={"m-chip" + (committee === "ALL" ? " active" : "")} onClick={() => setCommittee("ALL")}>
          All
        </button>
        {COMMITTEES.map(cid => {
          const c = window.EEC.committeeById[cid];
          const active = committee === cid;
          return (
            <button key={cid} className={"m-chip" + (active ? " active" : "")}
                    onClick={() => setCommittee(cid)}
                    style={active ? { background: c.deep, borderColor: c.deep, color: "#fff" } : null}>
              {c.short}
              <span className="count">{window.ROSTERS ? window.ROSTERS.rosterFor(cid, { ay }).length : 0}</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 10.5, color: "var(--grey-7)", padding: "2px 4px 8px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
        {totalCount} member{totalCount === 1 ? "" : "s"}
      </div>

      {filtered.length === 0 && (
        <div className="m-empty"><h3>No members match</h3><p>Try a different search or filter.</p></div>
      )}

      {filtered.map(group => (
        <div key={group.committee}>
          {committee === "ALL" && (
            <div className="m-group-head">
              <span className="stripe" style={{ background: group.c.color }}></span>
              <span className="ttl" style={{ color: group.c.deep }}>{group.c.short}</span>
              <span style={{ fontSize: 11.5, color: "var(--grey-11)" }}>{group.c.name}</span>
              <span className="count">{group.rows.length}</span>
            </div>
          )}
          <div className="m-card" style={{ marginBottom: 12, padding: 0 }}>
            {group.rows.map(r => (
              <MembershipRow key={group.committee + ":" + r.id}
                             r={r}
                             onOpen={() => onItem("member", r.id)}
                             onAttendance={r.committee === "EEC" ? (() => onSection("attendance", r.id, { ay })) : null} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MembershipRow({ r, onOpen, onAttendance }) {
  const E = window.EEC;
  const fullMember = E.memberById[r.id];
  const allSeats = (fullMember?.seats || []).filter(s => ["EEC","PCCS","CCS","CIS"].includes(s.committee));
  const isEEC = r.committee === "EEC";

  return (
    <div className="m-mem-row" onClick={onOpen} role="button" tabIndex={0}>
      <div style={{ minWidth: 0 }}>
        <div className="name">{shortNameMM(r.name)}</div>
        {r.title && <div className="role">{r.title}</div>}
        <div className="row1">
          {allSeats.map((s, i) => {
            const c = E.committeeById[s.committee];
            return (
              <span key={i} className="m-cchip" style={{ background: c.tint, color: c.deep }}>
                <span className="dot" style={{ background: c.color }}></span>
                {c.short}
                {!s.vote && (
                  <span style={{ fontSize: 8.5, marginLeft: 3, opacity: 0.7 }}>·NV</span>
                )}
              </span>
            );
          })}
          <span className={"m-vote " + (r.voting ? "voting" : "nonvoting")}>
            {r.voting ? "Voting" : "Non-voting"}
          </span>
        </div>
        {(r.email || r.start) && (
          <div className="row2">
            {r.email && (
              <a href={`mailto:${r.email}`} onClick={e => e.stopPropagation()}
                 style={{ color: "var(--brand-cyan-deep)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--mono)", fontSize: 10.5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                {r.email}
              </a>
            )}
            {r.start && (
              <span style={{ color: "var(--grey-7)" }}>
                Term {r.start}{r.renew ? ` → ${r.renew}` : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="right-col">
        {isEEC && r.attendanceRate != null && (
          <span className="att-pct" style={{
            color: r.attendanceRate >= 75 ? "var(--good)" :
                   r.attendanceRate >= 60 ? "var(--warn)" : "var(--bad)",
          }}>
            {r.attendanceRate}%
          </span>
        )}
        {isEEC && r.attendanceRate == null && (r.presentCount + r.absentCount === 0) && (
          <span style={{ fontSize: 9.5, color: "var(--grey-7)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            no data
          </span>
        )}
        <div style={{ display: "flex", gap: 4 }}>
          {onAttendance && (
            <button className="ico-btn att" title="Check attendance"
                    onClick={e => { e.stopPropagation(); onAttendance(); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>
                <path d="m9 15 2 2 4-4"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EEC ATTENDANCE — 3 tabs ──────────────────────────────────────────────
function AttendanceScreenV2({ focusMemberId, ay: initialAy, onTake }) {
  ensureMMCss();
  const R = window.ROSTERS;
  const [tab, setTab] = useStateMM(focusMemberId ? "member" : "meeting");
  const [ay, setAy] = useStateMM(initialAy || (R ? R.CURRENT_AY : "2025-26"));
  const focusedRowRef = useRefMM(null);

  // EEC meetings filtered to the selected AY (oldest → newest for grid header)
  const meetings = useMemoMM(() => {
    if (!R) return [];
    return R.meetingsInAY("EEC", ay)
      .sort((a, b) => window.MS_DATE.parseLocal(a.date) - window.MS_DATE.parseLocal(b.date));
  }, [ay]);
  const meetingsDesc = useMemoMM(() => [...meetings].reverse(), [meetings]);

  // Roster: current EEC roster members for the selected AY, sorted by surname.
  const rosterRows = useMemoMM(() => R ? R.rosterFor("EEC", { ay }) : [], [ay]);

  // Per-member attendance for the selected AY.
  const memberAtt = useMemoMM(() => {
    return rosterRows.map(r => {
      const st = R ? R.ayStatsFor(r.id, ay) : { presentCount: 0, absentCount: 0, total: 0, rate: null, meetingsPresent: [], meetingsAbsent: [] };
      const cells = meetings.map(m => {
        if (st.meetingsPresent.includes(m.date)) return "p";
        if (st.meetingsAbsent.includes(m.date))  return "a";
        return null;
      });
      return {
        ...r,
        cells,
        rate: st.rate,
        total: st.total,
        presentCount: st.presentCount,
        absentCount:  st.absentCount,
        meetingsPresent: st.meetingsPresent,
        meetingsAbsent:  st.meetingsAbsent,
      };
    });
  }, [rosterRows, meetings, ay]);

  // KPIs
  const avgMtgRate = meetings.length === 0 ? 0
    : Math.round(100 * meetings.reduce((s, m) => s + m.attendanceRate, 0) / meetings.length);
  const tracked = memberAtt.filter(r => r.total > 0);
  const avgMemRate = tracked.length === 0 ? 0
    : Math.round(tracked.reduce((s, r) => s + r.rate, 0) / tracked.length);

  // Scroll the focused row into view on first render of the member tab.
  useEffectMM(() => {
    if (focusMemberId && tab === "member" && focusedRowRef.current) {
      const el = focusedRowRef.current;
      const scrollParent = el.closest(".m-body");
      if (scrollParent) {
        const top = el.offsetTop - scrollParent.offsetTop - 60;
        scrollParent.scrollTop = Math.max(0, top);
      }
    }
  }, [focusMemberId, tab]);

  // ─── Print + CSV ───────────────────────────────────────────────────────
  function handlePrint() {
    const title = "EEC Attendance — AY 2025–26";
    let html = `<h1>${title}</h1>
      <div class="meta">Voting attendance for filed EEC meetings · Quorum 7 of 13 voting · As of ${new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })}</div>
      <div class="legend">
        <span><span class="sw" style="background:#e1f3e6"></span> Present</span>
        <span><span class="sw" style="background:#fbe2e2"></span> Absent</span>
        <span><span class="sw" style="background:#fff"></span> Not on roster at the time</span>
      </div>`;

    if (tab === "meeting") {
      html += `<h2>By meeting</h2><table><thead><tr><th>Date</th><th>Type</th><th class="num">Present</th><th class="num">Absent</th><th class="num">Rate</th></tr></thead><tbody>`;
      for (const m of meetingsDesc) {
        html += `<tr>
          <td>${fmtDMM(m.date, "long")}</td>
          <td>${(m.type || "").replace("Regular Scheduled Meeting","Regular")}</td>
          <td class="num">${m.present.length}</td>
          <td class="num">${m.absent.length}</td>
          <td class="num">${Math.round(m.attendanceRate*100)}%</td>
        </tr>`;
      }
      html += `</tbody></table>`;
    } else if (tab === "member") {
      html += `<h2>By member</h2><table><thead><tr><th>Member</th><th>Seat</th><th>Vote</th><th class="num">Present</th><th class="num">Absent</th><th class="num">Rate</th></tr></thead><tbody>`;
      for (const r of memberAtt) {
        html += `<tr>
          <td>${shortNameMM(r.name)}<div style="font-size:10px;color:#7a8290;margin-top:2px">${(r.title || "").replace(/&/g,"&amp;")}</div></td>
          <td>${r.seat}</td>
          <td>${r.voting ? "Voting" : "Non-voting"}</td>
          <td class="num">${r.presentCount}</td>
          <td class="num">${r.absentCount}</td>
          <td class="num">${r.rate != null ? r.rate + "%" : "—"}</td>
        </tr>`;
      }
      html += `</tbody></table>`;
    } else {
      // grid
      html += `<h2>Grid (members × meetings)</h2><table><thead><tr><th>Member</th>`;
      for (const m of meetings) {
        const d = window.MS_DATE.parseLocal(m.date);
        html += `<th>${d.toLocaleDateString("en-US",{month:"numeric",day:"numeric"})}</th>`;
      }
      html += `<th class="num">Rate</th></tr></thead><tbody>`;
      for (const r of memberAtt) {
        html += `<tr><td>${shortNameMM(r.name)}</td>`;
        for (const c of r.cells) {
          if (c === "p") html += `<td class="p">✓</td>`;
          else if (c === "a") html += `<td class="a">✕</td>`;
          else html += `<td class="blank">—</td>`;
        }
        html += `<td class="num">${r.rate != null ? r.rate + "%" : "—"}</td></tr>`;
      }
      html += `</tbody></table>`;
    }

    openPrintWindow(title, html);
  }

  function handleCsv() {
    let rows = [];
    let filename = "eec-attendance";
    if (tab === "meeting") {
      rows.push(["Date","Type","Present","Absent","Total","Rate %"]);
      for (const m of meetingsDesc) {
        rows.push([
          m.date,
          (m.type || "").replace("Regular Scheduled Meeting","Regular"),
          m.present.length,
          m.absent.length,
          m.present.length + m.absent.length,
          Math.round(m.attendanceRate * 100),
        ]);
      }
      filename = "eec-attendance-by-meeting.csv";
    } else if (tab === "member") {
      rows.push(["Member","Seat","Vote","Present","Absent","Total","Rate %"]);
      for (const r of memberAtt) {
        rows.push([
          shortNameMM(r.name),
          r.seat,
          r.voting ? "Voting" : "Non-voting",
          r.presentCount,
          r.absentCount,
          r.total,
          r.rate != null ? r.rate : "",
        ]);
      }
      filename = "eec-attendance-by-member.csv";
    } else {
      const header = ["Member","Vote"].concat(meetings.map(m => m.date)).concat(["Rate %"]);
      rows.push(header);
      for (const r of memberAtt) {
        rows.push([
          shortNameMM(r.name),
          r.voting ? "Voting" : "Non-voting",
          ...r.cells.map(c => c === "p" ? "P" : c === "a" ? "A" : ""),
          r.rate != null ? r.rate : "",
        ]);
      }
      filename = "eec-attendance-grid.csv";
    }
    const csv = rows.map(row => row.map(csvCell).join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
  }

  return (
    <div className="m-body">
      <div className="m-section-head">
        <div className="eyebrow">EEC · {R ? R.AY_RANGES[ay].label : ""}</div>
        <h2>Attendance</h2>
      </div>

      <AYToggle value={ay} onChange={setAy} />

      {/* Take-attendance CTA */}
      <button className="m-cta-btn" onClick={() => onTake && onTake(ay)}
              style={{ background: "var(--brand-magenta)", marginBottom: 12, boxShadow: "0 4px 12px -6px rgba(216,11,140,0.45)" }}>
        <span className="icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </span>
        <span style={{ flex: 1 }}>
          <div className="ttl">Take attendance for a meeting</div>
          <div className="sub">Live checklist · quorum flag · categorized output</div>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
      </button>

      {/* KPIs */}
      <div className="m-kpi-grid">
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-cyan-deep)" }}>
          <div className="lbl">Meeting avg</div>
          <div className="val">{avgMtgRate}%</div>
          <div className="sub">across {meetings.length} filed mtgs</div>
        </div>
        <div className="m-kpi" style={{ borderTopColor: "var(--brand-violet)" }}>
          <div className="lbl">Member avg</div>
          <div className="val">{avgMemRate}%</div>
          <div className="sub">{tracked.length} of {memberAtt.length} tracked</div>
        </div>
      </div>

      {/* Toolbar: Print + CSV */}
      <div className="m-toolbar">
        <button className="m-tool-btn" onClick={handlePrint}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / PDF
        </button>
        <button className="m-tool-btn" onClick={handleCsv}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="m-tabs">
        <button className={tab === "meeting" ? "active" : ""} onClick={() => setTab("meeting")}>By meeting</button>
        <button className={tab === "member"  ? "active" : ""} onClick={() => setTab("member")}>By member</button>
        <button className={tab === "grid"    ? "active" : ""} onClick={() => setTab("grid")}>Grid</button>
      </div>

      {tab === "meeting" && <AttByMeeting meetings={meetingsDesc} />}
      {tab === "member"  && <AttByMember rows={memberAtt} focusMemberId={focusMemberId} focusedRowRef={focusedRowRef} meetings={meetings} />}
      {tab === "grid"    && <AttGrid rows={memberAtt} meetings={meetings} />}
    </div>
  );
}

function AttByMeeting({ meetings }) {
  return (
    <div className="m-card">
      <div className="head"><h3>Per filed meeting</h3></div>
      {meetings.map(m => (
        <div key={m.id} style={{ padding: "11px 14px", borderBottom: "1px solid var(--grey-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>{fmtDMM(m.date, "medium")}</div>
            <div style={{ fontSize: 11, color: "var(--grey-11)", fontFamily: "var(--mono)" }}>
              <strong style={{ color: "var(--ink)" }}>{m.present.length}</strong> / {m.present.length + m.absent.length}
            </div>
          </div>
          <div className="m-attbar">
            <div className="track">
              <div className="fill" style={{
                width: (m.attendanceRate * 100) + "%",
                background: m.attendanceRate >= 0.75 ? "var(--good)" :
                            m.attendanceRate >= 0.6  ? "var(--warn)" : "var(--bad)",
              }}></div>
            </div>
            <div className="pct">{Math.round(m.attendanceRate * 100)}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AttByMember({ rows, focusMemberId, focusedRowRef, meetings }) {
  // Sort: strictly alphabetical by surname; TBA placeholders sink to the bottom.
  const sorted = useMemoMM(() => [...rows].sort((a, b) => {
    const tbaA = /\bTBA\b/i.test(a.name);
    const tbaB = /\bTBA\b/i.test(b.name);
    if (tbaA !== tbaB) return tbaA ? 1 : -1;
    return window.ROSTERS.surname(a.name).localeCompare(window.ROSTERS.surname(b.name));
  }), [rows]);

  return (
    <div>
      {sorted.map(r => {
        const focused = focusMemberId === r.id;
        return (
          <div key={r.id} ref={focused ? focusedRowRef : null}
               className="m-mem-att-card"
               style={focused ? { borderLeftColor: "var(--brand-magenta)", boxShadow: "0 0 0 2px var(--brand-magenta-tint), 0 1px 2px rgba(20,20,20,0.04)" } : null}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div className="name">{shortNameMM(r.name)}</div>
                {r.title && <div className="role">{r.title}</div>}
              </div>
              <span className={"m-vote " + (r.voting ? "voting" : "nonvoting")}>
                {r.voting ? "Voting" : "Non-voting"}
              </span>
            </div>
            <div className="rate-line">
              {r.total > 0 ? <>
                <span className="big" style={{
                  color: r.rate >= 75 ? "var(--good)" : r.rate >= 60 ? "var(--warn)" : "var(--bad)",
                }}>{r.rate}%</span>
                <span className="small">
                  <strong style={{ color: "var(--ink)" }}>{r.presentCount}</strong> present ·{" "}
                  <strong style={{ color: "var(--ink)" }}>{r.absentCount}</strong> absent ·{" "}
                  {r.total} meeting{r.total === 1 ? "" : "s"} tracked
                </span>
              </> : (
                <span className="small" style={{ fontStyle: "italic", color: "var(--grey-7)" }}>
                  No attendance recorded yet
                </span>
              )}
            </div>
            {r.total > 0 && (
              <>
                <div className="m-attbar" style={{ marginBottom: 10 }}>
                  <div className="track">
                    <div className="fill" style={{
                      width: r.rate + "%",
                      background: r.rate >= 75 ? "var(--good)" : r.rate >= 60 ? "var(--warn)" : "var(--bad)",
                    }}></div>
                  </div>
                </div>
                <div className="mtg-list">
                  {meetings.map(m => {
                    const isP = (r.meetingsPresent || []).includes(m.date);
                    const isA = (r.meetingsAbsent  || []).includes(m.date);
                    if (!isP && !isA) return null;
                    return (
                      <span key={m.date} className={"mtg-pill " + (isP ? "p" : "a")}>
                        <span className="dot"></span>
                        {fmtDMM(m.date, "short")}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttGrid({ rows, meetings }) {
  return (
    <div className="m-grid-wrap">
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--grey-2)", display: "flex", gap: 14, fontSize: 11, color: "var(--grey-11)", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 12, height: 12, background: "var(--good-tint)", borderRadius: 2, border: "1px solid rgba(0,0,0,0.05)" }}></span>
          Present
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 12, height: 12, background: "var(--bad-tint)",  borderRadius: 2, border: "1px solid rgba(0,0,0,0.05)" }}></span>
          Absent
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--grey-7)" }}>
          Swipe →
        </span>
      </div>
      <div className="m-grid-scroll">
        <table className="m-grid">
          <thead>
            <tr>
              <th className="name">Member</th>
              {meetings.map(m => {
                const d = window.MS_DATE.parseLocal(m.date);
                return <th key={m.id}>
                  {d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                </th>;
              })}
              <th className="summary">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="name">
                  {shortNameMM(r.name)}
                  {!r.voting && <span style={{ marginLeft: 4, fontSize: 9, color: "var(--grey-7)", letterSpacing: "0.04em" }}>NV</span>}
                </td>
                {r.cells.map((c, i) => {
                  if (c === "p") return <td key={i} className="cell-p">✓</td>;
                  if (c === "a") return <td key={i} className="cell-a">✕</td>;
                  return <td key={i} className="cell-blank">—</td>;
                })}
                <td className="summary pct" style={{
                  color: r.rate == null ? "var(--grey-7)" :
                         r.rate >= 75 ? "var(--good)" :
                         r.rate >= 60 ? "var(--warn)" : "var(--bad)",
                }}>
                  {r.rate != null ? r.rate + "%" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Augment window.MobileSections ─────────────────────────────────────────
(function attach() {
  if (!window.MobileSections) {
    // mobile-sections.jsx hasn't run yet — try again on next frame.
    requestAnimationFrame(attach);
    return;
  }
  window.MobileSections.MembershipScreen = MembershipScreen;
  // Replace the old attendance screen with the new tabbed one.
  window.MobileSections.AttendanceScreen = AttendanceScreenV2;
})();
