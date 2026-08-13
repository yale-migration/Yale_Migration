/**
 * seed_demo_rows.gs — puts 14 clearly-fake matters into MASTER so the DASHBOARD can be
 * proven to work with data in it, and so there is something to look at before the real
 * client list arrives.
 *
 * WHY THIS EXISTS: MASTER is empty, so every dashboard number reads 0. A QUERY that is
 * subtly wrong looks identical to a QUERY over no rows. This is the only way to tell
 * them apart before real data lands.
 *
 * ⚠️  THIS IS SAMPLE DATA, NOT CLIENTS.
 *   - every code is DEMO-### so it can never be confused with a real YM-2026-##### code
 *   - every name is invented; no real person appears here
 *   - removeDemoRows() takes all of it out again, cleanly
 *   - 🔴 REMOVE IT BEFORE THE CUTOVER IMPORT (CUTOVER-PLAN.md step 2)
 *
 * SAFE: M3 and M4 are both INACTIVE, so nothing here creates folders or copies files.
 *
 * 🔴 THE DEMO- CODE DOES NOT SURVIVE. master_codes.gs runs every 5 minutes and treats ANY
 * value that is not a valid YM-2026-##### as "needs a code" — so it OVERWRITES DEMO-001
 * with a real code. The prefix is a label for the first five minutes, nothing more.
 * The durable marker is the EMAIL (@example.com, reserved by RFC 2606). removeDemoRows()
 * matches on that. See D-296.
 *
 * ── history, 13 Aug ──────────────────────────────────────────────────────────
 * v1  threw "Exception: 485 only. Blank for every other visa type." — column X's
 *     help text, but X was not the fault. The offender was 'REY'; column L's list
 *     holds 'Rey'. Dropdown matching is case-sensitive, and Sheets reports whichever
 *     rule's help text it reaches first, NOT the rule that failed.
 * v2  fixed 'Rey' and added a pre-flight. It still failed, and taught two more things:
 *       · the pre-flight only understood VALUE_IN_LIST / VALUE_IN_RANGE, so a rule of
 *         any other kind was skipped — "pre-flight passed" was a FALSE pass;
 *       · setValues() is LAZY. The write, and therefore the validation, happens at
 *         flush(). Our flush sat outside the try/catch, so the exception escaped and
 *         the row-by-row fallback never ran — leaving a PARTIAL write behind.
 * v3  writes one row at a time with flush INSIDE the try, so a bad row is skipped and
 *     named while the rest still land. Column X (Skills Authority) is left blank on
 *     every row: it is the one column whose rule we cannot fully read, and no
 *     dashboard view uses it. inspectValidation() now dumps every rule on demand.
 *
 * RUN:  MASTER → Extensions → Apps Script → Run → seedDemoRows
 *       to undo:                                Run → removeDemoRows
 *       to diagnose a rejection:                Run → inspectValidation
 */

var SEED_TAB    = 'MASTER';
var DEMO_PREFIX = 'DEMO-';
var FOLDER_STUB = 'https://onedrive.live.com/?id=DEMO';

/** Columns carrying a dropdown, and their human names — used by the pre-flight. */
var CHECK_COLS = {
  7: 'G Location', 8: 'H Visa Type', 9: 'I Visa Variant', 10: 'J Office', 11: 'K Team',
  12: 'L Consultant', 13: 'M Stage', 14: 'N Outcome', 21: 'U Source', 24: 'X Skills Authority'
};

