// Loads the REAL m5_dormant_detector.gs and runs it against a fake MASTER.
// Stubs only the Google runtime. The logic under test is the shipped file, unmodified.
const fs = require('fs');
const path = '/Users/muhammadsharjeel/Downloads/SOP\'S/yale-build/scripts/m5_dormant_detector.gs';
const src = fs.readFileSync(path, 'utf8');

let LOG = [];
global.Logger = { log: m => LOG.push(String(m)) };
global.Utilities = {
  formatDate: (d) => {
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
};

// Minimal sheet: columns 1..23, rows 1..N. getRange(r,c,nr,nc) -> {getValues,setValues}
function makeSheet(rows) {
  const grid = rows.map(r => r.slice());
  return {
    getName: () => 'MASTER',
    getLastRow: () => grid.length,
    getRange(r, c, nr = 1, nc = 1) {
      return {
        getValues: () => {
          const out = [];
          for (let i = 0; i < nr; i++) {
            const row = [];
            for (let j = 0; j < nc; j++) row.push(grid[r - 1 + i][c - 1 + j]);
            out.push(row);
          }
          return out;
        },
        setValues: (v) => {
          for (let i = 0; i < nr; i++)
            for (let j = 0; j < nc; j++) grid[r - 1 + i][c - 1 + j] = v[i][j];
        }
      };
    },
    _grid: grid
  };
}

function blankRow() { return new Array(24).fill(''); }

function run({ today, baseline, rows }) {
  LOG = [];
  const sheet = makeSheet(rows);
  global.SpreadsheetApp = {
    getActive: () => ({ getSheetByName: n => (n === 'MASTER' ? sheet : null) }),
    flush: () => {}
  };
  // freeze "today"
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...a) { return a.length ? new RealDate(...a) : new RealDate(today); }
    static now() { return new RealDate(today).getTime(); }
  };
  // eval the real file, then override the baseline constant the same way an editor would
  const sandbox = {};
  const fn = new Function('SpreadsheetApp', 'Logger', 'Utilities', 'Date', '__BASE__',
    src + '\n; IMPORT_BASELINE = __BASE__; updateFollowUps(); return {NEXT_DUE:COL.NEXT_DUE,NOTES:COL.NOTES};');
  const cols = fn(global.SpreadsheetApp, global.Logger, global.Utilities, global.Date, baseline);
  global.Date = RealDate;
  return { grid: sheet._grid, cols, log: LOG.join('\n') };
}

// ---- fixtures -------------------------------------------------------------
// C=3 name, M=13 stage, N=14 outcome, R=18 last contact, S=19 due, T=20 added, W=23 notes
function imported(name)  { const r = blankRow(); r[2]=name; r[12]='Documents Pending'; r[19]='2026-08-20'; return r; }
function newIntake(name) { const r = blankRow(); r[2]=name; r[12]='Documents Pending'; r[19]='2026-08-24'; return r; }
function contacted(name, when) { const r = blankRow(); r[2]=name; r[12]='Documents Pending'; r[17]=when; r[19]='2026-07-01'; return r; }
function granted(name)   { const r = blankRow(); r[2]=name; r[13]='Granted'; r[19]='2026-08-20'; return r; }

const BASE = '2026-08-20';
let pass = 0, fail = 0;
function check(label, ok, detail) {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '   — ' + detail : ''));
  ok ? pass++ : fail++;
}
const dormantCount = g => g.slice(1).filter(r => String(r[22]).indexOf('DORMANT') === 0).length;
const note = (g, i) => String(g[i][22]);
const due  = (g, i) => String(g[i][19 - 1]);

console.log('=== THE BUG: 40 imported files, the day the 3-day rule bites ===');
{
  const rows = [blankRow()].concat(Array.from({length: 40}, (_, i) => imported('CLIENT ' + i)));
  // due = added + 3 = 23 Aug, and the test is `due < today`, so it fires on the 24th, not the 23rd.
  const d23 = run({ today: '2026-08-23T10:00:00', baseline: '', rows: rows.map(r => r.slice()) });
  check('no baseline: nothing yet on 23 Aug (due == today, not overdue)',
        dormantCount(d23.grid) === 0, dormantCount(d23.grid) + ' dormant');
  const before = run({ today: '2026-08-24T10:00:00', baseline: '', rows: rows.map(r => r.slice()) });
  check('WITHOUT a baseline, all 40 flag on 24 Aug (this is the bug)',
        dormantCount(before.grid) === 40, dormantCount(before.grid) + ' dormant');
  const after = run({ today: '2026-08-24T10:00:00', baseline: BASE, rows: rows.map(r => r.slice()) });
  check('WITH the baseline, 0 flag on day 3',
        dormantCount(after.grid) === 0, dormantCount(after.grid) + ' dormant');
  check('due date is baseline + 14 = 2026-09-03', due(after.grid, 1) === '2026-09-03', due(after.grid, 1));
}

