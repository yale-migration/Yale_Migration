// Loads the REAL s56_deadline_verifier.gs (plus m5_dormant_detector.gs, whose date
// helpers it reuses) and runs it against a fake S56 TRACKER under a frozen clock.
// The logic under test is the shipped file, unmodified.
const fs = require('fs');
const DIR = "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build/scripts/";
const M5  = fs.readFileSync(DIR + 'm5_dormant_detector.gs', 'utf8');
const V   = fs.readFileSync(DIR + 's56_deadline_verifier.gs', 'utf8');

let LOG = [];
const Logger = { log: m => LOG.push(String(m)) };
const Utilities = { formatDate: d => {
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
} };
const LockService = { getDocumentLock: () => ({ tryLock: () => true, releaseLock() {} }) };

const H = ['Received','Client Name','Subclass','DUE DATE (legal)','INTERNAL DUE',
  'Days Allowed','Letter Date','Deadline Sentence','TRN','Application ID','File Number',
  'Category','Confidence','Needs Review','Subject','Gmail Link','Assigned To','Status',
  'Raw Classification'];

function blank() { return new Array(19).fill(''); }
// name, letterDate, daysAllowed, statedDue, internalDue, sentence, status
function row(o) {
  const r = blank();
  r[1]  = o.name || 'CLIENT';
  r[3]  = o.due || '';
  r[4]  = o.internal || '';
  r[5]  = o.days === undefined ? '' : o.days;
  r[6]  = o.letter || '';
  r[7]  = o.sentence || '';
  r[13] = o.review || '';
  r[14] = 'Subject line';
  r[17] = o.status || 'New';
  return r;
}

function makeSheet(rows) {
  const grid = rows.map(r => r.slice());
  const notes = {};
  function range(r, c, nr = 1, nc = 1) {
    return {
      getValues: () => {
        const o = [];
        for (let i = 0; i < nr; i++) {
          const line = [];
          for (let j = 0; j < nc; j++) line.push(grid[r - 1 + i][c - 1 + j]);
          o.push(line);
        }
        return o;
      },
      setValues: v => {
        for (let i = 0; i < nr; i++)
          for (let j = 0; j < nc; j++) grid[r - 1 + i][c - 1 + j] = v[i][j];
      },
      getCell: (i, j) => ({
        setNote: t => { notes[(r - 1 + i - 1)] = t; },
        clearNote: () => { delete notes[(r - 1 + i - 1)]; }
      })
    };
  }
  return {
    getLastRow: () => grid.length,
    getLastColumn: () => grid[0].length,
    getRange: range,
    _grid: grid,
    _notes: notes
  };
}

function run({ today, rows }) {
  LOG = [];
  const sheet = makeSheet([H].concat(rows));
  const SpreadsheetApp = {
    openById: () => ({ getSheetByName: n => (n === 'S56 TRACKER' ? sheet : null) }),
    flush() {}
  };
  const RealDate = Date;
  const Frozen = class extends RealDate {
    constructor(...a) { return a.length ? new RealDate(...a) : new RealDate(today); }
    static now() { return new RealDate(today).getTime(); }
  };
  new Function('SpreadsheetApp', 'Logger', 'Utilities', 'LockService', 'Date',
    M5 + '\n' + V + '\n; verifyS56Deadlines();'
  )(SpreadsheetApp, Logger, Utilities, LockService, Frozen);
  return { grid: sheet._grid, notes: sheet._notes, log: LOG.join('\n') };
}

let pass = 0, fail = 0;
const check = (l, ok, d) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + l + (d ? '   — ' + d : ''));
  ok ? pass++ : fail++;
};
const due    = (g, i) => String(g[i][3]);
const review = (g, i) => String(g[i][13]);
const note   = (r, i) => String(r.notes[i] || '');

const TODAY = '2026-08-19T09:00:00';

console.log('=== the arithmetic itself: letter + 1 + days_allowed ===');
{
  // 14 Aug + 1 day + 28 days = 12 Sep. Internal (D-58) = 10 Sep.
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-12', internal: '2026-09-10',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('correct date agrees, no flag', note(r, 1) === '' && review(r.grid, 1) === '',
        note(r, 1) || '(clean)');
  check('log reports 1 agreement', /agree \.+ 1/.test(r.log.replace(/\./g, m => m)),
        r.log.split('\n').find(l => l.indexOf('agree') > -1));
}

console.log('\n=== 🔴 the case this exists for: model arithmetic is WRONG ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-16', internal: '2026-09-14',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('disagreement is FLAGGED', note(r, 1).indexOf('DEADLINE DISAGREEMENT') > -1, note(r, 1));
  check('...names both dates', note(r, 1).indexOf('2026-09-16') > -1
        && note(r, 1).indexOf('2026-09-12') > -1);
  check('⛔ the date is NOT overwritten', due(r.grid, 1) === '2026-09-16', due(r.grid, 1));
  check('Needs Review set to YES', review(r.grid, 1) === 'YES');
}

