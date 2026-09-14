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

console.log('=== the arithmetic itself: letter + days_allowed (D-477) ===');
{
  // 28 days starting 15 Aug -> day 28 is 11 Sep. Internal (D-58) = 9 Sep.
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-11', internal: '2026-09-09',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('correct date agrees, no flag', note(r, 1) === '' && review(r.grid, 1) === '',
        note(r, 1) || '(clean)');
  check('log reports 1 agreement', /agree \.+ 1/.test(r.log.replace(/\./g, m => m)),
        r.log.split('\n').find(l => l.indexOf('agree') > -1));
}

console.log('\n=== 🔒 THE REAL LETTER — the one that caught the off-by-one (D-477) ===');
{
  /* ⛔ DO NOT "TIDY" THESE DATES. They are not invented.
   *
   * A genuine Department of Home Affairs s56 request, subclass 482, forwarded to
   * us on 14 Sep 2026:
   *
   *   Letter date : 12 September 2026
   *   Wording     : "You have 28 days starting on the day after we emailed
   *                  this request to give us the information we have asked for."
   *   Deadline    : 10 October 2026
   *
   * The deadline is not our arithmetic — the RMA's own email to the applicant
   * says "We need to submit these documents before 10 October 2026". Two
   * independent sources, same date.
   *
   * Until this letter arrived the code computed 11 October, and every test in
   * this file agreed with it, because the tests were written from the same
   * wrong formula. This case exists so that can never be true again: it is
   * anchored to a real document, not to our own reasoning.
   *
   * 🔑 No client details appear here, deliberately. The dates are the evidence;
   * the person is not ours to put in a repository.
   */
  const r = run({ today: '2026-09-14T09:00:00', rows: [row({
    letter: '2026-09-12', days: 28, due: '2026-10-10', internal: '2026-10-08',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('🔒 real 482 letter: 12 Sep + 28 days = 10 Oct, agrees with no flag',
        note(r, 1) === '' && review(r.grid, 1) === '', note(r, 1) || '(clean)');

  // The old, wrong answer must now be REJECTED — this is the regression guard.
  const bad = run({ today: '2026-09-14T09:00:00', rows: [row({
    letter: '2026-09-12', days: 28, due: '2026-10-11', internal: '2026-10-09',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('⛔ 11 Oct — the old formula\'s answer — is now FLAGGED as wrong',
        note(bad, 1).indexOf('DEADLINE DISAGREEMENT') > -1, note(bad, 1));
  check('...and it names 10 Oct as the correct date',
        note(bad, 1).indexOf('2026-10-10') > -1, note(bad, 1));

  /* The generic form of the bug, in one assertion: one day starting tomorrow is
   * due TOMORROW. The old formula made it the day after tomorrow. */
  const one = run({ today: '2026-09-14T09:00:00', rows: [row({
    letter: '2026-09-12', days: 1, due: '2026-09-13', internal: '2026-09-11',
    sentence: 'You have 1 day starting on the day after we emailed this request.' })] });
  check('🔑 one day starting tomorrow is due TOMORROW, not the day after',
        note(one, 1).indexOf('DEADLINE DISAGREEMENT') === -1, note(one, 1) || '(clean)');
}

console.log('\n=== 🔴 the case this exists for: model arithmetic is WRONG ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-16', internal: '2026-09-14',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('disagreement is FLAGGED', note(r, 1).indexOf('DEADLINE DISAGREEMENT') > -1, note(r, 1));
  check('...names both dates', note(r, 1).indexOf('2026-09-16') > -1
        && note(r, 1).indexOf('2026-09-11') > -1);
  check('⛔ the date is NOT overwritten', due(r.grid, 1) === '2026-09-16', due(r.grid, 1));
  check('Needs Review set to YES', review(r.grid, 1) === 'YES');
}

console.log('\n=== 🔴 the model misquotes its own source: sentence vs days ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 30, due: '2026-09-13', internal: '2026-09-11',
    sentence: 'You have 28 days starting on the day after we emailed this request.' })] });
  check('caught: sentence says 28, field says 30',
        note(r, 1).indexOf('PARSE MISMATCH') > -1, note(r, 1));
  check('Needs Review set', review(r.grid, 1) === 'YES');
}

console.log('\n=== never assume 28 — a 14-day letter must compute correctly ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 14, due: '2026-08-28', internal: '2026-08-26',
    sentence: 'You have 14 days starting on the day after we emailed this request.' })] });
  check('14-day deadline agrees (14 Aug + 14 = 28 Aug)',
        note(r, 1) === '', note(r, 1) || '(clean)');
}

console.log('\n=== internal due (legal − 2, D-58) ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-08-14', days: 28, due: '2026-09-11', internal: '2026-09-11',
    sentence: '28 days' })] });
  check('wrong internal date is flagged with the right one',
        note(r, 1).indexOf('2026-09-09') > -1, note(r, 1));
}

console.log('\n=== a passed deadline is REPORTED, never actioned ===');
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-06-01', days: 28, due: '2026-06-29', internal: '2026-06-27',
    sentence: '28 days', status: 'New' })] });
  check('overdue is flagged', note(r, 1).indexOf('PAST THE LEGAL DEADLINE') > -1, note(r, 1));
  check('says extendable / not auto-closed', note(r, 1).indexOf('extendable') > -1);
  check('⛔ Status untouched — nothing auto-closed', String(r.grid[1][17]) === 'New');
}
{
  const r = run({ today: TODAY, rows: [row({
    letter: '2026-06-01', days: 28, due: '2026-06-29', internal: '2026-06-27',
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
        note(r, 1).indexOf('NO DUE DATE SET') > -1 && note(r, 1).indexOf('2026-09-11') > -1,
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
  fixed[0][3] = '2026-09-11'; fixed[0][4] = '2026-09-09';
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

console.log('\n=== 🔴 zero checks passing is NOT verification ===');
{
  // The first live run printed "Every computed deadline matches an independent
  // recomputation" having recomputed nothing at all — one row with no letter date
  // and no days allowed. True, and completely misleading, in the script whose only
  // job is to be trusted about legal dates.
  const noBasis = run({ today: TODAY, rows: [row({ name: 'A CLIENT' })] });
  check('🔴 nothing checked -> does NOT claim everything matches',
        !/All .* agree|Every computed deadline matches/.test(noBasis.log),
        noBasis.log.split('\n').filter(l => l.trim()).pop());
  check('🔴 nothing checked -> says so in plain words',
        /NOTHING WAS VERIFIED/.test(noBasis.log));
  check('🔴 nothing checked -> states explicitly this is not a pass',
        /This is NOT a pass/.test(noBasis.log));

  // A genuine all-clear must still read as an all-clear.
  const good = run({ today: TODAY, rows: [row({ name: 'B CLIENT', letter: '2026-08-14',
                     days: 28, due: '2026-09-11', internal: '2026-09-09' })] });
  check('a real agreement still reports as agreement',
        /agree with an independent recomputation/.test(good.log),
        good.log.split('\n').filter(l => l.trim()).pop());

  // Mixed: some verified, some not. The unverified ones must not hide behind the pass.
  const mixed = run({ today: TODAY, rows: [
    row({ name: 'C', letter: '2026-08-14', days: 28, due: '2026-09-11', internal: '2026-09-09' }),
    row({ name: 'D' })] });
  check('🔴 mixed run -> the unchecked rows are called out beside the pass',
        /COULD NOT BE CHECKED AT ALL/.test(mixed.log), mixed.log);
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
