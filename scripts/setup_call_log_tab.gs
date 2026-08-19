/**
 * M7 — build the `CALL LOG` tab.                    (spec: docs/M7-PHONE-INTAKE-SPEC.md)
 *
 * ======================== WHAT THIS TAB IS, AND IS NOT ========================
 * It is a CALL RECORD and a CALLBACK QUEUE. It is **not** a lead pipeline.
 *
 * ⛔ CALL LOG MUST NEVER RUN A FOLLOW-UP CADENCE. A callback ("ring back at 3pm
 * today") and a nurture cadence ("chase in 7 days, then 30") are different
 * clocks. ENQUIRIES holds leads and **M8 owns all cadence, exclusively.** A
 * new-enquiry call is promoted across once by `promoteCallsToEnquiries()`.
 * Two clocks on one person is the same defect shape as M5a re-stamping CHASE
 * over DRAFTED — it looks like diligence and reads as harassment.
 *
 * ======================= 🔴 THE IDENTITY CHECK PROBLEM =======================
 * Their SOP wants **name + date of birth** before a matter is discussed.
 * **MASTER HAS NO DOB.** No passport number either — there is no second identity
 * factor in the system at all.
 *
 * So this tab does the opposite of papering over it:
 *   · `Matched On` states which field actually hit — phone, or name
 *   · `ID Verified` is a dropdown that stays BLANK until a HUMAN sets it
 * The sheet finds the file. The person confirms the human. Presenting a
 * name-only match as "verified" would be worse than offering nothing (A-35).
 *
 * ========================= WHY THE LOOKUP IS A FORMULA =========================
 * Nobody can run an Apps Script menu item while a caller is on the line. Typing
 * the number into `Phone` must fill the match in the same row, instantly, on a
 * laptop or a phone. So the match is a formula per row, not a script.
 *
 * ⚠️ Phone FIRST, then name. D-54: MASTER's `Contact Number` (E) is often blank
 * and is explicitly NOT the dedupe key. But on an inbound call we have a number
 * and a spoken name, never an email — so E is what we have, and the fallback to
 * name is reported rather than hidden. A name-only hit on a common surname is
 * precisely where the wrong client file gets opened.
 *
 * Run setupCallLogTab(), then verifyCallLogTab().
 */

var CL_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var CL_TAB      = 'CALL LOG';
var CL_FIRST    = 2;
var CL_ROWS     = 500;      // formula rows laid down up front

// A..P. Order is the contract with m7_callback_queue.gs — change one, change both.
var CL_HEADERS = [
  'Received',        // A  when the call came in
  'Caller Name',     // B  as given on the phone
  'Phone',           // C  🔑 type here and the match fills itself
  'New or Existing', // D  dropdown
  'Reason',          // E  free text
  'Matched Code',    // F  formula — MASTER client code
  'Matched Client',  // G  formula — name · stage · consultant
  'Matched On',      // H  formula — 'phone' | 'name (VERIFY)' | ''
  'Outstanding',     // I  formula — what M4/M5 are already chasing them for
  'ID Verified',     // J  dropdown, HUMAN ONLY, blank until someone confirms
  'Best Callback',   // K  free text, their words: "after 5pm", "tomorrow am"
  'Callback Due',    // L  date+time — the queue works off this
  'Callback Status', // M  dropdown
  'Handled By',      // N  dropdown
  'Becomes Enquiry', // O  dropdown — Yes routes it to ENQUIRIES, once
  'Promoted',        // P  🔑 timestamp written by promoteCallsToEnquiries(). THE idempotency guard.
  'Notes'            // Q
];

var CL_NEW_EXISTING = ['New', 'Existing', 'Unknown'];
var CL_ID_VERIFIED  = ['Yes', 'No — could not confirm', 'N/A — general enquiry'];
var CL_CB_STATUS    = ['Not required', 'Pending', 'Done', 'Missed'];
var CL_STAFF        = ['Robinder', 'Inder', 'Gayatri', 'Priyanka', 'Fiza', 'RJ',
                       'Star', 'Rey', 'Cristelle', 'Unassigned'];
