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
    setHighWater_(next);              // retire the number the moment it is issued
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

var HIGH_WATER_KEY = 'YM_CODE_HIGH_WATER';

/**
 * Highest number ever ISSUED + 1.
 *
 * 🔴 FIXED 17 Aug (D-324). The old comment on this function read "never reuses a code,
 * even after deletions" — and the code did the exact opposite. It took the maximum of
 * the codes CURRENTLY IN THE SHEET. Delete the highest-numbered client and the next new
 * client is handed that same code.
 *
 * That is not cosmetic. The client code is quoted TO THE CLIENT: M4b's checklist email
 * and M4 route C's chase email both say "Your reference for this matter is <code>".
 * Two different people, same reference, and the sheet cannot tell them apart afterwards
 * — auditDuplicateCodes() would find nothing, because only one of them still exists.
 *
 * A wrong comment is worse than no comment: it is the thing a reviewer trusts instead
 * of reading the four lines underneath it. Nobody had read them since 2 Aug.
 *
 * The fix is a high-water mark in document properties, which survives row deletion.
 * We take the larger of it and the sheet, so an existing sheet is never regressed and
 * the property can be lost without issuing a duplicate.
 */
function nextNumber_(codes) {
  var max = 0;
  for (var i = 0; i < codes.length; i++) {
    var v = String(codes[i][0]).trim();
    if (CODE_RE.test(v)) {                       // strict — ignores legacy/partial values (D-145)
      var num = parseInt(v.substring(CODE_PREFIX.length), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  }
  var stored = parseInt(
    PropertiesService.getDocumentProperties().getProperty(HIGH_WATER_KEY) || '0', 10);
  if (isNaN(stored)) stored = 0;
  return Math.max(max, stored) + 1;
}

/** Remember the highest number issued, so deleting rows can never free a code. */
function setHighWater_(n) {
  var props = PropertiesService.getDocumentProperties();
  var stored = parseInt(props.getProperty(HIGH_WATER_KEY) || '0', 10);
  if (isNaN(stored) || n > stored) props.setProperty(HIGH_WATER_KEY, String(n));
}


/**
 * Run ONCE, immediately after removeDemoRows() and BEFORE the real import.
 *
 * The 14 demo rows burned YM-2026-00001 … 00014. With the high-water mark above in
 * place those numbers are now retired, so the first real client would be 00015 and
 * Yale's numbering would start at fifteen for no reason they could ever be told.
 *
 * Demo codes were never issued to a person and never left this spreadsheet, so they
 * are the one case where resetting is safe. This recomputes the mark from what is
 * actually in the sheet right now.
 *
 * ⛔ REFUSES TO RUN if any demo row is still present — resetting first and deleting
 * afterwards would hand real clients the demo numbers all over again.
 * ⛔ REFUSES TO RUN if a real coded client already exists — at that point a reset
 * could reissue a code that has already been emailed to somebody.
 */
function resetCodeSequence() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }

  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sh) { Logger.log('ABORT — no tab named ' + SHEET_NAME); return; }

    var last = sh.getLastRow();
    var rows = last >= FIRST_ROW
      ? sh.getRange(FIRST_ROW, 1, last - FIRST_ROW + 1, 6).getValues() : [];

    var demoLeft = 0, coded = 0, max = 0;
    rows.forEach(function (r) {
      var code = String(r[0] || '').trim();
      var name = String(r[2] || '').trim();
      var mail = String(r[5] || '').trim().toLowerCase();
      if (!name) return;
      if (mail.indexOf('@example.com') > -1) { demoLeft++; return; }
      if (CODE_RE.test(code)) {
        coded++;
        var num = parseInt(code.substring(CODE_PREFIX.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    });

    if (demoLeft) {
      Logger.log('ABORT — ' + demoLeft + ' demo row(s) still in the sheet.');
      Logger.log('Run removeDemoRows() FIRST, then come back. Resetting now would hand the');
      Logger.log('demo numbers straight back out to real clients.');
      return;
    }
    if (coded) {
      Logger.log('ABORT — ' + coded + ' real client(s) already hold codes (highest ' + max + ').');
      Logger.log('Those codes may already be in emails to clients. Not resetting.');
      Logger.log('The sequence will simply continue from ' + (max + 1) + ', which is correct.');
      return;
    }

    PropertiesService.getDocumentProperties().setProperty(HIGH_WATER_KEY, '0');
    Logger.log('Code sequence reset. The first real client will be ' + CODE_PREFIX + '00001.');
    Logger.log('From here the high-water mark is permanent — deleting a row can never free a code.');

  } finally {
    lock.releaseLock();
  }
}

function pad_(num, size) {
  var s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}
