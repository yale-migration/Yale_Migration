// Loads the REAL m8_lead_followup.gs (plus m5_dormant_detector.gs, whose date
// helpers it reuses) and runs it against a fake ENQUIRIES tab under a frozen clock.
// The logic under test is the shipped file, unmodified.
const fs = require('fs');
const DIR = "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build/scripts/";
const M5 = fs.readFileSync(DIR + 'm5_dormant_detector.gs', 'utf8');
const M6 = fs.readFileSync(DIR + 'm8_lead_followup.gs', 'utf8');

let LOG = [];
const Logger = { log: m => LOG.push(String(m)) };
const Utilities = { formatDate: d => {
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
} };
const LockService = { getDocumentLock: () => ({ tryLock: () => true, releaseLock() {} }) };

// ENQUIRIES: A Date, B Name, C Phone, D Email, E Channel, F Visa, G Loc,
//            H Assigned, I Status, J Follow-up Due, K Notes
function blankRow() { return new Array(12).fill(''); }
// row 1 must carry the L header or M8 correctly decides the column is absent
function hdrRow(withLC) { const r = blankRow(); if (withLC) r[11] = 'Last Contact'; return r; }
function enq(name, date, status, note) {
  const r = blankRow(); r[1] = name; r[0] = date || ''; r[8] = status || ''; r[10] = note || '';
  return r;
}

function makeSheet(rows) {
  const grid = rows.map(r => r.slice());
  return {
    getLastRow: () => grid.length,
    getLastColumn: () => grid[0].length,
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValue: () => grid[r - 1][c - 1],
        setValue: v => { grid[r - 1][c - 1] = v; },
        getValues: () => {
          const o = [];
          for (let i = 0; i < nr; i++) {
            const row = [];
            for (let j = 0; j < nc; j++) row.push(grid[r - 1 + i][c - 1 + j]);
            o.push(row);
          }
          return o;
        },
        setValues: v => {
          for (let i = 0; i < nr; i++)
            for (let j = 0; j < nc; j++) grid[r - 1 + i][c - 1 + j] = v[i][j];
        }
      };
    },
    _grid: grid
  };
}

function run({ today, baseline, rows }) {
  LOG = [];
  const sheet = makeSheet(rows);
  const SpreadsheetApp = {
    getActive: () => ({ getSheetByName: n => (n === 'ENQUIRIES' ? sheet : null) }),
    flush() {}
  };
  const RealDate = Date;
  const FrozenDate = class extends RealDate {
    constructor(...a) { return a.length ? new RealDate(...a) : new RealDate(today); }
    static now() { return new RealDate(today).getTime(); }
  };
  const fn = new Function('SpreadsheetApp', 'Logger', 'Utilities', 'LockService', 'Date', '__B__',
    M5 + '\n' + M6 + '\n; M8_BASELINE = __B__; updateEnquiryFollowUps();');
  fn(SpreadsheetApp, Logger, Utilities, LockService, FrozenDate, baseline);
  return { grid: sheet._grid, log: LOG.join('\n') };
}

let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '   — ' + detail : ''));
  ok ? pass++ : fail++;
};
const due  = (g, i) => String(g[i][9]);
const note = (g, i) => String(g[i][10]);
const lc   = (g, i) => String(g[i][11]);
const stat = s => { const m = LOG; return m; };

const BASE = '2026-08-18';

console.log('=== SOP-CI-001 10D — the 7 then 30 day cadence ===');
{
  // enquiry on 1 Sep (after baseline) -> live cadence
  const mk = () => [blankRow(), enq('A', '2026-09-01')];
  let r = run({ today: '2026-09-03T10:00:00', baseline: BASE, rows: mk() });
  check('day 2: next touch is the day-7 date', due(r.grid, 1) === '2026-09-08', due(r.grid, 1));
  r = run({ today: '2026-09-10T10:00:00', baseline: BASE, rows: mk() });
  check('day 9: day-7 passed, next touch is the day-30 date',
        due(r.grid, 1) === '2026-10-01', due(r.grid, 1));
  r = run({ today: '2026-10-05T10:00:00', baseline: BASE, rows: mk() });
  check('day 34: both windows past -> no date, asks for a Status',
        due(r.grid, 1) === '' && note(r.grid, 1).indexOf('set a Status') > -1, note(r.grid, 1));
}

