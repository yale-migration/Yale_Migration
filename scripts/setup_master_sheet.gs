/**
 * Yale Migration — ONE-TIME SHEET BUILDER
 * Builds the MASTER and ENQUIRIES tabs exactly per docs/MASTER-SHEET-SPEC.md v2
 * (columns reconciled with the client's live "Client Tracker", 29–30 Jul 2026).
 *
 * HOW TO RUN
 *  1. Open the "Yale Migration — MASTER DATABASE" sheet.
 *  2. Extensions -> Apps Script.
 *  3. Paste this whole file into a new file called setup_master_sheet.gs -> Save.
 *  4. Select function `setupEverything` -> Run -> Allow permissions.
 *  5. Done. Re-running rewrites headers/validation and never deletes data ROWS.
 *     ⚠️ Trailing COLUMNS are deleted ONLY when provably empty (D-145) — if they hold data the script
 *     stops and toasts instead. Even so: File → Make a copy BEFORE the first run on a live sheet.
 *
 *  RUN preflightCheck() FIRST — it reports what is already in the sheet and changes nothing.
 *
 * WHAT IT DOES
 *  - MASTER: 23 headers (A..W), bold dark header row, frozen, column widths, 9 dropdowns,
 *            date formats on the 5 date columns, warning-protection on row 1.
 *  - ENQUIRIES: 11 headers + 2 dropdowns.
 *  - Leaves FOLDER INVENTORY alone.
 */

/* ─────────────────── CONFIG ─────────────────── */

var MASTER_HEADERS = [
  'Client Code',          // A  auto (YM-2026-#####)
  'Their Client ID',      // B  their CL-### cross-reference
  'Full Name',            // C  <-- type here to trigger the code
  'Party 2 Name',         // D  dependent / employer / sponsor
  'Contact Number',       // E
  'Email Address',        // F  identity key (phone is unreliable)
  'Location',             // G  dropdown
  'Visa Type',            // H  dropdown
  'Visa Variant',         // I  dropdown
  'Office',               // J  dropdown
  'Team',                 // K  dropdown
  'Assigned Consultant',  // L  dropdown
  'Processing Stage',     // M  dropdown (their vocabulary)
  'Visa Outcome',         // N  dropdown
  'Grant Date',           // O  date
  'Visa Expiry',          // P  date
  'Refusal Reason',       // Q
  'Last Contact',         // R  date  (feeds dormancy detector)
  'Next Follow-up Due',   // S  date  (replaces their broken 48hr Alert)
  'Date Added',           // T  date  auto
  'Source',               // U  dropdown
  'Folder URL',           // V  written back by the folder scenario
  'Notes'                 // W
];

var MASTER_DROPDOWNS = {
  7:  ['Onshore', 'Offshore'],                                                          // G Location
  8:  ['500','485','820/801','300','482','407','186','494','189','190','191','491',
       '600','101','802','417','SBS','Nomination','Skills Assessment','EOI','ART',
       'Bridging','Other'],                                                             // H Visa Type
       // SBS + Nomination added 2 Aug (D-138): employer-side matters route to folder SET 2, but
       // setAllowInvalid(false) below would have REJECTED them — every sponsorship matter was a dead end.
  9:  ['Main','Dependent','Subsequent Entrant','Sponsor','Employer'],                   // I Visa Variant
  10: ['BRISBANE','TOWNSVILLE','PHILIPPINES'],                                          // J Office
  11: ['INDIAN','FILIPINO'],                                                            // K Team
  12: ['Robinder','Inder','Gayatri','Priyanka','Fiza','RJ','Star','Rey','Cristelle',
       'Unassigned'],                                                                   // L Consultant
  13: ['Enquiry','Engaged','Documents Pending','Documents Complete','Ready for Lodgement',
       'Lodged','Awaiting Outcome','Closed'],                                           // M Stage
  14: ['Pending','Granted','Refused','Withdrawn'],                                      // N Outcome
  21: ['Facebook','Instagram','WhatsApp','Phone','Walk-in','Email','Website','Referral'] // U Source
};