function seedDemoRows() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('ABORTED — no tab named "' + SEED_TAB + '".'); return; }

  if (countDemo_(sh) > 0) {
    Logger.log('Demo rows are already present. Run removeDemoRows() first for a clean reseed.');
    return;
  }

  var rows = demoRows_();

  // ---- pre-flight: check every value against the sheet's OWN validation lists ----
  var problems = preflight_(sh, rows);
  if (problems.length) {
    Logger.log('ABORTED — ' + problems.length + ' value(s) would be rejected by MASTER\'s dropdowns.');
    Logger.log('Nothing was written. Fix these and re-run:');
    problems.forEach(function (p) { Logger.log('  • ' + p); });
    return;
  }
  Logger.log('Pre-flight passed — every value is legal for its dropdown.');

  // ---- write, ONE ROW AT A TIME ----
  // setValues() is lazy: the write — and therefore the validation check — actually
  // happens at flush(). A flush outside the try/catch means the exception escapes and
  // the fallback never runs, which is exactly what happened on the v2 attempt.
  // So: one row, one flush, both inside the try. A rejected row is skipped and named;
  // the rest still land, so the dashboard gets data even if something is off.
  var written = 0, failed = [];
  for (var i = 0; i < rows.length; i++) {
    try {
      sh.getRange(sh.getLastRow() + 1, 1, 1, rows[i].length).setValues([rows[i]]);
      SpreadsheetApp.flush();               // inside the try — this is where it throws
      written++;
    } catch (e) {
      failed.push(rows[i][0] + ' — ' + e.message);
    }
  }

  if (failed.length) {
    Logger.log('⚠️ ' + failed.length + ' row(s) rejected:');
    failed.forEach(function (f) { Logger.log('  ✖ ' + f); });
    Logger.log('Run inspectValidation() to see exactly which rule is doing it.');
  }
  Logger.log(written + ' of ' + rows.length + ' demo rows added.');
  Logger.log('Open the DASHBOARD tab. Expected headline numbers:');
  Logger.log('  14 clients · 12 open · 4 going quiet · 1 granted · 4 no folder · 6 no checklist');
  Logger.log('REMOVE BEFORE THE REAL IMPORT:  Run → removeDemoRows');
}

function removeDemoRows() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('ABORTED — no tab named "' + SEED_TAB + '".'); return; }

  var last = sh.getLastRow();
  if (last < 2) { Logger.log('Nothing to remove — sheet is empty.'); return; }

  // 🔴 DO NOT match on the DEMO- code alone. master_codes.gs treats ANY value that is not
  // a valid YM-2026-##### as "uncoded" and overwrites it — so within 5 minutes of seeding,
  // every DEMO-001 has already been replaced by a real code. The prefix guard was built on
  // a wrong reading of that script (D-296).
  // The durable marker is the EMAIL: example.com is reserved for testing (RFC 2606) and no
  // script touches column F, so it survives.
  var rows = sh.getRange(2, 1, last - 1, 6).getValues();   // A..F
  var removed = 0;
  // bottom-up, so deleting a row never shifts the ones still to check
  for (var i = rows.length - 1; i >= 0; i--) {
    var isDemo = String(rows[i][0]).indexOf(DEMO_PREFIX) === 0 ||
                 String(rows[i][5]).toLowerCase().indexOf('@example.com') > -1;
    if (isDemo) { sh.deleteRow(i + 2); removed++; }
  }
  SpreadsheetApp.flush();
  Logger.log(removed + ' demo rows removed. MASTER holds only real clients now.');
}

/**
 * Diagnostic — dumps every validation rule on MASTER so a rejection can never be a
 * mystery again. Run it any time a write is refused. Reads only; changes nothing.
 */
function inspectValidation() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('No tab named "' + SEED_TAB + '".'); return; }

  Logger.log('Validation rules on ' + SEED_TAB + ' row 2:');
  var headers = sh.getRange(1, 1, 1, 25).getValues()[0];
  for (var col = 1; col <= 25; col++) {
    var dv = sh.getRange(2, col).getDataValidation();
    var letter = String.fromCharCode(64 + col);
    if (!dv) { Logger.log('  ' + letter + ' ' + headers[col - 1] + ' — no rule'); continue; }
    var type = String(dv.getCriteriaType());
    var vals = dv.getCriteriaValues().map(function (v) {
      if (Object.prototype.toString.call(v) === '[object Array]') return v.join(' | ');
      if (v && typeof v.getA1Notation === 'function') return 'range ' + v.getA1Notation();
      return String(v);
    }).join('  ~  ');
    Logger.log('  ' + letter + ' ' + headers[col - 1] +
               '\n      type: ' + type +
               '\n      values: ' + vals +
               '\n      allowInvalid: ' + dv.getAllowInvalid() +
               '\n      help: ' + (dv.getHelpText() || '(none)'));
  }
}

/* ------------------------------------------------------------------ repair */

/**
 * ONE-CLICK REPAIR + RESEED. Run this.
 *   1. reports what validation sits on column Y
 *   2. strips it — Y is "Checklist Filed", a free-text done-marker; it should have none
 *   3. clears every data row from MASTER (it holds no real clients yet)
 *   4. reseeds the 14 demo rows
 */
function repairAndReseed() {
  clearChecklistFiledValidation();
  resetMasterRows();
  seedDemoRows();
}

