// Loads the REAL s56_parse_classifications.gs and runs it against a fake
// S56 TRACKER. The point of putting the parsing in Apps Script instead of Make
// mappings was so it could be hammered like this.
const fs = require('fs');
const DIR = "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build/scripts/";
const P = fs.readFileSync(DIR + 's56_parse_classifications.gs', 'utf8');

let LOG = [];
const Logger = { log: m => LOG.push(String(m)) };
const LockService = { getDocumentLock: () => ({ tryLock: () => true, releaseLock() {} }) };

const H = ['Received','Client Name','Subclass','DUE DATE (legal)','INTERNAL DUE',
  'Days Allowed','Letter Date','Deadline Sentence','TRN','Application ID','File Number',
  'Category','Confidence','Needs Review','Subject','Gmail Link','Assigned To','Status',
  'Raw Classification'];
const C = { NAME:1, SUBCLASS:2, DUE:3, INTERNAL:4, DAYS:5, LETTER:6, SENTENCE:7,
            TRN:8, APPID:9, FILENO:10, CATEGORY:11, CONF:12, REVIEW:13,
            ASSIGNEE:16, STATUS:17, RAW:18 };   // 0-indexed

function blank() { return new Array(19).fill(''); }
function withRaw(raw, over) {
  const r = blank(); r[C.RAW] = raw;
  if (over) Object.keys(over).forEach(k => { r[C[k]] = over[k]; });
  return r;
}

function makeSheet(rows) {
  const grid = rows.map(r => r.slice());
  return {
    getLastRow: () => grid.length,
    getLastColumn: () => grid[0].length,
    getRange: (r, c, nr = 1, nc = 1) => ({
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
      }
    }),
    _grid: grid
  };
}

function run(rows, hdr) {
  LOG = [];
  const sheet = makeSheet([(hdr || H)].concat(rows));
  const SpreadsheetApp = {
    openById: () => ({ getSheetByName: n => (n === 'S56 TRACKER' ? sheet : null) }),
    flush() {}
  };
  new Function('SpreadsheetApp', 'Logger', 'LockService',
    P + '\n; parseS56Classifications();')(SpreadsheetApp, Logger, LockService);
  return { grid: sheet._grid, log: LOG.join('\n') };
}

let pass = 0, fail = 0;
const check = (l, ok, d) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + l + (d ? '   — ' + d : ''));
  ok ? pass++ : fail++;
};
const cell = (g, col) => String(g[1][C[col]]);

const GOOD = JSON.stringify({
  category: 'Department correspondence',
  is_department_request: true,
  client_name: 'A CLIENT',
  subclass: '500',
  letter_date: '2026-08-14',
  days_allowed: 28,
  due_date: '2026-09-12',
  internal_due_date: '2026-09-10',
  deadline_sentence: 'You have 28 days starting on the day after we emailed this request.',
  trn: 'EGP9XF6H64',
  application_id: '1540713558',
  file_number: 'BCC2025/7294045',
  confidence: 0.96,
  needs_review: false
});

console.log('=== a clean classification transcribes into every column ===');
{
  const r = run([withRaw(GOOD)]);
  check('category',  cell(r.grid,'CATEGORY') === 'Department correspondence', cell(r.grid,'CATEGORY'));
  check('subclass',  cell(r.grid,'SUBCLASS') === '500');
  check('letter date', cell(r.grid,'LETTER') === '2026-08-14');
  check('days allowed', cell(r.grid,'DAYS') === '28');
  check('due date transcribed verbatim', cell(r.grid,'DUE') === '2026-09-12');
  check('deadline sentence kept whole',
        cell(r.grid,'SENTENCE').indexOf('28 days starting on the day after') > -1);
  check('TRN', cell(r.grid,'TRN') === 'EGP9XF6H64');
  check('application id', cell(r.grid,'APPID') === '1540713558');
  check('file number', cell(r.grid,'FILENO') === 'BCC2025/7294045');
  check('confidence', cell(r.grid,'CONF') === '0.96');
  check('NOT flagged for review', cell(r.grid,'REVIEW') === '', cell(r.grid,'REVIEW'));
  check('status defaulted to New', cell(r.grid,'STATUS') === 'New');
  check('assignee defaulted to Unassigned', cell(r.grid,'ASSIGNEE') === 'Unassigned');
}