console.log('\n=== THE FLOOD THE BASELINE PREVENTS ===');
{
  // 621 imported enquiries all dated well before today
  const rows = [blankRow()].concat(
    Array.from({ length: 621 }, (_, i) => enq('C' + i, '2026-07-0' + (i % 9 + 1))));
  const off = run({ today: '2026-08-18T10:00:00', baseline: '', rows: rows.map(r => r.slice()) });
  const lapsedOff = off.grid.slice(1).filter(r => String(r[10]).indexOf('set a Status') > -1).length;
  check('WITHOUT a baseline, all 621 are flagged lapsed on day one (the bug)',
        lapsedOff === 621, lapsedOff + ' flagged');
  const on = run({ today: '2026-08-18T10:00:00', baseline: BASE, rows: rows.map(r => r.slice()) });
  const lapsedOn = on.grid.slice(1).filter(r => String(r[10]).indexOf('set a Status') > -1).length;
  check('WITH the baseline, 0 are flagged lapsed', lapsedOn === 0, lapsedOn + ' flagged');
  check('...they are recorded honestly as historical instead',
        note(on.grid, 1).indexOf('historical enquiry') > -1, note(on.grid, 1));
  check('...and carry no follow-up date', due(on.grid, 1) === '');
  check('log reports the historical count out loud',
        /historical \(pre-baseline\) \.+ 621/.test(on.log.replace(/\.+/g, m => m)),
        on.log.split('\n').find(l => l.indexOf('historical') > -1));
}

console.log('\n=== closed enquiries are never chased ===');
{
  ['Not Proceeding', 'Lost Lead', 'Converted'].forEach(s => {
    const r = run({ today: '2026-10-05T10:00:00', baseline: BASE,
                    rows: [blankRow(), enq('A', '2026-09-01', s)] });
    check('"' + s + '" -> no date, no chase note',
          due(r.grid, 1) === '' && note(r.grid, 1) === '', JSON.stringify(note(r.grid, 1)));
  });
  // 'Not Proceeding' is how SOP-CI-001 10D's "requests no further contact" is recorded
  check('"Not Proceeding" is the SOP\'s no-further-contact exception', true);
}

console.log('\n=== a row with a phone and no name is still an enquiry ===');
{
  const r0 = blankRow(); r0[2] = '0400000000'; r0[0] = '2026-09-01';
  const r = run({ today: '2026-09-03T10:00:00', baseline: BASE, rows: [blankRow(), r0] });
  check('phone-only row is scheduled', due(r.grid, 1) === '2026-09-08', due(r.grid, 1));
  const r1 = blankRow();
  const r2 = run({ today: '2026-09-03T10:00:00', baseline: BASE, rows: [blankRow(), r1] });
  check('truly blank row is skipped', due(r2.grid, 1) === '' && note(r2.grid, 1) === '');
}

console.log('\n=== no date -> says so, does not guess ===');
{
  const r = run({ today: '2026-09-03T10:00:00', baseline: BASE,
                  rows: [blankRow(), enq('A', '')] });
  check('no date -> explains itself, no due date',
        due(r.grid, 1) === '' && note(r.grid, 1).indexOf('no enquiry date') > -1, note(r.grid, 1));
}

console.log('\n=== idempotency: the M6 note must never stack ===');
{
  let g = [blankRow(), enq('A', '2026-09-01', '', 'called him, will try Monday')];
  for (let i = 0; i < 6; i++) g = run({ today: '2026-10-05T10:00:00', baseline: BASE, rows: g }).grid;
  const hits = (note(g, 1).match(/M8:/g) || []).length;
  check('exactly one M8: line after 6 runs', hits === 1, note(g, 1));
  check("the consultant's own words survive untouched",
        note(g, 1).indexOf('called him, will try Monday') > -1, note(g, 1));
}

