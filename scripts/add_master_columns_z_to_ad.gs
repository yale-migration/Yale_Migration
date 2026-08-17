/**
 * E3 — add the five MASTER columns for the contracted items that were never
 * tracked: secure upload link, third-party responsible party, and
 * received / outstanding document status.  (D-311, D-315)
 *
 * ============================ READ THIS FIRST ============================
 * NEW COLUMNS GO STRICTLY TO THE RIGHT OF Y.  NEVER INSERT LEFT OF Y.
 *
 * M4 addresses MASTER by NUMERIC INDEX, not by header name:
 *      index 6 = G Location, 7 = H Visa Type, 21 = V Folder URL,
 *      23 = X Skills Authority, 24 = Y Checklist Filed
 * Insert one column anywhere left of Y and every one of those shifts by one.
 * M4 would then read the wrong field, file the WRONG CHECKLIST, and report
 * success.  No error, no log line, wrong document in the client's folder.
 *
 * Two known Apps Script traps this script defends against:
 *   1. insertColumnsAfter() INHERITS the left neighbour's data validation.
 *      That is exactly how column Y silently inherited column X's dropdown and
 *      blocked every write to `Checklist Filed` from the day it was created.
 *      Make was unaffected (the Sheets API ignores validation), which is why
 *      eight clean M4 runs never surfaced it.  We clear validation explicitly.
 *   2. setValues() is LAZY — validation fires at flush(), not at the call.
 *      So flush() goes INSIDE the try, or the exception escapes and leaves a
 *      partial write.
 *
 * Run addMasterColumns() once.  Then run verifyMasterColumns() and read the
 * log.  verifyMasterColumns() is safe to run any time and changes nothing.
 */

var SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var TAB = 'MASTER';

// The column that MUST be the rightmost one before we add anything.
var ANCHOR_INDEX = 25;              // Y
var ANCHOR_HEADER = 'Checklist Filed';

var NEW_COLUMNS = [
  { col: 'Z',  header: 'Docs Received',      note: 'Documents the client has actually supplied. Free text or a count.' },
  { col: 'AA', header: 'Docs Outstanding',   note: 'Documents still missing. This is what the M5 chase email lists.' },
  { col: 'AB', header: 'Third Party',        note: 'Who else has to act: employer, college, RTO, assessing authority.' },
  { col: 'AC', header: 'Third Party Status', note: 'Where that third party is up to.' },
  { col: 'AD', header: 'Upload Link',        note: 'Secure upload link sent to the client for this matter.' }
];

// Only ONE of the new columns gets a dropdown, and we set it deliberately.
var THIRD_PARTY_STATUS_VALUES = [
  'Not required', 'Requested', 'Waiting', 'Received', 'Chased', 'Escalated'
];


