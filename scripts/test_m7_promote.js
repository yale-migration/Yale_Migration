// Loads the REAL m7_callback_queue.gs against fake CALL LOG + ENQUIRIES tabs.
// The promotion is the only part of M7 with state to get wrong, so it is the part
// that gets hammered: promote once, never twice, and never lose a lead.
const fs = require('fs');
const DIR = "/Users/muhammadsharjeel/Downloads/SOP'S/yale-build/scripts/";
const SRC = fs.readFileSync(DIR + 'm7_callback_queue.gs', 'utf8');

let LOG = [];
const Logger = { log: m => LOG.push(String(m)) };
const Utilities = { formatDate: (d) => new Date(d).toISOString().slice(0, 10) };
const Session = { getScriptTimeZone: () => 'Australia/Brisbane' };

// A..T — mirrors setup_call_log_tab.gs. The intake block (Email/Location/Visa Interest)
// went in at F/G/H on 22 Aug and shifted everything from Matched Code rightwards by three.
const CL_H = ['Received','Caller Name','Phone','New or Existing','Reason',
  'Email','Location','Visa Interest',
  'Matched Code','Matched Client','Matched On','Outstanding','ID Verified','Best Callback',
  'Callback Due','Callback Status','Handled By','Becomes Enquiry','Promoted','Notes'];
const EQ_H = ['Date','Name','Phone','Email','Channel','Visa Interest','Location',
  'Assigned To','Status','Follow-up Due','Notes'];

const C = { RECEIVED:0, NAME:1, PHONE:2, REASON:4,
            EMAIL:5, LOCATION:6, VISA:7,
            MATCHEDON:10, IDVER:12, CBDUE:14, CBSTATUS:15, HANDLEDBY:16,
            BECOMES:17, PROMOTED:18 };
const E = { DATE:0, NAME:1, PHONE:2, EMAIL:3, CHANNEL:4, VISA:5, LOCATION:6,
            ASSIGNED:7, STATUS:8, DUE:9, NOTES:10 };

function call(o = {}) {
  const r = new Array(20).fill('');
  r[C.RECEIVED]  = o.received || new Date('2026-08-19T10:00:00');
  r[C.NAME]      = o.name === undefined ? 'A CALLER' : o.name;
  r[C.PHONE]     = o.phone === undefined ? '0400111222' : o.phone;
  r[C.REASON]    = o.reason || '';
  r[C.MATCHEDON] = o.matchedOn || '';
  r[C.IDVER]     = o.idVerified || '';
  r[C.CBDUE]     = o.cbDue || '';
  r[C.CBSTATUS]  = o.cbStatus || '';
  r[C.HANDLEDBY] = o.handledBy || '';
  r[C.EMAIL]     = o.email || '';
  r[C.LOCATION]  = o.location || '';
  r[C.VISA]      = o.visa || '';
  r[C.BECOMES]   = o.becomes || '';
  r[C.PROMOTED]  = o.promoted || '';
  return r;
}

function sheet(header, rows) {
  const grid = [header.slice()].concat(rows.map(r => r.slice()));
  return {
    getLastRow: () => { for (let i = grid.length - 1; i >= 0; i--)
                          if (grid[i].some(c => String(c ?? '') !== '')) return i + 1;
                        return 0; },
    getLastColumn: () => header.length,
    getRange: (r, c, nr = 1, nc = 1) => ({
      getValues: () => { const o = [];
        for (let i = 0; i < nr; i++) { const line = [];
          for (let j = 0; j < nc; j++) { while (grid.length <= r - 1 + i) grid.push(new Array(header.length).fill(''));
            line.push(grid[r - 1 + i][c - 1 + j] ?? ''); } o.push(line); } return o; },
      setValues: v => { for (let i = 0; i < nr; i++) {
          while (grid.length <= r - 1 + i) grid.push(new Array(header.length).fill(''));
          for (let j = 0; j < nc; j++) grid[r - 1 + i][c - 1 + j] = v[i][j]; } }
    }),
    _grid: grid
  };
}