console.log('\n=== whatever shape the model/Make actually delivers ===');
{
  const fenced = '```json\n' + GOOD + '\n```';
  check('```json fenced block', cell(run([withRaw(fenced)]).grid,'TRN') === 'EGP9XF6H64');
  const prose = 'Here is the classification:\n' + GOOD + '\nHope that helps.';
  check('JSON with prose around it', cell(run([withRaw(prose)]).grid,'TRN') === 'EGP9XF6H64');
  const dbl = JSON.stringify(GOOD);
  check('double-encoded JSON string', cell(run([withRaw(dbl)]).grid,'TRN') === 'EGP9XF6H64');
  const camel = JSON.stringify({ category:'X', is_department_request:false,
    clientName:'B', letterDate:'2026-08-14', daysAllowed:28, dueDate:'2026-09-12',
    deadlineSentence:'28 days', confidence:0.9 });
  check('camelCase key spellings also accepted', cell(run([withRaw(camel)]).grid,'LETTER') === '2026-08-14');
}

console.log('\n=== 🔴 garbage must become a VISIBLE flag, never a blank row ===');
{
  ['not json at all', '{broken', '[object Object]', '```json\nnope\n```'].forEach(bad => {
    const r = run([withRaw(bad)]);
    check('"' + bad.slice(0, 18) + '" -> UNPARSEABLE + review',
          cell(r.grid,'CATEGORY') === 'UNPARSEABLE' && cell(r.grid,'REVIEW') === 'YES',
          cell(r.grid,'CATEGORY'));
  });
  const r = run([withRaw('[1,2,3]')]);
  check('a JSON ARRAY is not a classification', cell(r.grid,'CATEGORY') === 'UNPARSEABLE');
}

console.log('\n=== 🔴 the silent failure this is built to prevent ===');
{
  // A Department request whose deadline evidence never arrived. Without a flag
  // this looks exactly like an ordinary logged email.
  const noSentence = JSON.stringify({ category:'Department correspondence',
    is_department_request:true, client_name:'A', confidence:0.98 });
  const r = run([withRaw(noSentence)]);
  check('Dept request with NO deadline sentence is flagged', cell(r.grid,'REVIEW') === 'YES');
  check('...and still recorded, not dropped', cell(r.grid,'CATEGORY') === 'Department correspondence');
}
{
  const noBasis = JSON.stringify({ category:'Department correspondence',
    is_department_request:true, deadline_sentence:'28 days', confidence:0.98 });
  const r = run([withRaw(noBasis)]);
  check('Dept request missing letter date / days is flagged', cell(r.grid,'REVIEW') === 'YES');
}

console.log('\n=== confidence: never a silent guess (safety rule 6) ===');
{
  const low = JSON.stringify({ category:'Department correspondence',
    is_department_request:true, confidence:0.4, deadline_sentence:'28 days',
    letter_date:'2026-08-14', days_allowed:28 });
  check('0.4 -> review', cell(run([withRaw(low)]).grid,'REVIEW') === 'YES');
  const none = JSON.stringify({ category:'Other', is_department_request:false });
  check('no confidence at all -> review', cell(run([withRaw(none)]).grid,'REVIEW') === 'YES');
  const high = JSON.stringify({ category:'Other', is_department_request:false, confidence:0.99 });
  check('a confident NON-department email is not flagged',
        cell(run([withRaw(high)]).grid,'REVIEW') === '', cell(run([withRaw(high)]).grid,'REVIEW'));
  check('model asking for review is honoured even at high confidence',
        cell(run([withRaw(JSON.stringify({ category:'Other', is_department_request:false,
          confidence:0.99, needs_review:true }))]).grid,'REVIEW') === 'YES');
}