console.log('\n=== 🔴 the model misquotes its own source: sentence vs days ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 30, due: '2026-09-14', internal: '2026-09-12',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('caught: sentence says 28, field says 30',
        note(r, 1).indexOf('PARSE MISMATCH') > -1, note(r, 1));
  check('Needs Review set', review(r.grid, 1) === 'YES');
}

console.log('\n=== never assume 28 — a 14-day letter must compute correctly ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 14, due: '2026-08-29', internal: '2026-08-27',
    sentence: 'You have 14 days starting on the day after we emailed this request.' })] });
  check('14-day deadline agrees (14 Aug + 1 + 14 = 29 Aug)',
        note(r, 1) === '', note(r, 1) || '(clean)');
}

console.log('\n=== internal due (legal − 2, D-58) ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-12', internal: '2026-09-12',
    sentence: '28 days' })] });
  check('wrong internal date is flagged with the right one',
        note(r, 1).indexOf('2026-09-10') > -1, note(r, 1));
}

console.log('\n=== a passed deadline is REPORTED, never actioned ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-06-01', days: 28, due: '2026-06-30', internal: '2026-06-28',
    sentence: '28 days', status: 'New' })] });
  check('overdue is flagged', note(r, 1).indexOf('PAST THE LEGAL DEADLINE') > -1, note(r, 1));
  check('says extendable / not auto-closed', note(r, 1).indexOf('extendable') > -1);
  check('⛔ Status untouched — nothing auto-closed', String(r.grid[1][17]) === 'New');
}
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-06-01', days: 28, due: '2026-06-30', internal: '2026-06-28',
    sentence: '28 days', status: 'Closed' })] });
  check('a Closed row is not chased as overdue',
        note(r, 1).indexOf('PAST THE LEGAL') === -1, note(r, 1) || '(clean)');
}

console.log('\n=== missing inputs are SAID, not silently skipped ===');
{
  const r = run({ today: TODAY, rows: [row({ due: '2026-09-12', sentence: '' })] });
  check('due date with no basis to check it is flagged',
        note(r, 1).indexOf('cannot be independently checked') > -1, note(r, 1));
}
{
  const r = run({ today: TODAY, rows: [row({})] });
  check('empty row says there is nothing to work from',
        note(r, 1).indexOf('nothing to work from') > -1, note(r, 1));
}

console.log('\n=== a missing due date is a finding, not a blank ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '', sentence: '28 days' })] });
  check('no due date set -> flagged with the computed one',
        note(r, 1).indexOf('NO DUE DATE SET') > -1 && note(r, 1).indexOf('2026-09-12') > -1,
        note(r, 1));
  check('⛔ still not written for us', due(r.grid, 1) === '');
}

console.log('\n=== idempotency: notes replace, never stack ===');
{
  let rows = [row({ letter: '2026-08-14', days: 28, due: '2026-09-16',
                    internal: '2026-09-14', sentence: '28 days' })];
  let r;
  for (let i = 0; i < 4; i++) r = run({ today: TODAY, rows: r ? r.grid.slice(1) : rows });
  check('exactly one DISAGREEMENT phrase after 4 runs',
        (note(r, 1).match(/DEADLINE DISAGREEMENT/g) || []).length === 1, note(r, 1));
}
{
  // a row that gets fixed must lose its note
  let r = run({ today: TODAY, rows: [row({ letter: '2026-08-14', days: 28,
    due: '2026-09-16', internal: '2026-09-14', sentence: '28 days' })] });
  check('flagged first', note(r, 1).indexOf('DISAGREEMENT') > -1);
  const fixed = r.grid.slice(1);
  fixed[0][3] = '2026-09-12'; fixed[0][4] = '2026-09-10';
  r = run({ today: TODAY, rows: fixed });
  check('note cleared once corrected', note(r, 1) === '', note(r, 1));
}

console.log('\n=== it aborts rather than flag the wrong column ===');
{
  const badHdr = H.slice(); badHdr[3] = 'Something Else';
  LOG = [];
  const sheet = makeSheet([badHdr, row({ letter: '2026-08-14', days: 28 })]);
  const SA = { openById: () => ({ getSheetByName: () => sheet }), flush() {} };
  const RealDate = Date;
  const Frozen = class extends RealDate {
    constructor(...a) { return a.length ? new RealDate(...a) : new RealDate(TODAY); }
  };
  new Function('SpreadsheetApp','Logger','Utilities','LockService','Date',
    M5 + '\n' + V + '\n; verifyS56Deadlines();')(SA, Logger, Utilities, LockService, Frozen);
  check('shifted column -> ABORT, nothing written', LOG.join('\n').indexOf('ABORT') > -1,
        LOG[0]);
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