function run(calls, opts = {}) {
  LOG = [];
  const cl = sheet(opts.clHeader || CL_H, calls);
  const eq = sheet(opts.eqHeader || EQ_H, opts.existingEnquiries || []);
  const SpreadsheetApp = {
    openById: () => ({ getSheetByName: n => (n === 'CALL LOG' ? cl : n === 'ENQUIRIES' ? eq : null) }),
    flush() {}
  };
  const LockService = { getDocumentLock: () => ({ tryLock: () => opts.lock !== false, releaseLock() {} }) };
  new Function('SpreadsheetApp','Logger','LockService','Utilities','Session',
    SRC + '\n; promoteCallsToEnquiries();')(SpreadsheetApp, Logger, LockService, Utilities, Session);
  return { cl: cl._grid, eq: eq._grid, log: LOG.join('\n') };
}

let pass = 0, fail = 0;
const check = (l, ok, d) => { console.log((ok ? '  PASS  ' : '  FAIL  ') + l + (d ? '   — ' + d : ''));
  ok ? pass++ : fail++; };
// Count by name OR phone. Counting by name alone made a phone-only lead invisible to
// the test and reported a correct promotion as a failure — the harness lying, not the code.
const leads = g => g.slice(1).filter(r => String(r[E.NAME] ?? '') !== ''
                                       || String(r[E.PHONE] ?? '') !== '');

console.log('=== only rows marked Yes cross over ===');
{
  const r = run([call({ name: 'YES ONE', becomes: 'Yes' }),
                 call({ name: 'NO ONE',  becomes: 'No' }),
                 call({ name: 'BLANK ONE' }),
                 call({ name: 'EXISTING', becomes: 'Already a client' })]);
  check('exactly one lead created', leads(r.eq).length === 1, leads(r.eq).length + ' created');
  check('...and it is the right one', leads(r.eq)[0][E.NAME] === 'YES ONE');
  check('an existing client is NOT put in the lead pipeline',
        !leads(r.eq).some(x => x[E.NAME] === 'EXISTING'));
}

console.log('\n=== 🔴 promote ONCE — twice means two nurture clocks ===');
{
  let calls = [call({ name: 'ONCE ONLY', becomes: 'Yes' })];
  let r = run(calls);
  check('first run creates the lead', leads(r.eq).length === 1);
  check('...and stamps Promoted', String(r.cl[1][C.PROMOTED]) !== '');

  // Feed the stamped CALL LOG back in, five times, exactly as a re-run would see it.
  let carried = r.cl.slice(1);
  for (let i = 0; i < 5; i++) r = run(carried, { existingEnquiries: leads(r.eq) });
  check('🔴 five more runs create NO second lead', leads(r.eq).length === 1,
        leads(r.eq).length + ' leads');
  check('log says it was skipped as already promoted', /already promoted[^\n]*[1-9]/.test(r.log),
        r.log.split('\n').find(l => l.includes('already promoted')));
}

console.log('\n=== the ENQUIRIES row M8 has to be able to work with ===');
{
  const r = run([call({ name: 'MAPPED', phone: '0400999888', reason: 'asking about 485',
                        handledBy: 'RJ', becomes: 'Yes' })]);
  const row = leads(r.eq)[0];
  check('name carried',    row[E.NAME] === 'MAPPED');
  check('phone carried',   row[E.PHONE] === '0400999888');
  check('Channel = Phone (a real value in their dropdown)', row[E.CHANNEL] === 'Phone');
  check('assigned to whoever took the call', row[E.ASSIGNED] === 'RJ');
  check('unhandled call falls back to Unassigned',
        leads(run([call({ name: 'X', becomes: 'Yes' })]).eq)[0][E.ASSIGNED] === 'Unassigned');
  check('the reason is carried into Notes', String(row[E.NOTES]).includes('asking about 485'));
  check('Notes says where it came from', String(row[E.NOTES]).includes('CALL LOG'));

  // The two deliberate blanks. Both are other systems' jobs.
  check('⛔ Status left BLANK — the consultant judges it, nothing infers it',
        row[E.STATUS] === '', JSON.stringify(row[E.STATUS]));
  check('⛔ Follow-up Due left BLANK — M8 owns the whole 7/30 clock',
        row[E.DUE] === '', JSON.stringify(row[E.DUE]));
}