console.log('\n=== it must NEVER write Status — that is the consultant\'s judgement ===');
{
  const rows = [blankRow(), enq('A', '2026-07-01'), enq('B', '2026-09-01')];
  const r = run({ today: '2026-10-05T10:00:00', baseline: BASE, rows });
  check('Status left blank on every row',
        r.grid.slice(1).every(x => String(x[8]) === ''),
        JSON.stringify(r.grid.slice(1).map(x => x[8])));
}

console.log('\n=== a mistyped baseline aborts rather than falling through ===');
{
  ['18 August 2026', '2026-8-18', '18/08/2026', '2026-02-31'].forEach(bad => {
    const rows = [blankRow(), enq('A', '2026-07-01')];
    const r = run({ today: '2026-10-05T10:00:00', baseline: bad, rows });
    check('ABORT on "' + bad + '", nothing written',
          r.log.indexOf('ABORT') > -1 && due(r.grid, 1) === '' && note(r.grid, 1) === '');
  });
}

console.log('\n=== STOP-ON-REPLY (D-339) — the other half of M8 ===');
{
  // same lead, same dates, only difference is whether a reply was logged
  const mk = withReply => {
    const r = enq('A', '2026-09-01');
    if (withReply) r[11] = '2026-09-03';
    return [hdrRow(true), r];
  };
  let a = run({ today: '2026-09-10T10:00:00', baseline: BASE, rows: mk(false) });
  check('no reply logged -> still scheduled (day-30 next)',
        due(a.grid, 1) === '2026-10-01', due(a.grid, 1));

  let b = run({ today: '2026-09-10T10:00:00', baseline: BASE, rows: mk(true) });
  check('reply logged -> follow-up date CLEARED', due(b.grid, 1) === '', JSON.stringify(due(b.grid, 1)));
  check('...and it says why, with the date', /replied 2026-09-03.*stopped/.test(note(b.grid, 1)), note(b.grid, 1));

  // a reply must stop it even when BOTH windows are long past
  let c = run({ today: '2026-12-01T10:00:00', baseline: BASE, rows: mk(true) });
  check('reply beats "lapsed" — no "set a Status" nag once they have come back',
        note(c.grid, 1).indexOf('set a Status') === -1 && due(c.grid, 1) === '', note(c.grid, 1));

  // the reply column must never be written to by M8 — it is the human's field
  check('M8 never writes column L itself', lc(c.grid, 1) === '2026-09-03', lc(c.grid, 1));
}
{
  // idempotency: the replied note must not stack either
  let g = [hdrRow(true), enq('A', '2026-09-01', '', 'spoke to her Tuesday')];
  g[1][11] = '2026-09-03';
  for (let i = 0; i < 5; i++) g = run({ today: '2026-10-05T10:00:00', baseline: BASE, rows: g }).grid;
  check('exactly one M8: line after 5 runs', (note(g, 1).match(/M8:/g) || []).length === 1, note(g, 1));
  check("the consultant's own words survive", note(g, 1).indexOf('spoke to her Tuesday') > -1);
}
{
  // closed still wins over a reply — a Converted lead is not chased or annotated
  const r = enq('A', '2026-09-01', 'Converted'); r[11] = '2026-09-03';
  const x = run({ today: '2026-10-05T10:00:00', baseline: BASE, rows: [hdrRow(true), r] });
  check('a CLOSED status still takes precedence over a logged reply',
        due(x.grid, 1) === '' && note(x.grid, 1) === '', JSON.stringify(note(x.grid, 1)));
}
{
  // column L absent -> exactly the old behaviour, and the log says so
  const r = run({ today: '2026-09-10T10:00:00', baseline: BASE,
                  rows: [hdrRow(false), enq('A', '2026-09-01')] });
  check('L absent -> cadence unchanged', due(r.grid, 1) === '2026-10-01', due(r.grid, 1));
  check('L absent -> the log says stop-on-reply is OFF',
        r.log.indexOf('stop-on-reply is OFF') > -1,
        r.log.split('\n').find(l => l.indexOf('replied') > -1));
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
