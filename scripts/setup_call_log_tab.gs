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

/**
 * 🔴 HIDDEN HELPER COLUMNS — R and S. A performance fix, and a correctness one.
 *
 * The first build normalised MASTER's phone and name columns INSIDE every row's
 * formula: 500 rows × 2 ARRAYFORMULAs × ~1,000 MASTER rows = about a million
 * REGEXREPLACE/TRIM operations recalculated on EVERY keystroke-commit in the tab.
 * Sheets would have crawled, and it would have crawled worst exactly when someone is
 * on the phone waiting for the match.
 *
 * The normalisation depends only on MASTER, not on the row asking. So it is computed
 * ONCE here and every row MATCHes against the result — one array, not five hundred.
 *
 * They are hidden because they are machinery, not data. They carry underscore names so
 * that if anyone unhides them it is obvious they are not a field to fill in.
 */
// A..T. Order is the contract with m7_callback_queue.gs — change one, change both.
var CL_HEADERS = [
  'Received',        // A  when the call came in
  'Caller Name',     // B  as given on the phone
  'Phone',           // C  🔑 type here and the match fills itself
  'New or Existing', // D  dropdown
  'Reason',          // E  free text
  // ── M7's intake block, added 22 Aug. These three exist because they are the only
  // ENQUIRIES fields `promoteCallsToEnquiries` could not fill: a promoted call arrived
  // with no email, no location and no visa interest, so a phone lead was structurally
  // poorer than a web lead for no reason anyone had chosen.
  // They sit AFTER 'New or Existing' and 'Reason' on purpose — you only ask intake
  // questions once you know the caller is new. That is the call's order, not the sheet's.
  // ⛔ Only THREE, not the form's nine. Age, work experience and course completed have no
  // ENQUIRIES column either and go in Notes, exactly as C-1 does. A-32, their words:
  // "too much column is a lot to handle."
  'Email',           // F  → ENQUIRIES D
  'Location',        // G  → ENQUIRIES G. Onshore/Offshore — the SHEET's vocabulary, not
                     //     the form's Australia/Philippines, so no translation can go wrong
  'Visa Interest',   // H  → ENQUIRIES F. Free text on both sides: their words, verbatim
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

// ⚠️ DERIVED, not hardcoded. These were 18 and 19 and would have silently pointed at two
// REAL columns the moment the intake block was inserted — the helper MATCH ranges would
// then have searched 'Becomes Enquiry'. Positional constants beside a list that grows
// are a trap.
//
// 🔴 THEY MUST STAY BELOW CL_HEADERS. `var` hoists the declaration, never the value, so
// placing these above the array makes CL_HEADERS `undefined` at this line and the file
// THROWS AT LOAD. In Apps Script every .gs shares one global scope and all top-level
// statements run before any function does — so a throw here does not break this file, it
// breaks THE WHOLE PROJECT, including the M5 and M8 daily triggers. Written above the
// array first, on 22 Aug, and caught before it ever ran.
var CL_HELPER_PHONE = CL_HEADERS.length + 1;
var CL_HELPER_NAME  = CL_HEADERS.length + 2;

var CL_NEW_EXISTING = ['New', 'Existing', 'Unknown'];
var CL_ID_VERIFIED  = ['Yes', 'No — could not confirm', 'N/A — general enquiry'];
var CL_CB_STATUS    = ['Not required', 'Pending', 'Done', 'Missed'];
var CL_STAFF        = ['Robinder', 'Inder', 'Gayatri', 'Priyanka', 'Fiza', 'RJ',
                       'Star', 'Rey', 'Cristelle',
                     'Pooja', 'Anmol', 'Unassigned'];
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

  // Digits only, last 9 — survives +61 / 0 / spaces / (07) on either side, and
  // survives Sheets storing a typed number as a number and dropping the leading zero.
  var normCall = 'RIGHT(REGEXREPLACE(TO_TEXT(' + P + '),"[^0-9]",""),9)';
  // ⚡ MATCH against the precomputed helper columns, not a per-row ARRAYFORMULA.
  var HP = '$' + clLetter_(CL_HELPER_PHONE) + '$2:$' + clLetter_(CL_HELPER_PHONE);
  var HN = '$' + clLetter_(CL_HELPER_NAME)  + '$2:$' + clLetter_(CL_HELPER_NAME);
  var phoneHit = 'IFERROR(MATCH(' + normCall + ',' + HP + ',0),0)';
  var nameHit  = 'IFERROR(MATCH(UPPER(TRIM(' + N + ')),' + HN + ',0),0)';

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

    // 🔴 Phone as PLAIN TEXT. Left as a number, Sheets stores 0400111222 as 400111222 —
    // the leading zero is gone from what the consultant SEES, and a '+61...' entry can
    // error outright. The match itself survives (both sides reduce to the last 9 digits)
    // but a phone number that displays wrongly on screen is its own defect: someone will
    // read it back to a caller.
    sh.getRange(CL_FIRST, CL_HEADERS.indexOf('Phone') + 1, CL_ROWS, 1).setNumberFormat('@');
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
    sh.getRange(CL_FIRST, CL_HEADERS.indexOf('Phone') + 1, CL_ROWS, 1).setNumberFormat('@');
    SpreadsheetApp.flush();
    Logger.log('Formulas, helpers, dropdowns, text format and highlighting restored. NO data changed.');
    Logger.log('Now run verifyCallLogTab().');
  } finally {
    lock.releaseLock();
  }
}