/**
 * Column Y inherited column X's Skills Authority dropdown.
 * setup_m4_checklist_map.gs creates Y with insertColumnsAfter(), and Sheets copies
 * formatting AND data validation from the column to the left — which was X.
 * So "Checklist Filed" has been silently carrying a 5-value dropdown that rejects
 * every filename M4 puts in it. Read-only writes through the Sheets API (i.e. Make)
 * are unaffected, which is why M4's 8 runs never errored — but any Apps Script write
 * or manual entry is refused. Strip it.
 */
function clearChecklistFiledValidation() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('No tab named "' + SEED_TAB + '".'); return; }

  var col = 25;                                    // Y — Checklist Filed
  var dv  = sh.getRange(2, col).getDataValidation();
  if (!dv) { Logger.log('Column Y already has no validation rule — nothing to strip.'); return; }

  Logger.log('Column Y is carrying a rule that does not belong to it:');
  Logger.log('   type: ' + dv.getCriteriaType());
  Logger.log('   help: ' + (dv.getHelpText() || '(none)'));
  sh.getRange(2, col, sh.getMaxRows() - 1, 1).clearDataValidations();
  SpreadsheetApp.flush();
  Logger.log('✅ Stripped. "Checklist Filed" is free text again, as M4 expects.');
}

/**
 * Clears every data row from MASTER. Safe right now — MASTER holds no real clients
 * (the dashboard read 0 before any seeding). Logs everything it deletes first, so
 * there is a record if anything unexpected is in there.
 */
function resetMasterRows() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SEED_TAB);
  if (!sh) { Logger.log('No tab named "' + SEED_TAB + '".'); return; }

  var last = sh.getLastRow();
  if (last < 2) { Logger.log('MASTER already has no data rows.'); return; }

  var n = last - 1;
  var seen = sh.getRange(2, 1, n, 3).getValues();
  Logger.log('Removing ' + n + ' row(s) from MASTER:');
  seen.forEach(function (r, i) {
    Logger.log('   row ' + (i + 2) + ': ' + (r[0] || '(no code)') + ' · ' + (r[2] || '(no name)'));
  });

  sh.deleteRows(2, n);
  SpreadsheetApp.flush();
  Logger.log('✅ MASTER is empty and ready for a clean seed.');
}

/* -------------------------------------------------------------- pre-flight */

/** The allowed values for a column, read live from the sheet. null = no dropdown. */
function allowedFor_(sh, col) {
  var dv = sh.getRange(2, col).getDataValidation();
  if (!dv) return null;
  var type = dv.getCriteriaType();
  var vals = dv.getCriteriaValues();
  if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) return vals[0];
  if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
    return vals[0].getValues().map(function (r) { return r[0]; })
                  .filter(function (v) { return v !== '' && v !== null; });
  }
  return null;
}

function preflight_(sh, rows) {
  var problems = [];
  Object.keys(CHECK_COLS).forEach(function (key) {
    var col     = Number(key);
    var allowed = allowedFor_(sh, col);
    if (!allowed) return;                       // no dropdown on this column
    rows.forEach(function (row) {
      var v = row[col - 1];
      if (v === '' || v === null) return;       // blank is always acceptable
      if (allowed.indexOf(v) === -1) {
        problems.push(row[0] + ' · ' + CHECK_COLS[key] + ' · "' + v +
                      '" is not allowed. Allowed: ' + allowed.join(' | '));
      }
    });
  });
  return problems;
}

/* ------------------------------------------------------------------- data */

function countDemo_(sh) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  return sh.getRange(2, 1, last - 1, 1).getValues().filter(function (r) {
    return String(r[0]).indexOf(DEMO_PREFIX) === 0;
  }).length;
}

