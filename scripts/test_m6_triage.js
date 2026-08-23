// Loads the REAL m6_enquiry_triage.gs and runs its self-test under stubs.
// Same convention as the other suites — one way to run a test, not two.
const fs = require('fs');
const SRC = fs.readFileSync(__dirname + '/m6_enquiry_triage.gs', 'utf8');
const LOG = [];
global.Logger = { log: m => LOG.push(String(m)) };
const refuse = w => () => { throw new Error('touched ' + w + ' — this test is not pure'); };
global.SpreadsheetApp = { getActive: refuse('SpreadsheetApp'), openById: refuse('SpreadsheetApp') };
global.LockService = { getDocumentLock: () => ({ waitLock() {}, releaseLock() {} }) };
try { (0, eval)(SRC + '\n;runM6SelfTest();'); }
catch (e) { console.log(LOG.join('\n')); console.error('\n❌ ' + e.message); process.exit(1); }
console.log(LOG.join('\n'));
const last = (LOG[LOG.length - 1] || '').trim();
const m = last.match(/(\d+)\/(\d+) checks passed$/);
if (!m || m[1] !== m[2]) { console.error('\n❌ ' + last); process.exit(1); }