function clWriteFormulas_(sh) {
  // The two helper arrays. Row 2 only — ARRAYFORMULA spills the rest.
  // ⛔ IF(...="","") on each: a blank MASTER cell must normalise to blank, never to a
  // value a blank caller field could match. The 6-digit guard on the call side is the
  // other half of that; neither is sufficient alone.
  sh.getRange(1, CL_HELPER_PHONE).setValue('_master_phone_normalised');
  sh.getRange(1, CL_HELPER_NAME).setValue('_master_name_normalised');
  sh.getRange(2, CL_HELPER_PHONE).setFormula(
    '=ARRAYFORMULA(IF(MASTER!$E$2:$E="","",RIGHT(REGEXREPLACE(TO_TEXT(MASTER!$E$2:$E),"[^0-9]",""),9)))');
  sh.getRange(2, CL_HELPER_NAME).setFormula(
    '=ARRAYFORMULA(IF(MASTER!$C$2:$C="","",UPPER(TRIM(MASTER!$C$2:$C))))');
  sh.hideColumns(CL_HELPER_PHONE, 2);
  // ⚠️ DERIVED. This said "(R,S)" as literal text and stayed saying it after the intake
  // block moved the helpers to U,V — a log line that quietly lies about where it wrote.
  Logger.log('  2 hidden helper columns (' + clLetter_(CL_HELPER_PHONE) + ',' +
             clLetter_(CL_HELPER_NAME) + ') — MASTER normalised ONCE, not per row');

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


/**
 * Proves the tab is what M7 expects — and, crucially, proves THE LOOKUP ACTUALLY
 * RESOLVES against live MASTER data.
 *
 * ⚠️ Header checks and dropdown checks are cheap and prove almost nothing here. The
 * whole value of this tab is that typing a number identifies the caller. A formula can
 * be present, correctly spelled, and return "" for every real client — a wrong sheet
 * reference, a shifted MASTER column, a normalisation that strips too much. Every one
 * of those looks identical to "this caller is not a client", which is the single most
 * dangerous thing this tab can say.
 *
 * So this takes a REAL phone number out of MASTER, types it into a probe row, and
 * checks the match comes back with that same client's code. Then clears the row.
 */
function verifyCallLogTab() {
  var ss = SpreadsheetApp.openById(CL_SHEET_ID);
  var sh = ss.getSheetByName(CL_TAB);
  var pass = 0, fail = 0, warn = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }
  if (!sh) { Logger.log('FAIL — no tab named ' + CL_TAB); return; }

  Logger.log('=== CALL LOG ===');
  var got = sh.getRange(1, 1, 1, CL_HEADERS.length).getValues()[0]
              .map(function (h) { return String(h || '').trim(); });
  check('column count is ' + CL_HEADERS.length, sh.getLastColumn() >= CL_HEADERS.length,
        'found ' + sh.getLastColumn());
  CL_HEADERS.forEach(function (h, i) {
    check('col ' + clLetter_(i + 1) + ' is "' + h + '"', got[i] === h, 'found "' + got[i] + '"');
  });

  Logger.log('=== dropdowns must NOT block script writes ===');
  ['New or Existing', 'ID Verified', 'Callback Status', 'Handled By', 'Becomes Enquiry']
    .forEach(function (h) {
      var r = sh.getRange(CL_FIRST, CL_HEADERS.indexOf(h) + 1).getDataValidation();
      check(h + ' has a list', !!r);
      if (r) check(h + ' allows invalid (does not block a script write)',
                   r.getAllowInvalid() === true);
    });

  Logger.log('=== the lookup formulas are present ===');
  ['Matched Code', 'Matched Client', 'Matched On', 'Outstanding'].forEach(function (h) {
    var f = sh.getRange(CL_FIRST, CL_HEADERS.indexOf(h) + 1).getFormula();
    check(h + ' carries a formula', String(f).charAt(0) === '=', f ? 'ok' : '(empty)');
  });

  Logger.log('=== 🔴 THE ONE THAT MATTERS — does the lookup RESOLVE? ===');
  var probe = sh.getLastRow() + 1;
  if (probe < CL_FIRST) probe = CL_FIRST;
  try {
    var ms = ss.getSheetByName('MASTER');
    if (!ms) {
      Logger.log('  ⚠️  SKIPPED — no MASTER tab. The lookup cannot be proven.');
      warn++;
    } else {
      // Find a real client who actually has a phone number. D-54: Contact Number is
      // often blank, so most rows are unusable for this and that is expected.
      var mLast = ms.getLastRow();
      var codes = ms.getRange(2, 1, Math.max(mLast - 1, 1), 5).getValues();
      var sample = null;
      for (var i = 0; i < codes.length; i++) {
        var digits = String(codes[i][4] || '').replace(/[^0-9]/g, '');
        if (digits.length >= 6 && String(codes[i][0] || '').trim()) {
          sample = { code: String(codes[i][0]).trim(), phone: String(codes[i][4]).trim() };
          break;
        }
      }
      if (!sample) {
        Logger.log('  ⚠️  SKIPPED — no MASTER row has a usable phone number yet (D-54 says');
        Logger.log('      Contact Number is often blank). Re-run this after the client import;');
        Logger.log('      until then the lookup is UNPROVEN against real data.');
        warn++;
      } else {
        // Make sure the probe row carries the formulas — it may be past the armed range.
        var f = clFormulas_(probe);
        ['Matched Code', 'Matched Client', 'Matched On', 'Outstanding'].forEach(function (h) {
          sh.getRange(probe, CL_HEADERS.indexOf(h) + 1).setFormula(f[h]);
        });
        sh.getRange(probe, CL_HEADERS.indexOf('Phone') + 1).setValue(sample.phone);
        SpreadsheetApp.flush();

        var gotCode = String(sh.getRange(probe, CL_HEADERS.indexOf('Matched Code') + 1)
                               .getDisplayValue()).trim();
        var gotOn   = String(sh.getRange(probe, CL_HEADERS.indexOf('Matched On') + 1)
                               .getDisplayValue()).trim();
        check('a real MASTER number resolves to that client (' + sample.code + ')',
              gotCode === sample.code, 'got "' + gotCode + '"');
        check('...and reports it matched on PHONE, not name', gotOn === 'phone', 'got "' + gotOn + '"');

        // An unknown number must say "no match" — never silently resolve to somebody.
        sh.getRange(probe, CL_HEADERS.indexOf('Phone') + 1).setValue('0400000000');
        SpreadsheetApp.flush();
        var unknown = String(sh.getRange(probe, CL_HEADERS.indexOf('Matched Code') + 1)
                               .getDisplayValue()).trim();
        check('🔴 an unknown number matches NOBODY', unknown === '', 'got "' + unknown + '"');

        // 🔴 The dangerous one: a junk value normalises to nothing and must not match
        // whichever client has a blank number on file.
        sh.getRange(probe, CL_HEADERS.indexOf('Phone') + 1).setValue('unknown');
        SpreadsheetApp.flush();
        var junk = String(sh.getRange(probe, CL_HEADERS.indexOf('Matched Code') + 1)
                            .getDisplayValue()).trim();
        check('🔴 "unknown" in Phone matches NOBODY (not the blank-number client)',
              junk === '', 'got "' + junk + '"');
      }
    }
  } catch (e) {
    check('the lookup could be exercised', false, e.message);
  } finally {
    try {
      sh.getRange(probe, 1, 1, CL_HEADERS.length).clearContent();
      SpreadsheetApp.flush();
    } catch (ignore) {}
  }

  Logger.log('');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed' + (warn ? '  (' + warn + ' skipped)' : ''));
  if (fail === 0 && warn === 0) {
    Logger.log('CALL LOG READY — and the lookup is proven against real client data.');
  } else if (fail === 0) {
    Logger.log('⚠️  Structure is correct, but THE LOOKUP IS UNPROVEN — see the skip above.');
    Logger.log('   Do not rely on "no match" meaning "not a client" until this passes.');
  } else {
    Logger.log('🔴 DO NOT USE THIS TAB for call handling until the failures above are fixed.');
  }
}