/** days ago → Date */
function ago_(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * A–Y, 25 columns.
 * Every dropdown value below is copied EXACTLY from setup_master_sheet.gs — note
 * 'Rey' not 'REY', and 'Pending' rather than blank for an undecided outcome.
 * Skills Authority (X) is filled ONLY on 485 rows, per that column's own rule.
 */
function demoRows_() {
  var F = FOLDER_STUB, B = '', P = 'Pending';
  return [
    // ---- open, contacted recently ---------------------------------------------
    r_('001','CL-101','ANJALI SHARMA',     B,'0412 000 101','demo101@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Documents Pending',P,B,B,B, ago_(3),  B, ago_(40),'Referral', F,B,B,'485_INDIVIDUAL_MASTERS-BACHELORS.pdf'),
    r_('002','CL-102','MARIA SANTOS',      B,'0412 000 102','demo102@example.com','Onshore','482','Main',
       'BRISBANE','FILIPINO','Rey','Documents Complete',P,B,B,B, ago_(2), B, ago_(35),'Facebook', F,B,B,'482_SKILLS-IN-DEMAND.pdf'),
    r_('003','CL-103','HARPREET SINGH',    B,'0412 000 103','demo103@example.com','Onshore','189','Main',
       'BRISBANE','INDIAN','RJ','Ready for Lodgement',P,B,B,B, ago_(1), B, ago_(60),'Website', F,B,B,'189_SKILLED-INDEPENDENT.pdf'),
    r_('004','CL-104','JOSE REYES',        B,'0412 000 104','demo104@example.com','Offshore','500','Main',
       'BRISBANE','FILIPINO','Rey','Lodged',P,B,B,B, ago_(5), B, ago_(70),'Instagram', F,B,B,'500_STUDENT-OFFSHORE.pdf'),
    r_('005','CL-105','NEHA PATEL',        B,'0412 000 105','demo105@example.com','Onshore','190','Main',
       'BRISBANE','INDIAN','Star','Lodged',P,B,B,B, ago_(6), B, ago_(85),'Referral', F,B,B,'190_SKILLED-NOMINATED.docx'),
    r_('006','CL-106','GRACE MENDOZA',     B,'0412 000 106','demo106@example.com','Onshore','407','Main',
       'BRISBANE','FILIPINO','Rey','Lodged',P,B,B,B, ago_(4), B, ago_(52),'WhatsApp', F,B,B,'407_TRAINING.pdf'),

    // ---- going quiet — these four should shade red in view 4 -------------------
    r_('007','CL-107','RAJESH KUMAR',      B,'0412 000 107','demo107@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Documents Pending',P,B,B,B, ago_(25), ago_(11), ago_(48),'Walk-in', B,B,B,B),
    r_('008','CL-108','ANA CRUZ',          B,'0412 000 108','demo108@example.com','Onshore','820/801','Main',
       'BRISBANE','FILIPINO','Rey','Documents Pending',P,B,B,B, ago_(19), ago_(5), ago_(44),'Phone', B,B,B,B),
    r_('009','CL-109','SIMRAN KAUR',       B,'0412 000 109','demo109@example.com','Onshore','491','Main',
       'TOWNSVILLE','INDIAN','RJ','Documents Pending',P,B,B,B, ago_(31), ago_(17), ago_(66),'Referral', B,B,B,B),
    r_('010','CL-110','MARK VILLANUEVA',   B,'0412 000 110','demo110@example.com','Onshore','189','Main',
       'TOWNSVILLE','FILIPINO','Star','Documents Pending',P,B,B,B, ago_(16), ago_(2), ago_(38),'Email', B,B,B,B),

    // ---- variants, so the visa mix is not all "Main" ---------------------------
    r_('011','CL-111','DEV SHARMA','ANJALI SHARMA','0412 000 111','demo111@example.com','Onshore','485','Dependent',
       'BRISBANE','INDIAN','Star','Documents Pending',P,B,B,B, ago_(12), B, ago_(40),'Referral', F,B,B,B),
    r_('012','CL-112','LIWAYWAY DELA CRUZ','JOSE REYES','0412 000 112','demo112@example.com','Onshore','500','Subsequent Entrant',
       'BRISBANE','FILIPINO','Rey','Documents Complete',P,B,B,B, ago_(4), B, ago_(30),'WhatsApp', F,B,B,B),

    // ---- decided, so the outcomes view is not empty ----------------------------
    r_('013','CL-113','PRIYA MEHTA',       B,'0412 000 113','demo113@example.com','Onshore','485','Main',
       'BRISBANE','INDIAN','RJ','Closed','Granted', ago_(9), B, B, ago_(9), B, ago_(150),'Website', F,B,B,'485_INDIVIDUAL_MASTERS-BACHELORS.pdf'),
    r_('014','CL-114','CARLO BAUTISTA',    B,'0412 000 114','demo114@example.com','Offshore','500','Main',
       'BRISBANE','FILIPINO','Rey','Closed','Refused', B, B,'Insufficient financial capacity evidence', ago_(14), B, ago_(120),'Facebook', B,B,B,B)
  ];
}

function r_(n, theirId, name, party2, phone, email, loc, visa, variant, office, team,
            consultant, stage, outcome, grant, expiry, refusal, lastContact, nextDue,
            added, source, folder, notes, authority, checklist) {
  return [DEMO_PREFIX + n, theirId, name, party2, phone, email, loc, visa, variant, office, team,
          consultant, stage, outcome, grant, expiry, refusal, lastContact, nextDue,
          added, source, folder, notes, authority, checklist];
}