console.log('\n=== the grace does expire — day 15 ===');
{
  const rows = [blankRow()].concat(Array.from({length: 40}, (_, i) => imported('CLIENT ' + i)));
  const r = run({ today: '2026-09-04T10:00:00', baseline: BASE, rows });
  check('all 40 flag once the 14 days are up', dormantCount(r.grid) === 40, dormantCount(r.grid) + ' dormant');
  check('the note claims no day count we cannot prove',
        note(r.grid, 1) === 'DORMANT: no contact logged since go-live', note(r.grid, 1));
}

console.log('\n=== a genuinely new client is UNAFFECTED — still the 3-day rule ===');
{
  const rows = [blankRow(), newIntake('WALK IN'), imported('OLD FILE')];
  const r = run({ today: '2026-08-28T10:00:00', baseline: BASE, rows });
  check('new intake (added 24 Aug) is dormant on 28 Aug', note(r.grid, 1).indexOf('DORMANT') === 0, note(r.grid, 1));
  check('new intake keeps the real day count', note(r.grid, 1) === 'DORMANT: no contact for 4 days', note(r.grid, 1));
  check('imported file beside it is NOT flagged', note(r.grid, 2) === '', JSON.stringify(note(r.grid, 2)));
  check('new intake due = added + 3', due(r.grid, 1) === '2026-08-27', due(r.grid, 1));
}

console.log('\n=== a contacted file is untouched by any of this ===');
{
  const rows = [blankRow(), contacted('SEEN LAST WEEK', '2026-08-01')];
  const r = run({ today: '2026-08-23T10:00:00', baseline: BASE, rows });
  check('contacted 1 Aug -> due 8 Aug, dormant 22 days', due(r.grid, 1) === '2026-08-08', due(r.grid, 1));
  check('real day count preserved', note(r.grid, 1) === 'DORMANT: no contact for 22 days', note(r.grid, 1));
}

console.log('\n=== closed matters are still never chased ===');
{
  const rows = [blankRow(), granted('DONE')];
  const r = run({ today: '2026-09-30T10:00:00', baseline: BASE, rows });
  check('granted file: no note, no due date', note(r.grid, 1) === '' && due(r.grid, 1) === '');
}

console.log('\n=== idempotency: notes must not stack (both note forms) ===');
{
  let rows = [blankRow()].concat([imported('A'), contacted('B', '2026-07-01')]);
  let g = rows;
  for (let i = 0; i < 5; i++) g = run({ today: '2026-09-10T10:00:00', baseline: BASE, rows: g }).grid;
  check('imported note appears exactly once after 5 runs',
        (note(g, 1).match(/DORMANT/g) || []).length === 1, note(g, 1));
  check('contacted note appears exactly once after 5 runs',
        (note(g, 2).match(/DORMANT/g) || []).length === 1, note(g, 2));
}

console.log('\n=== a file that gets contacted loses its DORMANT note ===');
{
  let rows = [blankRow(), imported('A')];
  let g = run({ today: '2026-09-10T10:00:00', baseline: BASE, rows }).grid;
  check('flagged first', note(g, 1).indexOf('DORMANT') === 0, note(g, 1));
  g[1][17] = '2026-09-10';                      // consultant logs a call
  g = run({ today: '2026-09-11T10:00:00', baseline: BASE, rows: g }).grid;
  check('note cleared once contact is logged', note(g, 1) === '', JSON.stringify(note(g, 1)));
  check('and it switches to the 7-day rule', due(g, 1) === '2026-09-17', due(g, 1));
}

console.log('\n=== a mistyped baseline must ABORT, never silently fall back ===');
{
  const rows = [blankRow(), imported('A')];
  ['20 August 2026', '2026-8-20', '20/08/2026', '2026-02-31', 'tomorrow'].forEach(bad => {
    const r = run({ today: '2026-09-30T10:00:00', baseline: bad, rows: rows.map(x => x.slice()) });
    check('ABORT on "' + bad + '", nothing written',
          r.log.indexOf('ABORT') > -1 && due(r.grid, 1) === '' && note(r.grid, 1) === '',
          r.log.split('\n')[0]);
  });
  const good = run({ today: '2026-09-30T10:00:00', baseline: BASE, rows: rows.map(x => x.slice()) });
  check('the well-formed baseline still runs', good.log.indexOf('ABORT') === -1);
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
