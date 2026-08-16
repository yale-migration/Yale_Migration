/**
 * M5b — add column AE `Chase Flag`.  (D-322)
 *
 * ============================ WHY THIS COLUMN EXISTS ============================
 * M5b drafts the document-chase email. It cannot be its own Make scenario: the Free
 * plan caps ACTIVE scenarios at 2 and M3 + M4 are those two. So the chase draft is
 * being folded into M4's scenario as a third router route (D-322).
 *
 * That means Make has to SELECT the rows that need chasing. Make cannot do it from
 * anything already in the sheet:
 *   - `Notes` holds "DORMANT: ..." but Make's `text:contains` is accepted and then
 *     evaluates FALSE silently (D-255) — the route would simply never fire, with no
 *     error to tell anyone.
 *   - `Next Follow-up Due` holds a date, and the four operators that DO work are
 *     exist / notexist / text:equal / text:notequal. None of them compares dates.
 *
 * So the detector writes an EXACT string that `text:equal` can match. One column,
 * one word, machine-owned.
 *
 * ---- the state machine — all three transitions must exist or it loops ----------
 *   blank    -> CHASE     M5a, the day a matter goes overdue        (only if blank)
 *   CHASE    -> DRAFTED   M4 route C, right after it creates the draft
 *   anything -> blank     M5a, when contact is logged / matter closes / not overdue
 *
 * Without the CHASE -> DRAFTED step M4 redrafts the same email every run — three
 * times a weekday, forever, at 1 operation each. Without the -> blank step a file
 * can never be chased a second time.
 *
 * ⛔ NOBODY EDITS THIS COLUMN BY HAND. It is set and cleared by automation only.
 *
 * 🔴 SAME RULE AS Z-AD: STRICTLY RIGHT OF THE LAST COLUMN. Never insert left of Y.
 *    M4 reads MASTER by NUMERIC INDEX (6=G, 7=H, 21=V, 23=X, 24=Y). Insert one
 *    column left of those and M4 files the WRONG CHECKLIST and reports success.
 *
 * Run addChaseFlagColumn(), then verifyChaseFlagColumn(). Verify changes nothing.
 */

var CF_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var CF_TAB      = 'MASTER';

// AD must be the rightmost column before we add anything. This is the state
// add_master_columns_z_to_ad.gs leaves the sheet in, verified 22/22 on 16 Aug.
var CF_ANCHOR_INDEX  = 30;             // AD
var CF_ANCHOR_HEADER = 'Upload Link';
var CF_INDEX         = 31;             // AE
var CF_HEADER        = 'Chase Flag';
var CF_NOTE = 'SET BY AUTOMATION — do not type in this column. '
            + 'Blank = nothing due. CHASE = M4 should draft the chase email. '
            + 'DRAFTED <date> = the draft is sitting in visa.lodgement@ waiting to be sent.';