var MASTER_DATE_COLS  = [15, 16, 18, 19, 20];   // O P R S T
var MASTER_WIDTHS = { 1:130, 2:110, 3:230, 4:190, 5:130, 6:230, 7:100, 8:110, 9:150,
                      10:120, 11:110, 12:160, 13:170, 14:120, 15:110, 16:110, 17:220,
                      18:110, 19:140, 20:110, 21:110, 22:260, 23:320 };

var ENQUIRY_HEADERS = ['Date','Name','Phone','Email','Channel','Visa Interest','Location',
                       'Assigned To','Status','Follow-up Due','Notes'];
var ENQUIRY_DROPDOWNS = {
  5: ['Facebook','Instagram','WhatsApp','Phone','Walk-in','Email','Website','Referral'],  // Channel
  7: ['Onshore','Offshore'],                                                              // Location
  8: ['Robinder','Inder','Gayatri','Priyanka','Fiza','RJ','Star','Rey','Cristelle',
      'Unassigned'],                                                                      // Assigned To
  9: ['New','Assigned','Contacted','Pending Decision','Not Proceeding','Lost Lead',
      'Converted']                                                                        // Status
};

var VALIDATION_ROWS = 999;   // apply dropdowns to rows 2..1000

/* ─────────────────── MAIN ─────────────────── */

function setupEverything() {
  var ss = SpreadsheetApp.getActive();
  buildSheet_(ss, 'MASTER',    MASTER_HEADERS,  MASTER_DROPDOWNS,  MASTER_DATE_COLS, MASTER_WIDTHS);
  buildSheet_(ss, 'ENQUIRIES', ENQUIRY_HEADERS, ENQUIRY_DROPDOWNS, [1, 10],          null);
  SpreadsheetApp.getActive().toast('Setup complete — MASTER and ENQUIRIES are ready.', 'Yale Migration', 8);
}

/* ─────────────────── HELPERS ─────────────────── */

function buildSheet_(ss, name, headers, dropdowns, dateCols, widths) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);

  // 0. CLEAR STALE v1 DATA-VALIDATION **FIRST** — before writing anything (D-155).
  //    The 25 Jul v1 build left a list-restricted dropdown on ROW 1 (cell F1: Stage/Enquiry/Engaged/...).
  //    Writing a header into a validated cell THROWS:
  //      "The data you entered in cell F1 violates the data validation rules set on this cell."
  //    Clearing after the header write (the original order) was too late — setValues never got to run.
  //    Also clears validation left on old data rows, which would otherwise reject valid v2 entry.
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearDataValidations();

  // 1. headers
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);

  // 2. header styling
  sh.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1f2937')      // dark charcoal
    .setFontColor('#ffffff')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sh.setRowHeight(1, 34);
  sh.setFrozenRows(1);

  // rows 2..N, clamped so a trimmed sheet cannot throw "those rows are out of bounds" mid-run
  var vRows = Math.max(1, Math.min(VALIDATION_ROWS, sh.getMaxRows() - 1));

  // 3. dropdowns
  Object.keys(dropdowns).forEach(function (colStr) {
    var col  = parseInt(colStr, 10);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dropdowns[colStr], true)
      .setAllowInvalid(false)      // reject typos so reporting stays clean
      .setHelpText('Pick from the list — values are used by the automation.')
      .build();
    sh.getRange(2, col, vRows, 1).setDataValidation(rule);
  });

  // 4. date formats
  (dateCols || []).forEach(function (col) {
    sh.getRange(2, col, vRows, 1).setNumberFormat('yyyy-mm-dd');
  });

  // 5. column widths
  if (widths) {
    Object.keys(widths).forEach(function (colStr) {
      sh.setColumnWidth(parseInt(colStr, 10), widths[colStr]);
    });
  }

  // 6. protect the header row (warning-only: nobody gets locked out, but accidents are caught)
  var existing = sh.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < existing.length; i++) {
    try {
      if (existing[i].getDescription() === 'Header row — do not edit') existing[i].remove();
    } catch (err) { /* protection owned by another account — ignore, not worth aborting setup */ }
  }
  sh.getRange(1, 1, 1, headers.length).protect()
    .setDescription('Header row — do not edit')
    .setWarningOnly(true);

  // 7. tidy: remove unused trailing columns — ONLY if they are provably EMPTY.
  //    D-145: these tabs were hand-built 25 Jul under the v1 layout, so they are NOT blank.
  //    An unconditional deleteColumns here would destroy live client data with no undo
  //    (a script-side delete is not in the user's Ctrl+Z stack).
  var maxCols = sh.getMaxColumns();
  var extra   = maxCols - headers.length;
  if (extra > 0) {
    var lastRow  = Math.max(sh.getLastRow(), 1);
    var tailVals = sh.getRange(1, headers.length + 1, lastRow, extra).getValues();
    var tailEmpty = tailVals.every(function (row) {
      return row.every(function (c) { return c === '' || c === null; });
    });
    if (tailEmpty) {
      sh.deleteColumns(headers.length + 1, extra);
    } else {
      SpreadsheetApp.getActive().toast(
        name + ': columns right of ' + headers.length + ' contain data — LEFT IN PLACE, nothing deleted. ' +
        'Review them manually.', 'Yale Migration — safety stop', 15);
    }
  }
}