var CL_YES_NO       = ['Yes', 'No', 'Already a client'];


/** Column letter for a header name — used to build the formulas. */
function clCol_(name) { return clLetter_(CL_HEADERS.indexOf(name) + 1); }

function clLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}


/**
 * The four lookup formulas for one row.
 *
 * MASTER columns used (docs/MASTER-SHEET-SPEC.md):
 *   A Client Code · C Full Name · E Contact Number · L Assigned Consultant
 *   M Processing Stage · S Next Follow-up Due · Y Checklist Filed
 *
 * ⚠️ Phone matching normalises BOTH sides — their data carries spaces, +61,
 * brackets and leading zeros inconsistently, so a raw MATCH would miss almost
 * everything and look like "not a client".
 */
function clFormulas_(row) {
  var P = '$' + clCol_('Phone') + row;
  var N = '$' + clCol_('Caller Name') + row;
  var F = '$' + clCol_('Matched Code') + row;

  // Digits only, last 9 — survives +61 / 0 / spaces / (07) on either side.
  var normCall  = 'RIGHT(REGEXREPLACE(TO_TEXT(' + P + '),"[^0-9]",""),9)';
  var normMaster= 'ARRAYFORMULA(RIGHT(REGEXREPLACE(TO_TEXT(MASTER!$E$2:$E),"[^0-9]",""),9))';
  var phoneHit  = 'IFERROR(MATCH(' + normCall + ',' + normMaster + ',0),0)';
  var nameHit   = 'IFERROR(MATCH(UPPER(TRIM(' + N + ')),ARRAYFORMULA(UPPER(TRIM(MASTER!$C$2:$C))),0),0)';

  // 🔴 A blank OR unusable phone must not match a blank MASTER cell — that would
  // "identify" every such caller as whichever client has no number on file, and the
  // consultant would open the wrong person's matter with a confident-looking match.
  // Guarding on P<>"" alone is NOT enough: "unknown", "withheld" or "n/a" all
  // normalise to "" and would sail straight through. Require 6+ real digits.
  var ph = 'IF(OR(' + P + '="",LEN(' + normCall + ')<6),0,' + phoneHit + ')';
  var nm = 'IF(' + N + '="",0,' + nameHit + ')';
  var idx = 'IF(' + ph + '>0,' + ph + ',' + nm + ')';

  var pick = function (col) {
    return '=IF(' + idx + '=0,"",INDEX(MASTER!$' + col + '$2:$' + col + ',' + idx + '))';
  };

  return {
    'Matched Code': pick('A'),
    'Matched Client': '=IF(' + idx + '=0,"",'
      + 'INDEX(MASTER!$C$2:$C,' + idx + ')&"  ·  "&INDEX(MASTER!$M$2:$M,' + idx + ')'
      + '&"  ·  "&INDEX(MASTER!$L$2:$L,' + idx + '))',
    // 🔴 Says which field hit. A name-only match is flagged for a human to confirm,
    // because there is no DOB to check it against (A-35).
    'Matched On': '=IF(' + ph + '>0,"phone",IF(' + nm + '>0,"name (VERIFY)",'
      + 'IF(AND(' + P + '="",' + N + '=""),"","no match")))',
    'Outstanding': '=IF(' + F + '="","",'
      + 'IFERROR("checklist: "&INDEX(MASTER!$Y$2:$Y,' + idx + ')&"   next due: "'
      + '&TEXT(INDEX(MASTER!$S$2:$S,' + idx + '),"yyyy-mm-dd"),""))'
  };
}