console.log('\n=== idempotency and non-destruction ===');
{
  let g = [withRaw(GOOD)];
  let r; for (let i = 0; i < 4; i++) r = run(r ? r.grid.slice(1) : g);
  check('4 runs leave one clean parse', cell(r.grid,'CATEGORY') === 'Department correspondence');
  check('...and did not re-flag it', cell(r.grid,'REVIEW') === '');
  check('log shows it was skipped as already parsed', /already parsed[^\n]*1/.test(r.log),
        r.log.split('\n').find(l => l.indexOf('already parsed') > -1));
}
{
  // a human edited Status/Assignee — parsing must not stomp them
  const r = run([withRaw(GOOD, { STATUS: 'Acknowledged', ASSIGNEE: 'RJ' })]);
  check("a human's Status survives", cell(r.grid,'STATUS') === 'Acknowledged');
  check("a human's Assignee survives", cell(r.grid,'ASSIGNEE') === 'RJ');
}
{
  const r = run([blank()]);
  check('a row with no raw classification is left entirely alone',
        r.grid[1].every(v => v === ''));
}

console.log('\n=== it aborts rather than write into the wrong columns ===');
{
  const bad = H.slice(); bad[18] = 'Something Else';
  const r = run([withRaw(GOOD)], bad);
  check('shifted column -> ABORT, nothing written',
        r.log.indexOf('ABORT') > -1 && cell(r.grid,'CATEGORY') === '', r.log.split('\n')[0]);
}

console.log('\n=== 🔴 the shape MAKE actually sends (every value a STRING) ===');
{
  // Make has no serialiser — toJSON() does not exist (proven live, 19 Aug). The
  // blueprint therefore builds the JSON by concatenation with escapeJSON(), which
  // quotes EVERY value, numbers and booleans included. Until now every test here
  // used native types, so the real payload shape was never exercised.
  const MAKE = JSON.stringify({
    category: 'Department correspondence',
    is_department_request: 'true',      // string, not boolean
    client_name: 'A CLIENT', subclass: '500',
    letter_date: '2026-08-14',
    days_allowed: '28',                 // string, not number
    due_date: '2026-09-12', internal_due_date: '2026-09-10',
    deadline_sentence: 'You have 28 days starting on the day after we emailed this request.',
    trn: 'EGP9XF6H64', application_id: '1540713558', file_number: 'BCC2025/7294045',
    confidence: '0.96',                 // string, not number
    needs_review: 'false'               // string, not boolean
  });
  const r = run([withRaw(MAKE)]);
  check('"true" is honoured as a Department request', cell(r.grid,'CATEGORY') === 'Department correspondence');
  check('numeric string days_allowed transcribes', cell(r.grid,'DAYS') === '28');
  check('numeric string confidence parses to a number', cell(r.grid,'CONF') === '0.96', cell(r.grid,'CONF'));
  check('🔴 "false" does NOT read as truthy -> not flagged', cell(r.grid,'REVIEW') === '', cell(r.grid,'REVIEW'));
  check('the legal date still transcribes verbatim', cell(r.grid,'DUE') === '2026-09-12');

  // If content[1] is not the tool_use block, escapeJSON yields empty for every field.
  // That must be VISIBLE, never a quiet blank row.
  const EMPTY = JSON.stringify(Object.fromEntries(
    ['category','is_department_request','client_name','subclass','letter_date','days_allowed',
     'due_date','internal_due_date','deadline_sentence','trn','application_id','file_number',
     'confidence','needs_review'].map(k => [k, ''])));
  const e = run([withRaw(EMPTY)]);
  check('🔴 all-empty payload -> UNCATEGORISED, not blank', cell(e.grid,'CATEGORY') === 'UNCATEGORISED', cell(e.grid,'CATEGORY'));
  check('🔴 all-empty payload -> flagged for review', cell(e.grid,'REVIEW') === 'YES');
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
