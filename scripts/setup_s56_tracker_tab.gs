/**
 * M9 — build the `S56 TRACKER` tab.                                    (D-342)
 *
 * ============================ WHY A SEPARATE TAB ============================
 * M9 classifies incoming Department email and records any Section 56 request.
 * It writes HERE, not into MASTER, and that is deliberate:
 *
 *   1. MASTER is addressed by NUMERIC INDEX by M4 (6=G, 7=H, 21=V, 23=X, 24=Y).
 *      Every column added there is a chance to shift one of them. This tab
 *      cannot break M3 or M4 no matter what happens to it.
 *   2. Matching an inbound email to a MASTER row is genuinely hard — the letter
 *      carries a client name in the Department's formatting, not ours, and
 *      Make's only working text operator is case-SENSITIVE `text:equal`
 *      (D-255). A wrong match writes a legal deadline onto the wrong client.
 *      A separate tab records the FACT without having to guess the LINK.
 *   3. A human can join the two in seconds. A machine guessing at it cannot be
 *      unwound once it has written to the wrong row.
 *
 * ⛔ NOTHING IN M9 SENDS ANYTHING. It records and it flags. Every reply to the
 * Department is written by the Registered Migration Agent (safety rule 1).
 *
 * ======================= THE DEADLINE IS THE WHOLE POINT =======================
 * A Section 56 request means: give us more information or we decide the
 * application on what we already have. Their own SOP ladder (7/14/21/26 days,
 * D-58) is already lapsing — that is the business pain this module exists for.
 *
 * 🔴 Three columns exist purely so a human can CHECK the computed date:
 *      E Days Allowed · F Letter Date · G Deadline Sentence (verbatim)
 * The spec is explicit: never hardcode 28, always store the sentence next to the
 * computed date. `s56_deadline_verifier.gs` then recomputes D and H from E and F
 * INDEPENDENTLY and flags any disagreement — two separate computations of a
 * legal deadline, which is the minimum this deserves.
 *
 * ⚠️ Deadlines are extendable ("We might let you have more time"). A passed date
 * must NEVER auto-close anything. Nothing here does.
 *
 * Run setupS56Tracker(), then verifyS56Tracker().
 */

var S56_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var S56_TAB      = 'S56 TRACKER';

// A..S. Make appends by header name, so the ORDER here is the contract with the
// M9 blueprint. Change one and the blueprint must change with it.
var S56_HEADERS = [
  'Received',            // A  when the email arrived
  'Client Name',         // B  as the Department wrote it, not as we store it
  'Subclass',            // C
  'DUE DATE (legal)',    // D  letter date + 1 + days allowed
  'INTERNAL DUE',        // E  two days earlier — what the team actually works to (D-58)
  'Days Allowed',        // F  PARSED from the letter, never assumed to be 28
  'Letter Date',         // G  the "Date:" line
  'Deadline Sentence',   // H  🔑 VERBATIM. The human check on D and E
  'TRN',                 // I  e.g. EGP9XF6H64
  'Application ID',      // J  9–11 digits (D-68: the old 10-digit regex missed every 9-digit one)
  'File Number',         // K  e.g. BCC2025/7294045
  'Category',            // L
  'Confidence',          // M  0–1 from the classifier
  'Needs Review',        // N  YES when the model was unsure — never a silent guess
  'Subject',             // O
  'Gmail Link',          // P  straight to the message
  'Assigned To',         // Q  dropdown
  'Status',              // R  dropdown — worked by a human
  'Raw Classification'   // S  the model's JSON, kept for debugging
];

var S56_ASSIGNEES = ['Robinder', 'Inder', 'Gayatri', 'Priyanka', 'Fiza', 'RJ',
                     'Star', 'Rey', 'Cristelle', 'Unassigned'];
var S56_STATUSES  = ['New', 'Acknowledged', 'Documents Requested',
                     'Documents Sent', 'Extension Requested', 'Closed'];