/**
 * PREFLIGHT — run this BEFORE setupEverything(). Changes nothing; reports what is already in the sheet.
 * Added 2026-08-02 (D-145) because MASTER/ENQUIRIES were hand-built on 25 Jul under the superseded v1
 * layout, and the setup scripts were originally written assuming empty tabs.
 */
function preflightCheck() {
  var ss = SpreadsheetApp.getActive();
  var out = ['PREFLIGHT — ' + ss.getName(), ''];
  [['MASTER', MASTER_HEADERS.length], ['ENQUIRIES', ENQUIRY_HEADERS.length]].forEach(function (pair) {
    var nm = pair[0], want = pair[1];
    var sh = ss.getSheetByName(nm);
    if (!sh) { out.push(nm + ': does not exist yet — will be created cleanly ✅'); return; }
    var lastRow = sh.getLastRow(), lastCol = sh.getLastColumn(), maxCols = sh.getMaxColumns();
    out.push(nm + ': ' + lastRow + ' rows, data to col ' + lastCol + ', ' + maxCols + ' columns allocated');
    if (lastCol > want) {
      out.push('   ⚠️ DATA beyond the ' + want + ' headers (col ' + (want + 1) + '+). Setup will NOT delete it, but review it.');
    }
    if (lastRow > 1) {
      out.push('   ⚠️ ' + (lastRow - 1) + ' existing data row(s) — these are KEPT. Legacy v1 rows put the NAME in column B;');
      out.push('      v2 expects it in column C. Clear or migrate old test rows before relying on the codes.');
      var formulas = sh.getRange(2, 1, lastRow - 1, Math.max(lastCol, 1)).getFormulas();
      var withF = [];
      formulas.forEach(function (row, r) {
        row.forEach(function (f, c) { if (f) withF.push('R' + (r + 2) + 'C' + (c + 1)); });
      });
      if (withF.length) {
        out.push('   🔴 FORMULAS present at: ' + withF.slice(0, 12).join(', ') + (withF.length > 12 ? ' …' : ''));
        out.push('      master_codes.gs writes VALUES into A and T — a formula there would be replaced. Remove it first.');
      }
    }
    if (sh.getMaxRows() < 1000) out.push('   ℹ️ only ' + sh.getMaxRows() + ' rows — validation will be clamped, not an error.');
  });
  out.push('', 'Nothing was changed. Take File → Make a copy before running setupEverything().');
  var msg = out.join('\n');
  Logger.log(msg);
  ss.toast('Preflight done — see Execution log (Ctrl+Enter)', 'Yale Migration', 10);
  return msg;
}
