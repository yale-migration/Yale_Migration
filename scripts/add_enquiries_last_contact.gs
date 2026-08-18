/**
 * M8 — add column L `Last Contact` to ENQUIRIES.               (D-339)
 *
 * ================================ WHY ================================
 * M8 is "lead follow-up sequences: 7-day + 30-day cadence, **stop-on-reply**"
 * (ROADMAP). The cadence shipped 18 Aug. **Stop-on-reply did not, because
 * ENQUIRIES had nowhere to record that the person replied.**
 *
 * Without it M8 measures both follow-ups from the ENQUIRY DATE and nothing else.
 * A lead who replied on day 2 and is mid-conversation with a consultant still
 * gets chased on day 30, by a system that cannot see the conversation.
 *
 * ---- what "stop-on-reply" honestly means here -----------------------------
 * ⛔ We CANNOT detect a reply automatically. Reading the inbox is M9, and the
 * WhatsApp/social channels are M6 — neither is built, and both are blocked on
 * access we do not have. Claiming automatic reply detection would be a lie in
 * a cell.
 *
 * What we CAN do, and what this column is: **the moment a human logs a reply,
 * the machine stops chasing.** One date, typed by the consultant who took the
 * call. M8 then clears the follow-up date and says why.
 *
 * That is the whole of it. When M6/M9 land they write this same column and the
 * behaviour becomes automatic with no change to M8.
 *
 * 🔴 STRICTLY RIGHT OF THE LAST COLUMN — same rule as MASTER's Z..AE. ENQUIRIES
 *    runs A..K today; this goes at L. Never insert.
 *
 * Run addEnquiriesLastContact(), then verifyEnquiriesLastContact().
 */

var LC_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var LC_TAB      = 'ENQUIRIES';
var LC_ANCHOR   = 11;              // K Notes — must be the last column before we add
var LC_ANCHOR_H = 'Notes';
var LC_INDEX    = 12;              // L
var LC_HEADER   = 'Last Contact';
var LC_NOTE     = 'The date this person last REPLIED, or was last spoken to. '
                + 'Filling it STOPS the automatic 7/30-day follow-up — the lead is '
                + 'now a live conversation, not a cold one. Leave blank if they have '
                + 'never come back to us.';


function addEnquiriesLastContact() {
  // getDocumentLock, not getScriptLock — master_codes.gs holds a DOCUMENT lock on a
  // 5-minute timer against this same spreadsheet (D-324/D-326).
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }

  try {
    var sh = SpreadsheetApp.openById(LC_SHEET_ID).getSheetByName(LC_TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + LC_TAB); return; }

    var lastCol = sh.getLastColumn();
    var headers = sh.getRange(1, 1, 1, Math.max(lastCol, LC_INDEX)).getValues()[0]
                    .map(function (h) { return String(h || '').trim(); });

    if (headers.indexOf(LC_HEADER) > -1) {
      Logger.log('ABORT — "' + LC_HEADER + '" already exists at column ' +
                 (headers.indexOf(LC_HEADER) + 1) + '. Run verifyEnquiriesLastContact().');
      return;
    }
    if (headers[LC_ANCHOR - 1] !== LC_ANCHOR_H) {
      Logger.log('ABORT — column ' + LC_ANCHOR + ' is "' + headers[LC_ANCHOR - 1] +
                 '", expected "' + LC_ANCHOR_H + '". ENQUIRIES is not the shape M8 expects.');
      return;
    }
    if (lastCol > LC_ANCHOR) {
      Logger.log('ABORT — last column is ' + lastCol + ', expected ' + LC_ANCHOR +
                 ' (K). Something is already right of Notes. Look before adding.');
      return;
    }

    if (sh.getMaxColumns() < LC_INDEX) {
      sh.insertColumnsAfter(sh.getMaxColumns(), LC_INDEX - sh.getMaxColumns());
    }

    // insertColumnsAfter INHERITS the left neighbour's validation — that is how
    // MASTER's column Y silently blocked every script write for days.
    var whole = sh.getRange(1, LC_INDEX, sh.getMaxRows(), 1);
    whole.clearDataValidations();
    whole.clearNote();

    try {
      var cell = sh.getRange(1, LC_INDEX);
      cell.setValue(LC_HEADER);
      cell.setNote(LC_NOTE);
      cell.setFontWeight('bold').setBackground('#efefef');
      sh.setColumnWidth(LC_INDEX, 130);
      // A real date column, like MASTER's. Format BEFORE any value lands in it.
      sh.getRange(2, LC_INDEX, Math.max(sh.getMaxRows() - 1, 1), 1)
        .setNumberFormat('yyyy-mm-dd');
      SpreadsheetApp.flush();          // validation is lazy — it throws HERE
      Logger.log('WROTE L = ' + LC_HEADER);
    } catch (e) {
      Logger.log('FAILED — ' + e.message);
      return;
    }

    Logger.log('');
    Logger.log('Now run verifyEnquiriesLastContact().');

  } finally {
    lock.releaseLock();
  }
}


/** Proves L is present, clean and writable. Changes nothing permanent. */
function verifyEnquiriesLastContact() {
  var sh = SpreadsheetApp.openById(LC_SHEET_ID).getSheetByName(LC_TAB);
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0]
                  .map(function (h) { return String(h || '').trim(); });

  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }

  Logger.log('=== ENQUIRIES L Last Contact ===');

  // The indices M8 reads. If any moved, M8 reads the wrong field silently.
  var CRITICAL = { 1: 'Date', 2: 'Name', 3: 'Phone', 9: 'Status',
                   10: 'Follow-up Due', 11: 'Notes' };
  for (var pos in CRITICAL) {
    var n = Number(pos);
    check('col ' + n + ' is "' + CRITICAL[pos] + '" (M8 reads it)',
          headers[n - 1] === CRITICAL[pos], 'found "' + headers[n - 1] + '"');
  }
  check('col 12 (L) is "' + LC_HEADER + '"', headers[LC_INDEX - 1] === LC_HEADER,
        'found "' + headers[LC_INDEX - 1] + '"');
  check('L is the last column', lastCol === LC_INDEX, 'last column is ' + lastCol);

  var rule = sh.getRange(2, LC_INDEX).getDataValidation();
  check('L has NO inherited validation', !rule,
        rule ? 'INHERITED: ' + rule.getCriteriaType() : 'clean');

  Logger.log('=== write test (writes then clears a scratch row) ===');
  var row = sh.getLastRow() + 1;
  var cell = sh.getRange(row, LC_INDEX);
  try {
    cell.setValue('2026-08-18');
    SpreadsheetApp.flush();
    check('L accepts a date being written', true);
  } catch (e) {
    check('L accepts a date being written', false, e.message);
  }
  try { cell.clearContent(); SpreadsheetApp.flush(); } catch (ignore) {}

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0
    ? 'L IS READY — M8 stop-on-reply is live.'
    : 'Fix the failures above before relying on M8.');
}