function setupS56Tracker() {
  // getDocumentLock, not getScriptLock — master_codes.gs holds a DOCUMENT lock on
  // a 5-minute timer against this same spreadsheet (D-324 / D-326).
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }

  try {
    var ss = SpreadsheetApp.openById(S56_SHEET_ID);
    var sh = ss.getSheetByName(S56_TAB);
    var fresh = !sh;
    if (fresh) {
      sh = ss.insertSheet(S56_TAB);
      Logger.log('Created tab "' + S56_TAB + '".');
    } else {
      // Never silently wipe a tab that may already hold real deadlines.
      var used = sh.getLastRow();
      if (used > 1) {
        Logger.log('ABORT — "' + S56_TAB + '" already holds ' + (used - 1) + ' row(s).');
        Logger.log('Refusing to rebuild a tab with data in it. Run verifyS56Tracker() instead.');
        return;
      }
      Logger.log('Tab exists and is empty — rebuilding the header.');
    }

    if (sh.getMaxColumns() < S56_HEADERS.length) {
      sh.insertColumnsAfter(sh.getMaxColumns(), S56_HEADERS.length - sh.getMaxColumns());
    }

    sh.getRange(1, 1, 1, S56_HEADERS.length).setValues([S56_HEADERS])
      .setFontWeight('bold').setFontColor('#ffffff').setBackground('#7f1d1d');
    sh.setFrozenRows(1);

    var n = Math.max(sh.getMaxRows() - 1, 1);
    // Dates as real dates so sorting and the red highlight behave.
    ['A', 'D', 'E', 'G'].forEach(function (col) {
      sh.getRange(2, S56_HEADERS.indexOf(s56HeaderFor_(col)) + 1, n, 1)
        .setNumberFormat('yyyy-mm-dd');
    });

    // Dropdowns. allowInvalid TRUE — setAllowInvalid(false) blocks SCRIPT writes
    // too, which is exactly how MASTER's column Y silently rejected everything.
    s56AddList_(sh, S56_HEADERS.indexOf('Assigned To') + 1, n, S56_ASSIGNEES);
    s56AddList_(sh, S56_HEADERS.indexOf('Status') + 1, n, S56_STATUSES);

    // 🔴 The alert that matters: anything due inside 7 days, or already past,
    // turns red. Blank due dates stay clean.
    var dueCol = s56ColumnLetter_(S56_HEADERS.indexOf('DUE DATE (legal)') + 1);
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($' + dueCol + '2<>"", $' + dueCol + '2<TODAY()+7)')
      .setBackground('#fdece9').setFontColor('#c0392b')
      .setRanges([sh.getRange(2, 1, Math.max(sh.getMaxRows() - 1, 1), S56_HEADERS.length)])
      .build();
    // ⛔ STRIP OUR OWN RULE FIRST, then add exactly one.
    // Pushing unconditionally stacks an identical rule on the same range every run —
    // the precise defect already found and fixed in m5_dormant_detector.gs
    // (addDormantHighlight: "three runs, three identical rules"). This function is
    // re-runnable by design, so it had the same bug waiting.
    // Identified by the rule's own formula, so a rule a human added by hand survives.
    var mine = '$' + dueCol + '2<>""';
    var rules = sh.getConditionalFormatRules().filter(function (existing) {
      try {
        var f = existing.getBooleanCondition();
        var vals = f ? f.getCriteriaValues() : null;
        return !(vals && String(vals[0]).indexOf(mine) > -1);
      } catch (e) { return true; }   // never drop a rule we cannot inspect
    });
    rules.push(rule);
    sh.setConditionalFormatRules(rules);
    Logger.log('Conditional format: 1 due-date rule set (any earlier copy replaced).');

    var widths = { 'Deadline Sentence': 420, 'Subject': 300, 'Gmail Link': 220,
                   'Raw Classification': 300, 'Client Name': 200 };
    S56_HEADERS.forEach(function (h, i) { sh.setColumnWidth(i + 1, widths[h] || 120); });

    sh.getRange(1, S56_HEADERS.indexOf('Deadline Sentence') + 1)
      .setNote('VERBATIM from the letter. This is how a human checks the computed '
             + 'due date. If this is empty, do not trust the date beside it.');
    sh.getRange(1, S56_HEADERS.indexOf('Days Allowed') + 1)
      .setNote('PARSED from the letter. It is usually 28 but the spec is explicit '
             + 'that it must never be assumed — parse the number before "days".');

    SpreadsheetApp.flush();
    Logger.log('S56 TRACKER ready — ' + S56_HEADERS.length + ' columns (A..'
               + s56ColumnLetter_(S56_HEADERS.length) + ').');
    Logger.log('Now run verifyS56Tracker().');

  } finally {
    lock.releaseLock();
  }
}


/** Proves the tab matches what the M9 blueprint will write into. */
function verifyS56Tracker() {
  var sh = SpreadsheetApp.openById(S56_SHEET_ID).getSheetByName(S56_TAB);
  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }
  if (!sh) { Logger.log('FAIL — no tab named ' + S56_TAB); return; }

  Logger.log('=== S56 TRACKER ===');
  var got = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
              .map(function (h) { return String(h || '').trim(); });
  check('column count is ' + S56_HEADERS.length, got.length === S56_HEADERS.length,
        'found ' + got.length);
  S56_HEADERS.forEach(function (h, i) {
    check('col ' + s56ColumnLetter_(i + 1) + ' is "' + h + '"', got[i] === h,
          'found "' + got[i] + '"');
  });

  Logger.log('=== dropdowns must NOT block script writes ===');
  ['Assigned To', 'Status'].forEach(function (h) {
    var r = sh.getRange(2, S56_HEADERS.indexOf(h) + 1).getDataValidation();
    check(h + ' has a list', !!r);
    if (r) check(h + ' allows invalid (does not block Make)', r.getAllowInvalid() === true);
  });

  Logger.log('=== write test — a full row, then cleared ===');
  var row = sh.getLastRow() + 1;
  try {
    var probe = S56_HEADERS.map(function (h) {
      if (h === 'Received' || h === 'DUE DATE (legal)' || h === 'INTERNAL DUE'
          || h === 'Letter Date') return '2026-09-15';
      if (h === 'Days Allowed') return 28;
      if (h === 'Confidence') return 0.97;
      if (h === 'Assigned To') return 'Unassigned';
      if (h === 'Status') return 'New';
      return 'test';
    });
    sh.getRange(row, 1, 1, S56_HEADERS.length).setValues([probe]);
    SpreadsheetApp.flush();
    check('a full row can be written', true);
    sh.getRange(row, 1, 1, S56_HEADERS.length).clearContent();
    SpreadsheetApp.flush();
  } catch (e) {
    check('a full row can be written', false, e.message);
    try { sh.getRange(row, 1, 1, S56_HEADERS.length).clearContent(); } catch (ignore) {}
  }

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0 ? 'TRACKER READY — the M9 blueprint can write to it.'
                        : 'DO NOT POINT M9 AT THIS TAB until the failures above are fixed.');
}


function s56HeaderFor_(col) {
  var map = { A: 'Received', D: 'DUE DATE (legal)', E: 'INTERNAL DUE', G: 'Letter Date' };
  return map[col];
}
function s56AddList_(sh, col, n, values) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(true)      // ⛔ never false — it blocks Apps Script and Make writes
    .build();
  sh.getRange(2, col, n, 1).setDataValidation(rule);
}
function s56ColumnLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}
