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
 *  5. Done. Re-running is SAFE (idempotent): it rewrites headers/validation, never deletes data rows.
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
       '600','101','802','417','Skills Assessment','EOI','ART','Bridging','Other'],     // H Visa Type
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

  // 3. dropdowns (rows 2..VALIDATION_ROWS+1)
  Object.keys(dropdowns).forEach(function (colStr) {
    var col  = parseInt(colStr, 10);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dropdowns[colStr], true)
      .setAllowInvalid(false)      // reject typos so reporting stays clean
      .setHelpText('Pick from the list — values are used by the automation.')
      .build();
    sh.getRange(2, col, VALIDATION_ROWS, 1).setDataValidation(rule);
  });

  // 4. date formats
  (dateCols || []).forEach(function (col) {
    sh.getRange(2, col, VALIDATION_ROWS, 1).setNumberFormat('yyyy-mm-dd');
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
    if (existing[i].getDescription() === 'Header row — do not edit') existing[i].remove();
  }
  sh.getRange(1, 1, 1, headers.length).protect()
    .setDescription('Header row — do not edit')
    .setWarningOnly(true);

  // 7. tidy: remove unused trailing columns so the sheet reads cleanly
  var maxCols = sh.getMaxColumns();
  if (maxCols > headers.length) {
    sh.deleteColumns(headers.length + 1, maxCols - headers.length);
  }
}
