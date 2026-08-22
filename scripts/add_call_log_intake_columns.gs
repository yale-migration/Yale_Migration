/**
 * add_call_log_intake_columns.gs — inserts M7's intake block into the LIVE CALL LOG.
 *
 * ⛔ DO NOT RE-RUN setup_call_log_tab.gs TO DO THIS. That script lays down 500 rows of
 * formulas, formats, notes and protections, and CALL LOG is live (36/36 verified 20 Aug,
 * including a real MASTER number resolving to its client). Rebuilding is a far bigger
 * blast radius than three columns. Same reasoning as D-323 for MASTER's dropdowns.
 *
 * ---- WHAT AND WHY -----------------------------------------------------------
 * `promoteCallsToEnquiries()` fills six of ENQUIRIES' eleven columns. Two more — Status
 * and Follow-up Due — are blank on purpose. That left THREE with no source at all:
 *
 *     ENQUIRIES D Email · F Visa Interest · G Location
 *
 * So every promoted call produced an enquiry the system **could not email, could not place
 * onshore/offshore, and could not report by visa line** — structurally poorer than a web
 * lead, for no reason anyone had chosen. It was blocked on not knowing what Yale asks a
 * new enquirer. That was I-14, and their form arrived on 21 Aug.
 *
 * ⛔ THREE columns, not the form's nine. Age, work experience and course completed have no
 * ENQUIRIES column either, and go in Notes exactly as C-1 does. A-32, their words:
 * *"too much column is a lot to handle."*
 *
 * They sit AFTER `New or Existing` and `Reason` deliberately — you only ask intake
 * questions once you know the caller is new. That is the call's order, not the sheet's.
 *
 * ---- WHAT THIS SHIFTS, AND WHY IT IS SAFE -----------------------------------
 * Everything from `Matched Code` rightwards moves three columns. That is safe because
 * setup_call_log_tab.gs addresses every column through `clCol_('Header Name')` and never
 * by letter — so the lookup formulas regenerate correctly. **They do not regenerate by
 * themselves.** The existing formulas still point at the OLD letters until you re-run
 * `repairCallLogTab()`, which is step 2 below and is not optional.
 *
 * 🔴 Two hardcoded positions were found and derived while making this change, both of
 * which would have failed silently:
 *   · `CL_HELPER_PHONE = 18` — the hidden helper columns. At 20 headers, 18 is a REAL
 *     column, so the MATCH ranges would have searched `Becomes Enquiry`.
 *   · `getRange(row, 1, n, 17)` in m7_callback_queue.gs — twice. The read stopped before
 *     `Becomes Enquiry`, so promote saw no flagged rows and logged "not marked Yes",
 *     cheerfully, with no error. The test suite caught this one.
 *
 * ---- RUN ORDER — BOTH STEPS, IN THIS ORDER ----------------------------------
 *   1. addCallLogIntakeColumns()
 *   2. repairCallLogTab()          ← regenerates the formulas at their new letters
 *   3. verifyCallLogIntake()
 */

var CLI_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var CLI_TAB      = 'CALL LOG';
var CLI_AFTER    = 'Reason';        // insert immediately after this header
var CLI_NEW      = ['Email', 'Location', 'Visa Interest'];
// Must match ENQUIRIES column G exactly. Their form says Australia/Philippines; the SHEET
// says Onshore/Offshore. Staff pick the sheet's word here, so nothing needs translating
// later and no value can reach a locked cell that would refuse it (D-353).
var CLI_LOCATION_VALUES = ['Onshore', 'Offshore'];

