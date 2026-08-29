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

console.log(`\n${pass}/${pass + fail} checks passed`);
process.exit(fail === 0 ? 0 : 1);
