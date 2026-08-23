/**
 * Every .gs file must LOAD without throwing — together, in one scope, as Apps Script does.
 *
 * 🔴 WHY THIS EXISTS (22 Aug 2026)
 * `setup_call_log_tab.gs` was edited to derive CL_HELPER_PHONE from CL_HEADERS.length, and
 * the derived line was placed ABOVE the array. `var` hoists the declaration and never the
 * value, so CL_HEADERS was `undefined` at that line and the file threw at load.
 *
 * That is not a one-file problem. Apps Script gives every .gs in a project ONE global scope
 * and runs all top-level statements before any function — so a throw in one file breaks
 * EVERY function in the project, including the M5 and M8 daily triggers that are live right
 * now. A syntax-clean file that throws on load is invisible to reading, to `node --check`,
 * and to every other suite here, because those all call one function in one file.
 *
 * ⛔ This proves LOAD only. It does not run anything. A file can load fine and still be wrong.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.gs')).sort();

// Apps Script globals. Deliberately inert rather than hostile: we are testing that the file
// LOADS, and a file that calls SpreadsheetApp at top level would be a different bug.
const g = global;
g.SpreadsheetApp = new Proxy({}, { get: () => () => ({}) });
g.LockService = { getDocumentLock: () => ({}), getScriptLock: () => ({}) };
g.Logger = { log() {} };
g.Utilities = { formatDate: () => '', sleep() {} };
g.Session = { getScriptTimeZone: () => 'Australia/Brisbane', getActiveUser: () => ({ getEmail: () => '' }) };
g.ScriptApp = { newTrigger: () => ({}), getProjectTriggers: () => [] };
g.DriveApp = {}; g.GmailApp = {}; g.UrlFetchApp = {}; g.PropertiesService = {};
g.HtmlService = {}; g.CacheService = {}; g.UrlFetchApp = {};

let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '   — ' + detail : ''));
  ok ? pass++ : fail++;
};

console.log('=== every .gs loads on its own ===');
const sources = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  sources.push({ f, src });
  try {
    // Fresh function scope per file: catches self-contained load errors like the
    // hoisting one, without cross-file globals masking them.
    new Function(src)();
    check(f, true);
  } catch (e) {
    // A reference to a global another file defines is legitimate — Apps Script shares
    // one scope. Anything else is a real load failure.
    const crossFile = e instanceof ReferenceError;
    check(f, crossFile, crossFile ? 'defers to another file: ' + e.message : '🔴 ' + e.message);
  }
}

console.log('\n=== and all of them together, the way Apps Script actually loads them ===');
try {
  (0, eval)(sources.map(s => s.src).join('\n;\n'));
  check('the whole project evaluates in one shared scope', true, files.length + ' files');
} catch (e) {
  check('the whole project evaluates in one shared scope', false, '🔴 ' + e.message);
}

// 🔑 The specific trap that produced this file. Guards the fix, not just the symptom.
console.log('\n=== derived positions resolve to real numbers, not NaN ===');
try {
  check('CL_HELPER_PHONE is a number past the last header',
        typeof CL_HELPER_PHONE === 'number' && CL_HELPER_PHONE === CL_HEADERS.length + 1,
        String(CL_HELPER_PHONE));
  check('CL_HELPER_NAME sits immediately after it',
        CL_HELPER_NAME === CL_HELPER_PHONE + 1, String(CL_HELPER_NAME));
  check('M7_CL_WIDTH equals the last CALL LOG column',
        M7_CL_WIDTH === CL_HEADERS.length, M7_CL_WIDTH + ' vs ' + CL_HEADERS.length);
} catch (e) {
  check('derived positions are evaluable', false, e.message);
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
process.exit(fail ? 1 : 0);
