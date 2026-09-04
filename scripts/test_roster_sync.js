/**
 * THE CONSULTANT ROSTER IS DEFINED FOUR TIMES. This proves the four agree.
 *   node scripts/test_roster_sync.js
 *
 * 🔴 WHY THIS EXISTS. Every one of these is a locked dropdown built with
 * `requireValueInList(...).setAllowInvalid(false)`, which **refuses a value that
 * is not on its list and does so in silence** — the cell simply stays empty and
 * the write reports success. That is LESSONS § 3, and it has already bitten this
 * project four times (SBS/Nomination D-138 · GOPI A-33 · Citizenship D-353 ·
 * Skills Authority D-403).
 *
 * ⛔ So adding one new consultant means editing FOUR files. Miss one and that
 * person can be assigned in three tabs and not the fourth, with no error
 * anywhere — you find out when a client is invisible to the consultant who owns
 * them.
 *
 * RJ said "we have new hires" on 28 Aug (A-45). This runs before that edit, not
 * after it.
 *
 * 🔑 The real fix is D-355: read the roster from a tab THEY maintain, so a
 * joiner is a row they add rather than a code change we make. Until that is
 * quoted and built, this test is the guard rail.
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`);
  ok ? pass++ : fail++;
};
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
const names = (s) => (s.match(/'([^']+)'/g) || []).map((x) => x.slice(1, -1)).filter((n) => n !== 'Unassigned');

function fromMap(src, varName, key) {
  const b = src.match(new RegExp(`var ${varName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`));
  if (!b) return null;
  const m = b[1].match(new RegExp(`^\\s*${key}:\\s*\\[([\\s\\S]*?)\\](?=\\s*,?\\s*(?://|$))`, 'm'));
  return m ? names(m[1]) : null;
}
function fromArray(src) {
  const m = src.match(/\['Robinder'[\s\S]*?'Unassigned'\]/);
  return m ? names(m[0]) : null;
}

const master = read('setup_master_sheet.gs');
const rosters = {
  'MASTER · Assigned Consultant': fromMap(master, 'MASTER_DROPDOWNS', 12),
  'ENQUIRIES · Assigned To':      fromMap(master, 'ENQUIRY_DROPDOWNS', 8),
  'CALL LOG':                     fromArray(read('setup_call_log_tab.gs')),
  'S56 TRACKER':                  fromArray(read('setup_s56_tracker_tab.gs')),
};


console.log('=== the consultant roster, in every place it is defined ===');
for (const [k, v] of Object.entries(rosters)) {
  check(`${k} — parsed`, Array.isArray(v) && v.length > 0,
        v ? `${v.length} names` : 'PARSE FAILED — the shape changed, fix this test before trusting it');
}

const base = rosters['MASTER · Assigned Consultant'];
if (base) {
  for (const [k, v] of Object.entries(rosters)) {
    if (!v) continue;
    const missing = base.filter((n) => !v.includes(n));
    const extra = v.filter((n) => !base.includes(n));
    check(`${k} matches MASTER exactly`, missing.length === 0 && extra.length === 0,
          [missing.length ? `missing ${missing.join(', ')}` : '',
           extra.length ? `extra ${extra.join(', ')}` : ''].filter(Boolean).join(' · ') || `${v.length} names`);
  }
}

// ⛔ M6 routes enquiries to a person. A name it can produce that the dropdown
// refuses would be written and silently dropped.
const m6 = read('m6_enquiry_triage.gs');
const who = [...m6.matchAll(/who:\s*'([^']+)'/g)].map((x) => x[1]);
check('M6 has a routing roster', who.length > 0, `${who.length} routes`);
const unknown = [...new Set(who)].filter((n) => base && !base.includes(n));
check('every consultant M6 can route to exists in the MASTER dropdown',
      unknown.length === 0,
      unknown.length ? `🔴 ${unknown.join(', ')} would be REFUSED by the cell` : [...new Set(who)].join(', '));


/* ─────────────────────────────────────────────────────────────────────────────
 * DEPARTED STAFF  (D-439)
 *
 * Four roster changes in three weeks — Mershe, Gopi in and out, three hires,
 * now Inder — and the M6 suite referenced NONE of them. Removing Inder's route
 * left all 46 triage checks green, because not one of them named him or any of
 * the six PR subclasses he owned. The suite was blind exactly where the roster
 * moves most.
 *
 * A leaver needs TWO OPPOSITE things to be true, and only asserting both catches
 * a half-done departure:
 *   1. GONE from routing   — or new enquiries are handed to someone who has left.
 *   2. STILL in dropdowns  — or their existing rows are refused at paste in
 *      silence, which is D-353. **Inder holds 8 of the 38 importing clients.**
 *
 * ⚠️ These checks EXECUTE m6AssignTo_ rather than grepping for `who:`. The text
 * check above proves a name is spelled consistently; only running the function
 * proves where an enquiry actually lands, and the two can disagree — a route can
 * be present and unreachable because an earlier rule matched first.
 * ─────────────────────────────────────────────────────────────────────────── */
const refuse = (n) => () => { throw new Error(n + ' must not be called in a unit test'); };
global.SpreadsheetApp = { getActive: refuse('SpreadsheetApp'), openById: refuse('SpreadsheetApp') };
(0, eval)(m6);

const DEPARTED = ['Inder', 'Mershe', 'Gopi'];
DEPARTED.forEach((name) => {
  check(
    `departed: ${name} receives no NEW work via M6`,
    M6_ROSTER.every((r) => r.who !== name),
    M6_ROSTER.some((r) => r.who === name) ? `M6_ROSTER still routes to ${name}, who has left` : ''
  );
});

/* Inder alone is asserted to REMAIN selectable: he is the only leaver with live
 * rows (8). Mershe and Gopi never reached a client record, so pinning their
 * names into the dropdown forever would be cargo cult. */
check(
  'departed: Inder is STILL offered by the MASTER dropdown (8 clients hold his name)',
  rosters['MASTER · Assigned Consultant'].includes('Inder'),
  rosters['MASTER · Assigned Consultant'].includes('Inder')
    ? ''
    : 'REMOVED from the dropdown — his 8 existing rows will be REJECTED at paste (D-353)'
);

/* The hole his departure leaves, asserted rather than assumed. When someone
 * fills these routes this test FAILS and asks to be updated — which is the
 * point: the gap must never close by accident, and must never widen unnoticed. */
['189', '190', '491', '482', '494', '186'].forEach((v) => {
  const got = m6AssignTo_('', 'INDIAN', v);
  check(
    `Indian PR ${v} is Unassigned until Robinder names Inder's successor`,
    got === 'Unassigned',
    got === 'Unassigned' ? '' : `now routes to ${got} — if intended, update D-439 and this check`
  );
});

/* ⛔ Guard against the opposite error. Proving those six are Unassigned is
 * worthless if EVERYTHING became Unassigned — that is a check passing for the
 * wrong reason. Two routes that must still work. */
check('routing still works: Filipino 500 -> Star',  m6AssignTo_('', 'FILIPINO', '500') === 'Star');
check('routing still works: Indian 500 -> Gayatri', m6AssignTo_('', 'INDIAN',   '500') === 'Gayatri');

console.log(`\n${pass}/${pass + fail} checks passed`);
process.exit(fail === 0 ? 0 : 1);