function addMasterColumns() {
  // 🔴 getDocumentLock(), NOT getScriptLock() (D-324). They are DIFFERENT mutexes.
  // master_codes.gs holds a DOCUMENT lock and runs on a 5-minute timer against this
  // same tab. A script lock does not exclude it — taking the wrong one is the same as
  // taking none, while looking in review exactly like it is handled.
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — another script holds the lock.'); return; }

  try {
    var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + TAB); return; }

    // ---- guard 0: getRange() throws past maxColumns, and a raw Apps Script
    // stack trace is a much worse message than being told what is wrong.
    if (sh.getMaxColumns() < ANCHOR_INDEX) {
      Logger.log('ABORT — sheet has only ' + sh.getMaxColumns() +
                 ' columns; expected at least ' + ANCHOR_INDEX + ' (through Y).');
      Logger.log('This is not the MASTER tab we built. Stop and look.');
      return;
    }

    // ---- guard 1: the sheet must look exactly the way we think it does -----
    var lastCol = sh.getLastColumn();
    var headers = sh.getRange(1, 1, 1, Math.max(lastCol, ANCHOR_INDEX)).getValues()[0];
    var anchor = String(headers[ANCHOR_INDEX - 1] || '').trim();

    if (anchor !== ANCHOR_HEADER) {
      Logger.log('ABORT — column Y is "' + anchor + '", expected "' + ANCHOR_HEADER + '".');
      Logger.log('The sheet has changed shape. Do NOT run this until M4 has been re-checked.');
      return;
    }

    // Already done?  Say so rather than adding a second copy.
    var existing = headers.map(function (h) { return String(h || '').trim(); });
    var already = NEW_COLUMNS.filter(function (c) { return existing.indexOf(c.header) > -1; });
    if (already.length) {
      Logger.log('ABORT — these headers already exist: ' +
                 already.map(function (c) { return c.header; }).join(', '));
      Logger.log('Run verifyMasterColumns() instead.');
      return;
    }

    if (lastCol > ANCHOR_INDEX) {
      Logger.log('ABORT — last column is ' + lastCol + ', expected ' + ANCHOR_INDEX + ' (Y).');
      Logger.log('Something is already right of Y. Look before adding more.');
      return;
    }

    // ---- add the columns ---------------------------------------------------
    var need = ANCHOR_INDEX + NEW_COLUMNS.length;   // 30 = AD
    if (sh.getMaxColumns() < need) {
      sh.insertColumnsAfter(sh.getMaxColumns(), need - sh.getMaxColumns());
    }

    var target = sh.getRange(1, ANCHOR_INDEX + 1, sh.getMaxRows(), NEW_COLUMNS.length);

    // Trap 1: kill anything inherited from column Y before writing a thing.
    target.clearDataValidations();
    target.clearNote();

    var written = [];
    var failed = [];
    for (var i = 0; i < NEW_COLUMNS.length; i++) {
      var c = NEW_COLUMNS[i];
      var cell = sh.getRange(1, ANCHOR_INDEX + 1 + i);
      try {
        cell.setValue(c.header);
        cell.setNote(c.note);
        SpreadsheetApp.flush();          // Trap 2: inside the try. This is where it throws.
        written.push(c.col + ' = ' + c.header);
      } catch (e) {
        failed.push(c.col + ' — ' + e.message);
      }
    }

    // ---- the one deliberate dropdown --------------------------------------
    try {
      var statusIdx = ANCHOR_INDEX + 1 + 3;         // AC
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(THIRD_PARTY_STATUS_VALUES, true)
        .setAllowInvalid(true)      // NOT false — setAllowInvalid(false) blocks
        .build();                   // Apps Script writes too, not just typing.
      sh.getRange(2, statusIdx, sh.getMaxRows() - 1, 1).setDataValidation(rule);
      SpreadsheetApp.flush();
      written.push('AC dropdown = ' + THIRD_PARTY_STATUS_VALUES.join(' / '));
    } catch (e) {
      failed.push('AC dropdown — ' + e.message);
    }

    // ---- cosmetics ---------------------------------------------------------
    try {
      sh.getRange(1, ANCHOR_INDEX + 1, 1, NEW_COLUMNS.length)
        .setFontWeight('bold').setBackground('#efefef');
      sh.setColumnWidths(ANCHOR_INDEX + 1, NEW_COLUMNS.length, 160);
      SpreadsheetApp.flush();
    } catch (e) {
      failed.push('formatting — ' + e.message);
    }

    Logger.log('WROTE ' + written.length + ':');
    written.forEach(function (w) { Logger.log('   ' + w); });
    if (failed.length) {
      Logger.log('FAILED ' + failed.length + ':');
      failed.forEach(function (f) { Logger.log('   ' + f); });
    }
    Logger.log('');
    Logger.log('Now run verifyMasterColumns().');

  } finally {
    lock.releaseLock();
  }
}


/**
 * Proves the sheet is in the state M4 and the dashboard expect.
 * Changes nothing. Run it after addMasterColumns(), and again any time
 * someone has been editing MASTER by hand.
 */