console.log('\n=== it appends, it never overwrites an existing lead ===');
{
  const existing = [['2026-08-01','OLD LEAD','0499','a@b.c','Website','500','Onshore','RJ','New','','']];
  const r = run([call({ name: 'NEW LEAD', becomes: 'Yes' })], { existingEnquiries: existing });
  check('the existing lead survives untouched',
        r.eq.some(x => x[E.NAME] === 'OLD LEAD' && x[E.EMAIL] === 'a@b.c'));
  check('the new lead is added below it', leads(r.eq).length === 2);
}

console.log('\n=== 🔴 it refuses rather than write into the wrong columns ===');
{
  const badEq = EQ_H.slice(); badEq[4] = 'Something Else';   // Channel moved
  const r1 = run([call({ name: 'X', becomes: 'Yes' })], { eqHeader: badEq });
  check('shifted ENQUIRIES column -> ABORT, no lead written',
        /ABORT/.test(r1.log) && leads(r1.eq).length === 0, r1.log.split('\n')[0]);
  check('...and CALL LOG is not stamped either', String(r1.cl[1][C.PROMOTED]) === '');

  // ⚠️ Was hardcoded as badCl[15]. The intake block moved 'Promoted' to 19 and index 15
  // became 'Callback Status', which the guard does not check — so this negative test
  // quietly stopped testing anything and reported PASS. Derived from the name now.
  const badCl = CL_H.slice(); badCl[CL_H.indexOf('Promoted')] = 'Something Else';
  const r2 = run([call({ name: 'X', becomes: 'Yes' })], { clHeader: badCl });
  check('shifted CALL LOG column -> ABORT', /ABORT/.test(r2.log) && leads(r2.eq).length === 0);
}

console.log('\n=== the lock ===');
{
  const r = run([call({ name: 'LOCKED OUT', becomes: 'Yes' })], { lock: false });
  check('🔴 lock denied -> nothing written to ENQUIRIES', leads(r.eq).length === 0);
  check('lock denied -> nothing stamped in CALL LOG', String(r.cl[1][C.PROMOTED]) === '');
  check('lock denied -> says so', /ABORT.*document lock/.test(r.log), r.log.split('\n')[0]);
}

console.log('\n=== blank and unusable rows ===');
{
  const r = run([call({ name: '', phone: '', becomes: 'Yes' }),
                 call({ name: 'REAL', becomes: 'Yes' })]);
  check('a row with no name AND no phone creates no lead', leads(r.eq).length === 1);
  check('...and the usable one still goes through', leads(r.eq)[0][E.NAME] === 'REAL');
  const p = run([call({ name: '', phone: '0400123456', becomes: 'Yes' })]);
  check('phone but no name IS promotable — M8 can still ring them',
        leads(p.eq).length === 1, leads(p.eq).length + ' created');
}

console.log('\n=== the intake block — the three fields promote could not fill before ===');
{
  const r = run([call({ becomes:'Yes', name:'INTAKE ONE', email:'x@example.com',
                        location:'Offshore', visa:'Graduate Visa · Skills Assessment' })]);
  const L = leads(r.eq)[0];
  check('email crosses over', L[E.EMAIL] === 'x@example.com', L[E.EMAIL]);
  check('visa interest crosses over VERBATIM, not translated to a subclass',
        L[E.VISA] === 'Graduate Visa · Skills Assessment', L[E.VISA]);
  check('location crosses over', L[E.LOCATION] === 'Offshore', L[E.LOCATION]);
  // 🔴 ENQUIRIES G is setAllowInvalid(false). Anything not exactly Onshore/Offshore must be
  // dropped, or the cell refuses the whole write silently — D-353.
  const bad = leads(run([call({ becomes:'Yes', name:'BAD LOC', location:'Dubai' })]).eq)[0];
  check('🔴 an off-list location is DROPPED, not passed into a locked cell',
        bad[E.LOCATION] === '', bad[E.LOCATION]);
  check('...and is preserved in Notes so nothing is lost',
        String(bad[E.NOTES]).indexOf('Dubai') > -1, bad[E.NOTES]);
  const empty = leads(run([call({ becomes:'Yes', name:'NO INTAKE' })]).eq)[0];
  check('a call with no intake answers still promotes', empty[E.NAME] === 'NO INTAKE');
  check('...leaving the three fields blank rather than inventing them',
        empty[E.EMAIL] === '' && empty[E.VISA] === '' && empty[E.LOCATION] === '');
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail === 0 ? 0 : 1);