function setupCallLogTab() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try {
    var ss = SpreadsheetApp.openById(CL_SHEET_ID);
    var sh = ss.getSheetByName(CL_TAB);
    if (!sh) {
      sh = ss.insertSheet(CL_TAB);
      Logger.log('Created tab "' + CL_TAB + '".');
    } else {
      // Never wipe a tab that may hold real calls and pending callbacks.
      if (sh.getLastRow() > 1) {
        Logger.log('ABORT — "' + CL_TAB + '" already holds ' + (sh.getLastRow() - 1) + ' row(s).');
        Logger.log('Refusing to rebuild a tab with data. Use repairCallLogTab() instead.');
        return;
      }
      Logger.log('Tab exists and is empty — rebuilding.');
    }

    if (sh.getMaxColumns() < CL_HEADERS.length) {
      sh.insertColumnsAfter(sh.getMaxColumns(), CL_HEADERS.length - sh.getMaxColumns());
    }
    if (sh.getMaxRows() < CL_ROWS + 1) sh.insertRowsAfter(sh.getMaxRows(), CL_ROWS + 1 - sh.getMaxRows());

    sh.getRange(1, 1, 1, CL_HEADERS.length).setValues([CL_HEADERS])
      .setFontWeight('bold').setFontColor('#ffffff').setBackground('#1e3a5f');
    sh.setFrozenRows(1);
    sh.setFrozenColumns(3);   // Received · Caller Name · Phone stay visible while reading the match

    clWriteFormulas_(sh);
    clWriteValidation_(sh);

    sh.getRange(CL_FIRST, CL_HEADERS.indexOf('Received') + 1, CL_ROWS, 1)
      .setNumberFormat('yyyy-mm-dd hh:mm');
    sh.getRange(CL_FIRST, CL_HEADERS.indexOf('Callback Due') + 1, CL_ROWS, 1)
      .setNumberFormat('yyyy-mm-dd hh:mm');

    // The formula columns are derived. Grey so nobody types over them —
    // a typed value would silently replace the lookup for that row.
    ['Matched Code', 'Matched Client', 'Matched On', 'Outstanding', 'Promoted'].forEach(function (h) {
      sh.getRange(CL_FIRST, CL_HEADERS.indexOf(h) + 1, CL_ROWS, 1).setBackground('#f1f3f4');
    });

    clWriteConditionalFormat_(sh);

    var widths = { 'Reason': 240, 'Matched Client': 300, 'Outstanding': 260, 'Notes': 260,
                   'Promoted': 140,
                   'Best Callback': 150, 'Matched On': 110 };
    CL_HEADERS.forEach(function (h, i) { sh.setColumnWidth(i + 1, widths[h] || 120); });

    sh.getRange(1, CL_HEADERS.indexOf('ID Verified') + 1).setNote(
      'HUMAN ONLY. Nothing writes this automatically.\n\n'
      + 'There is no date of birth in MASTER, so the sheet CANNOT verify identity — '
      + 'it only finds a likely file. Check "Matched On": "phone" is a strong match, '
      + '"name (VERIFY)" is not. Confirm the person yourself before discussing a matter.');
    sh.getRange(1, CL_HEADERS.indexOf('Promoted') + 1).setNote(
      'Written by promoteCallsToEnquiries(). A timestamp here means this call is ALREADY a row '
      + 'in ENQUIRIES.\n\n⛔ Do not clear it — clearing it makes the call promote a second time '
      + 'and the lead gets two nurture clocks.');
    sh.getRange(1, CL_HEADERS.indexOf('Becomes Enquiry') + 1).setNote(
      'Yes = a new lead. promoteCallsToEnquiries() copies it into ENQUIRIES ONCE, and '
      + 'M8 takes over the 7/30 follow-up from there.\n\n'
      + 'Leave blank or set "Already a client" for an existing client — putting them in '
      + 'ENQUIRIES would have M8 chase them as a cold lead.');

    SpreadsheetApp.flush();
    Logger.log('CALL LOG ready — ' + CL_HEADERS.length + ' columns (A..'
               + clLetter_(CL_HEADERS.length) + '), ' + CL_ROWS + ' rows armed.');
    Logger.log('Now run verifyCallLogTab().');
  } finally {
    lock.releaseLock();
  }
}