function verifyMasterColumns() {
  var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0]
                  .map(function (h) { return String(h || '').trim(); });

  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }

  Logger.log('=== MASTER column layout ===');

  // The indices M4 reads. If any of these moved, M4 files the wrong checklist.
  var CRITICAL = {
    7:  'Location',            // G  -> M4 index 6
    8:  'Visa Type',           // H  -> M4 index 7
    22: 'Folder URL',          // V  -> M4 index 21
    24: 'Skills Authority',    // X  -> M4 index 23
    25: 'Checklist Filed'      // Y  -> M4 index 24
  };
  for (var pos in CRITICAL) {
    var n = Number(pos);
    check('col ' + n + ' is "' + CRITICAL[pos] + '" (M4 reads index ' + (n - 1) + ')',
          headers[n - 1] === CRITICAL[pos], 'found "' + headers[n - 1] + '"');
  }

  // The five new ones, in order, all right of Y.
  for (var i = 0; i < NEW_COLUMNS.length; i++) {
    var expectAt = ANCHOR_INDEX + 1 + i;
    check('col ' + expectAt + ' (' + NEW_COLUMNS[i].col + ') is "' + NEW_COLUMNS[i].header + '"',
          headers[expectAt - 1] === NEW_COLUMNS[i].header,
          'found "' + headers[expectAt - 1] + '"');
  }

  check('nothing was inserted left of Y', lastCol === ANCHOR_INDEX + NEW_COLUMNS.length,
        'last column is ' + lastCol + ', expected ' + (ANCHOR_INDEX + NEW_COLUMNS.length));

  // Validation: the trap that cost us column Y.
  Logger.log('=== data validation on the new columns ===');
  for (var j = 0; j < NEW_COLUMNS.length; j++) {
    var col = ANCHOR_INDEX + 1 + j;
    var rule = sh.getRange(2, col).getDataValidation();
    var isStatus = NEW_COLUMNS[j].header === 'Third Party Status';
    if (isStatus) {
      check(NEW_COLUMNS[j].col + ' has the intended dropdown', !!rule,
            rule ? rule.getCriteriaValues()[0].join(' / ') : 'none');
      if (rule) {
        check(NEW_COLUMNS[j].col + ' dropdown allows invalid (does not block scripts)',
              rule.getAllowInvalid() === true);
      }
    } else {
      check(NEW_COLUMNS[j].col + ' has NO inherited validation', !rule,
            rule ? 'INHERITED: ' + rule.getCriteriaType() : 'clean');
    }
  }

  // Can Apps Script actually write to them?  Y taught us to test this.
  //
  // Safe against master_codes.gs, checked 15 Aug — do not re-derive this:
  //   * onEdit does not fire for script writes, only for a human typing.
  //   * BUT master_codes.gs also runs on a 5-MINUTE TIMER, which can fire while
  //     the scratch row exists. assignMissingCodes_() guards with
  //     `if (!hasName || hasCode) continue;` and the scratch row leaves column C
  //     (Full Name) empty, so it is skipped and no client code is burned.
  // Keep the scratch write out of column C or that stops being true.
  Logger.log('=== write test (writes then clears a scratch row) ===');
  var row = sh.getLastRow() + 1;
  for (var k = 0; k < NEW_COLUMNS.length; k++) {
    var c = ANCHOR_INDEX + 1 + k;
    var cell = sh.getRange(row, c);
    try {
      cell.setValue('__test__');
      SpreadsheetApp.flush();            // lazy validation fires HERE
      cell.clearContent();
      SpreadsheetApp.flush();
      check(NEW_COLUMNS[k].col + ' accepts a script write', true);
    } catch (e) {
      try { cell.clearContent(); SpreadsheetApp.flush(); } catch (ignore) {}
      check(NEW_COLUMNS[k].col + ' accepts a script write', false, e.message);
    }
  }

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0
    ? 'MASTER IS IN THE EXPECTED STATE — M4 indices intact, new columns clean.'
    : 'DO NOT IMPORT. Fix the failures above first.');
}