function addCallLogIntakeColumns() {
  var lock = LockService.getDocumentLock();     // master_codes.gs runs on a 5-minute timer
  if (!lock.tryLock(30000)) { Logger.log('ABORT — another script holds the document lock.'); return; }

  try {
    var ss = SpreadsheetApp.openById(CLI_SHEET_ID);
    var sh = ss.getSheetByName(CLI_TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + CLI_TAB + '.'); return; }

    var lastCol = sh.getLastColumn();
    var hdr = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });

    // Idempotent: if they are already there, say so and change nothing.
    var present = CLI_NEW.filter(function (h) { return hdr.indexOf(h) > -1; });
    if (present.length === CLI_NEW.length) {
      Logger.log('OK — ' + CLI_NEW.join(', ') + ' already present. Nothing to do.');
      Logger.log('Header now: ' + hdr.join(' | '));
      return;
    }
    if (present.length) {
      Logger.log('ABORT — a PARTIAL insert is already in place (' + present.join(', ') + ').');
      Logger.log('        Half-done is not a state this script can reason about. Look first.');
      return;
    }

    var at = hdr.indexOf(CLI_AFTER);
    if (at === -1) {
      Logger.log('ABORT — no "' + CLI_AFTER + '" column. The tab is not the shape this expects.');
      Logger.log('        Header: ' + hdr.join(' | '));
      return;
    }

    // insertColumnsAfter shifts data, formats, validation and formula REFERENCES with it.
    // What it cannot fix is a formula that names a letter literally — which is exactly why
    // repairCallLogTab() has to run afterwards.
    sh.insertColumnsAfter(at + 1, CLI_NEW.length);
    sh.getRange(1, at + 2, 1, CLI_NEW.length).setValues([CLI_NEW]);
    SpreadsheetApp.flush();

    var locCol = at + 3;                                   // Email, then Location
    var rows = Math.max(sh.getMaxRows() - 1, 1);
    sh.getRange(2, locCol, rows, 1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CLI_LOCATION_VALUES, true)
        .setAllowInvalid(false)      // matches ENQUIRIES G — refuse rather than pass junk on
        .build());

    sh.getRange(1, at + 2, 1, CLI_NEW.length).setFontWeight('bold');
    sh.getRange(1, at + 4).setNote(
      'Their words, verbatim — "Graduate Visa", not "485".\n' +
      'Deciding which subclass someone needs is migration advice and only the RMA gives it.');
    SpreadsheetApp.flush();

    Logger.log('INSERTED ' + CLI_NEW.join(', ') + ' after "' + CLI_AFTER + '"  (' +
               lastCol + ' -> ' + sh.getLastColumn() + ' columns)');
    Logger.log('');
    Logger.log('🔴 NOW RUN repairCallLogTab() — the lookup formulas still point at the OLD');
    Logger.log('   letters until you do. Then verifyCallLogIntake().');

  } finally {
    lock.releaseLock();
  }
}

/** Proves the columns exist AND that the locked one accepts a real write. */
function verifyCallLogIntake() {
  var ss = SpreadsheetApp.openById(CLI_SHEET_ID);
  var sh = ss.getSheetByName(CLI_TAB);
  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }
  if (!sh) { Logger.log('FAIL — no ' + CLI_TAB + ' tab.'); return; }

  var hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
              .map(function (h) { return String(h).trim(); });
  Logger.log('=== CALL LOG intake block ===');
  Logger.log('  header: ' + hdr.join(' | '));

  CLI_NEW.forEach(function (h) { check('column "' + h + '" exists', hdr.indexOf(h) > -1); });
  check('they sit immediately after "' + CLI_AFTER + '"',
        hdr.indexOf('Email') === hdr.indexOf(CLI_AFTER) + 1, 'Email is at ' + (hdr.indexOf('Email') + 1));

  // 🔑 The contract with m7_callback_queue.gs. If these drift, promote writes the wrong
  // cells and reports success — the failure this whole file exists to avoid.
  check('Becomes Enquiry is at column 18 (M7_CL.BECOMES)', hdr.indexOf('Becomes Enquiry') === 17,
        'found at ' + (hdr.indexOf('Becomes Enquiry') + 1));
  check('Promoted is at column 19 (M7_CL.PROMOTED)', hdr.indexOf('Promoted') === 18,
        'found at ' + (hdr.indexOf('Promoted') + 1));
  check('Notes is at column 20 (M7_CL.NOTES — the read width)', hdr.indexOf('Notes') === 19,
        'found at ' + (hdr.indexOf('Notes') + 1));

  // A list containing a value and a CELL accepting it are two different claims (D-362).
  var locCol = hdr.indexOf('Location') + 1;
  var probe = sh.getRange(2, locCol).getDataValidation();
  check('Location has a dropdown', !!probe);
  if (probe) {
    var vals = probe.getCriteriaValues()[0];
    check('Location offers exactly Onshore/Offshore', vals.join('/') === 'Onshore/Offshore', vals.join('/'));
    var row = sh.getLastRow() + 1, cell = sh.getRange(row, locCol);
    try {
      cell.setValue('Offshore'); SpreadsheetApp.flush();
      check('Location actually accepts "Offshore" being written', true);
    } catch (e) {
      check('Location actually accepts "Offshore" being written', false, e.message);
    }
    try { cell.clearContent(); SpreadsheetApp.flush(); } catch (ignore) {}
  }

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0 ? 'INTAKE BLOCK OK. Run repairCallLogTab() if you have not already.'
                        : 'Fix the failures above before promoting any call.');
}