/** Non-destructive repair — formulas, validation and formatting only. Never data. */
function repairCallLogTab() {
  // M9 taught this: setupS56Tracker() refused to run on a tab with data, and nothing
  // could then restore dropdowns lost when a row was deleted. The two guards
  // deadlocked. M7 ships with the repair path from day one rather than after the fault.
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try {
    var sh = SpreadsheetApp.openById(CL_SHEET_ID).getSheetByName(CL_TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + CL_TAB); return; }
    var hdr = sh.getRange(1, 1, 1, CL_HEADERS.length).getValues()[0]
                .map(function (h) { return String(h || '').trim(); });
    for (var i = 0; i < CL_HEADERS.length; i++) {
      if (hdr[i] !== CL_HEADERS[i]) {
        Logger.log('ABORT — column ' + clLetter_(i + 1) + ' is "' + hdr[i] + '", expected "'
                   + CL_HEADERS[i] + '". Not writing anything.');
        return;
      }
    }
    clWriteFormulas_(sh);
    clWriteValidation_(sh);
    clWriteConditionalFormat_(sh);
    SpreadsheetApp.flush();
    Logger.log('Formulas, dropdowns and highlighting restored. NO data was changed.');
    Logger.log('Now run verifyCallLogTab().');
  } finally {
    lock.releaseLock();
  }
}


function clWriteFormulas_(sh) {
  var cols = ['Matched Code', 'Matched Client', 'Matched On', 'Outstanding'];
  var byCol = {};
  cols.forEach(function (c) { byCol[c] = []; });
  for (var r = CL_FIRST; r < CL_FIRST + CL_ROWS; r++) {
    var f = clFormulas_(r);
    cols.forEach(function (c) { byCol[c].push([f[c]]); });
  }
  cols.forEach(function (c) {
    sh.getRange(CL_FIRST, CL_HEADERS.indexOf(c) + 1, CL_ROWS, 1).setFormulas(byCol[c]);
  });
  Logger.log('  lookup formulas written to ' + CL_ROWS + ' rows × ' + cols.length + ' columns');
}


function clWriteValidation_(sh) {
  // ⛔ allowInvalid TRUE throughout — setAllowInvalid(false) blocks SCRIPT writes too,
  // which is how MASTER's column Y silently rejected everything.
  var lists = [['New or Existing', CL_NEW_EXISTING], ['ID Verified', CL_ID_VERIFIED],
               ['Callback Status', CL_CB_STATUS], ['Handled By', CL_STAFF],
               ['Becomes Enquiry', CL_YES_NO]];
  lists.forEach(function (pair) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(pair[1], true).setAllowInvalid(true).build();
    sh.getRange(CL_FIRST, CL_HEADERS.indexOf(pair[0]) + 1, CL_ROWS, 1).setDataValidation(rule);
  });
  Logger.log('  ' + lists.length + ' dropdowns set');
}


function clWriteConditionalFormat_(sh) {
  var due = '$' + clCol_('Callback Due');
  var st  = '$' + clCol_('Callback Status');
  var on  = '$' + clCol_('Matched On');
  var range = sh.getRange(CL_FIRST, 1, CL_ROWS, CL_HEADERS.length);

  // An overdue callback nobody has closed. Red.
  var overdue = '=AND(' + due + '2<>"", ' + due + '2<NOW(), ' + st + '2="Pending")';
  // A name-only match. Amber — the file may be the wrong person (A-35).
  var weak    = '=' + on + '2="name (VERIFY)"';

  var mine = [overdue, weak];
  var kept = sh.getConditionalFormatRules().filter(function (r) {
    // Strip only OUR rules — a rule a human added by hand survives. Pushing
    // unconditionally is what stacked duplicates in M5a and again in M9.
    try {
      var c = r.getBooleanCondition(), v = c ? c.getCriteriaValues() : null;
      return !(v && mine.indexOf(String(v[0])) > -1);
    } catch (e) { return true; }
  });
  kept.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(overdue)
    .setBackground('#fdece9').setFontColor('#c0392b').setRanges([range]).build());
  kept.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(weak)
    .setBackground('#fff4e5').setRanges([range]).build());
  sh.setConditionalFormatRules(kept);
  Logger.log('  2 highlight rules set (any earlier copies replaced)');
}
