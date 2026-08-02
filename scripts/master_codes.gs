/**
 * Yale Migration — MASTER DATABASE: client-code engine
 * Sheet: "MASTER" | A Client Code · B Their Client ID · C Full Name · … · T Date Added
 *
 * Why two triggers:
 *  - onEdit fires when a HUMAN types (instant feedback)
 *  - assignMissingCodes() also runs on a 5-minute timer, because Apps Script
 *    onEdit does NOT fire for rows created via API/automation (Make).
 *
 * Setup (one time):
 *  1. Extensions -> Apps Script, paste this file, Save.
 *  2. Run assignMissingCodes() once and Allow permissions.
 *  3. Triggers (clock icon) -> Add trigger -> assignMissingCodes -> Time-driven
 *     -> Minutes timer -> Every 5 minutes -> Save.
 */

var SHEET_NAME   = 'MASTER';
var CODE_PREFIX  = 'YM-2026-';
// Column positions follow MASTER-SHEET-SPEC v2 (reconciled with the client's tracker, 29 Jul 2026)
var COL_CODE     = 1;  // A  Client Code
var COL_NAME     = 3;  // C  Full Name  (B = their CL-### id)
var COL_DATE     = 20; // T  Date Added
var FIRST_ROW    = 2;  // row 1 = headers
var CODE_RE      = /^YM-\d{4}-\d{5}$/;   // what a REAL code looks like (D-145)

/** Fires when someone types in the sheet. */
function onEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== SHEET_NAME) return;
  if (e.range.getColumn() !== COL_NAME) return; // only react to Full Name
  assignMissingCodes();
}

/**
 * Assigns a code + Date Added to every row that has a name but no code.
 *
 * LOCKING (added 2026-08-02, D-135): onEdit and the 5-minute timer can fire at the SAME moment —
 * and two fast edits fire two onEdit runs. Without a lock, both read the same "highest existing
 * number" and hand out the SAME code to two different clients. A duplicate client code would
 * corrupt the folder link, the tracker cross-reference and every downstream scenario, and it is
 * almost invisible until someone notices two clients sharing an ID. The lock makes that impossible.
 */
function assignMissingCodes() {
  var lock = LockService.getDocumentLock();
  // 10s, not 20s: a simple onEdit trigger has a hard 30-second budget (D-145). If the timer holds
  // the lock we return immediately and the next 5-minute tick covers the row.
  if (!lock.tryLock(10000)) return;
  try {
    assignMissingCodes_();
  } finally {
    lock.releaseLock();
  }
}

function assignMissingCodes_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) return;

  var lastRow = sh.getLastRow();
  if (lastRow < FIRST_ROW) return;

  var n = lastRow - FIRST_ROW + 1;
  var codes = sh.getRange(FIRST_ROW, COL_CODE, n, 1).getValues();
  var names = sh.getRange(FIRST_ROW, COL_NAME, n, 1).getValues();
  var dates = sh.getRange(FIRST_ROW, COL_DATE, n, 1).getValues();

  var next = nextNumber_(codes);
  var wrote = 0;

  for (var i = 0; i < n; i++) {
    var hasName  = String(names[i][0]).trim() !== '';
    // A cell counts as "already coded" ONLY if it holds a REAL code. A legacy v1 formula result or a
    // stray test value would otherwise suppress the code forever and silently fail the T2 test (D-145).
    var hasCode  = CODE_RE.test(String(codes[i][0]).trim());
    if (!hasName || hasCode) continue;

    // Write CELL BY CELL, never whole columns. A column-wide setValues() would flatten any formula in
    // A or T into a static value and clobber concurrent human/Make edits between read and write (D-145).
    sh.getRange(FIRST_ROW + i, COL_CODE).setValue(CODE_PREFIX + pad_(next, 5));
    next++;
    wrote++;
    if (String(dates[i][0]).trim() === '') {
      sh.getRange(FIRST_ROW + i, COL_DATE).setValue(new Date());
    }
  }

  if (wrote) SpreadsheetApp.flush();   // commit inside the lock
}

/**
 * Safety net — run manually any time to prove no code was ever issued twice.
 * Logs duplicates and returns them. Expected output: "No duplicate codes ✅".
 */
function auditDuplicateCodes() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < FIRST_ROW) return [];
  var vals = sh.getRange(FIRST_ROW, COL_CODE, sh.getLastRow() - FIRST_ROW + 1, 1).getValues();
  var seen = {}, dups = [];
  for (var i = 0; i < vals.length; i++) {
    var v = String(vals[i][0]).trim();
    if (!v) continue;
    if (seen[v]) { dups.push(v + ' (rows ' + seen[v] + ' and ' + (i + FIRST_ROW) + ')'); }
    else { seen[v] = i + FIRST_ROW; }
  }
  Logger.log(dups.length ? 'DUPLICATE CODES: ' + dups.join(' | ') : 'No duplicate codes ✅');
  return dups;
}

/** Highest existing number + 1 (never reuses a code, even after deletions). */
function nextNumber_(codes) {
  var max = 0;
  for (var i = 0; i < codes.length; i++) {
    var v = String(codes[i][0]).trim();
    if (CODE_RE.test(v)) {                       // strict — ignores legacy/partial values (D-145)
      var num = parseInt(v.substring(CODE_PREFIX.length), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  }
  return max + 1;
}

function pad_(num, size) {
  var s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}
