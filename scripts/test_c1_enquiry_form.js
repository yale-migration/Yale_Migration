// Loads the REAL c1_enquiry_form_intake.gs and runs its self-test under stubs.
// Same shape as test_m5_dormancy.js / test_m8_lead_followup.js — one convention, not two.
//
// 🔑 Why the checks live INSIDE the .gs here, unlike the other modules:
// `runC1SelfTest()` doubles as a DEPLOYMENT probe. D-339 — m8_lead_followup.gs read
// "✅ COMPLETE" in our own tracking for a day while the file was not in the Apps Script
// project at all, and that was caught only because a trigger install failed against a
// function that did not exist. A self-test you can run IN the editor proves the file is
// actually there. This wrapper is what makes it run locally too.
const fs = require('fs');
const DIR = __dirname + '/';
const SRC = fs.readFileSync(DIR + 'c1_enquiry_form_intake.gs', 'utf8');

const LOG = [];
global.Logger = { log: m => LOG.push(String(m)) };
// Hostile stubs on purpose: if a "pure" test reaches a sheet it must fail loudly, not
// receive a plausible empty value and pass for the wrong reason.
const refuse = what => () => { throw new Error('touched ' + what + ' — this test is not pure'); };
global.SpreadsheetApp = { getActive: refuse('SpreadsheetApp'), openById: refuse('SpreadsheetApp') };
global.LockService = { getDocumentLock: () => ({ waitLock() {}, releaseLock() {} }) };

try {
  (0, eval)(SRC + '\n;runC1SelfTest();');
} catch (e) {
  console.log(LOG.join('\n'));
  console.error('\n❌ ' + e.message);
  process.exit(1);
}
console.log(LOG.join('\n'));
// ⚠️ the self-test logs '\n21/21 checks passed', so the line is NOT anchored at ^.
// The first version of this wrapper anchored it, reported a false failure against a
// genuinely passing suite, and run_all_tests.sh caught it on its first run.
const last = (LOG[LOG.length - 1] || '').trim();
const m = last.match(/(\d+)\/(\d+) checks passed$/);
if (!m || m[1] !== m[2]) { console.error('\n❌ ' + last); process.exit(1); }