function addChaseFlagColumn() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — another script holds the lock.'); return; }

  try {
    var sh = SpreadsheetApp.openById(CF_SHEET_ID).getSheetByName(CF_TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + CF_TAB); return; }

    if (sh.getMaxColumns() < CF_ANCHOR_INDEX) {
      Logger.log('ABORT — sheet has only ' + sh.getMaxColumns() + ' columns; expected at least '
                 + CF_ANCHOR_INDEX + ' (through AD). Run add_master_columns_z_to_ad.gs first.');
      return;
    }

    var lastCol = sh.getLastColumn();
    var headers = sh.getRange(1, 1, 1, Math.max(lastCol, CF_ANCHOR_INDEX)).getValues()[0]
                    .map(function (h) { return String(h || '').trim(); });

    // Guard 1 — the five Z-AD columns must already be there, in order. If they are
    // not, this is not the sheet M4 was built against and nothing else is safe.
    var EXPECT = { 26: 'Docs Received', 27: 'Docs Outstanding', 28: 'Third Party',
                   29: 'Third Party Status', 30: 'Upload Link' };
    for (var pos in EXPECT) {
      if (headers[Number(pos) - 1] !== EXPECT[pos]) {
        Logger.log('ABORT — column ' + pos + ' is "' + headers[Number(pos) - 1] +
                   '", expected "' + EXPECT[pos] + '".');
        Logger.log('MASTER is not in the state add_master_columns_z_to_ad.gs left it in. Stop and look.');
        return;
      }
    }

    // Guard 2 — already done?
    if (headers.indexOf(CF_HEADER) > -1) {
      Logger.log('ABORT — a column named "' + CF_HEADER + '" already exists at ' +
                 (headers.indexOf(CF_HEADER) + 1) + '. Run verifyChaseFlagColumn() instead.');
      return;
    }

    // Guard 3 — nothing unexpected already sitting right of AD.
    if (lastCol > CF_ANCHOR_INDEX) {
      Logger.log('ABORT — last column is ' + lastCol + ', expected ' + CF_ANCHOR_INDEX + ' (AD).');
      Logger.log('Someone has added a column since 16 Aug. Look before adding more.');
      return;
    }

    if (sh.getMaxColumns() < CF_INDEX) {
      sh.insertColumnsAfter(sh.getMaxColumns(), CF_INDEX - sh.getMaxColumns());
    }

    // insertColumnsAfter INHERITS the left neighbour's validation — that is exactly
    // how column Y silently inherited X's dropdown and blocked every script write.
    var whole = sh.getRange(1, CF_INDEX, sh.getMaxRows(), 1);
    whole.clearDataValidations();
    whole.clearNote();

    try {
      var cell = sh.getRange(1, CF_INDEX);
      cell.setValue(CF_HEADER);
      cell.setNote(CF_NOTE);
      cell.setFontWeight('bold').setBackground('#efefef');
      sh.setColumnWidth(CF_INDEX, 150);
      SpreadsheetApp.flush();          // validation is lazy — it throws HERE, inside the try
      Logger.log('WROTE AE = ' + CF_HEADER);
    } catch (e) {
      Logger.log('FAILED — ' + e.message);
      return;
    }

    Logger.log('');
    Logger.log('Now run verifyChaseFlagColumn().');

  } finally {
    lock.releaseLock();
  }
}


/** Proves AE is present, clean, and writable. Changes nothing permanent. */
function verifyChaseFlagColumn() {
  var sh = SpreadsheetApp.openById(CF_SHEET_ID).getSheetByName(CF_TAB);
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0]
                  .map(function (h) { return String(h || '').trim(); });

  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }

  Logger.log('=== AE Chase Flag ===');

  // The indices M4 reads. Restated here on purpose: this is the check that catches
  // someone having inserted a column since the last run.
  var CRITICAL = { 7: 'Location', 8: 'Visa Type', 22: 'Folder URL',
                   24: 'Skills Authority', 25: 'Checklist Filed' };
  for (var pos in CRITICAL) {
    var n = Number(pos);
    check('col ' + n + ' is still "' + CRITICAL[pos] + '" (M4 reads index ' + (n - 1) + ')',
          headers[n - 1] === CRITICAL[pos], 'found "' + headers[n - 1] + '"');
  }

  check('col 31 (AE) is "' + CF_HEADER + '"', headers[CF_INDEX - 1] === CF_HEADER,
        'found "' + headers[CF_INDEX - 1] + '"');
  check('AE is the last column', lastCol === CF_INDEX, 'last column is ' + lastCol);

  var rule = sh.getRange(2, CF_INDEX).getDataValidation();
  check('AE has NO inherited validation', !rule, rule ? 'INHERITED: ' + rule.getCriteriaType() : 'clean');

  // Write test. Uses the exact strings the state machine uses, not a placeholder —
  // a column that accepts "__test__" but rejects "CHASE" would pass a lazier check.
  Logger.log('=== write test (writes then clears a scratch row) ===');
  var row = sh.getLastRow() + 1;
  ['CHASE', 'DRAFTED 2026-08-16', ''].forEach(function (v) {
    var cell = sh.getRange(row, CF_INDEX);
    try {
      cell.setValue(v);
      SpreadsheetApp.flush();
      check('AE accepts ' + (v === '' ? 'a clear' : '"' + v + '"'), true);
    } catch (e) {
      check('AE accepts ' + (v === '' ? 'a clear' : '"' + v + '"'), false, e.message);
    }
  });
  try { sh.getRange(row, CF_INDEX).clearContent(); SpreadsheetApp.flush(); } catch (ignore) {}

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0
    ? 'AE IS READY — M4 route C can select on it.'
    : 'DO NOT BUILD M4 v4. Fix the failures above first.');
}
