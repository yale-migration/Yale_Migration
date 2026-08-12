/**
 * ADD COLUMN X — "Skills Authority"  (D-237, approved by client 6 Aug)
 * Standalone and idempotent. Run ONCE from the MASTER spreadsheet's Apps Script editor.
 * Does NOT touch A–W. Safe to re-run: it detects an existing column and exits.
 *
 * WHY THIS EXISTS: 485 has 8 checklist variants keyed on the assessing authority.
 * That value is in neither MASTER (A–W) nor the client's own tracker (D-226), so
 * M4 cannot select the right checklist without it.
 */
var SA_HEADER = 'Skills Authority';
var SA_COL    = 24;              // column X
var SA_VALUES = [
  'ACECQA',                      // childcare / early childhood
  'TRA',                         // trades — has a real tracker with logins + step (client, 6 Aug)
  'VETASSESS',                   // portal only, no tracker
  'Engineers Australia',         // CDR occupations — added from the client's own CDR answer
  'Not required (Bachelor/Masters)'
];

function addSkillsAuthorityColumn() {
  var sh = SpreadsheetApp.getActive().getSheetByName('MASTER');
  if (!sh) throw new Error('MASTER tab not found — open the script FROM the sheet.');

  // idempotency guard (DoD item 2) — never create a second column
  var existing = sh.getRange(1, 1, 1, sh.getMaxColumns()).getValues()[0];
  for (var i = 0; i < existing.length; i++) {
    if (String(existing[i]).trim() === SA_HEADER) {
      SpreadsheetApp.getUi().alert('Already present in column ' +
        columnLetter_(i + 1) + ' — nothing to do.');
      return;
    }
  }
  if (sh.getMaxColumns() < SA_COL) sh.insertColumnsAfter(sh.getMaxColumns(), SA_COL - sh.getMaxColumns());

  // header, styled to match A–W
  var h = sh.getRange(1, SA_COL);
  var ref = sh.getRange(1, 1);
  h.setValue(SA_HEADER)
   .setFontWeight('bold')
   .setFontColor(ref.getFontColor())
   .setBackground(ref.getBackground());
  sh.setColumnWidth(SA_COL, 190);

  // dropdown on the data rows only — never row 1
  var lastRow = Math.max(sh.getMaxRows(), 1000);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(SA_VALUES, true)
    .setAllowInvalid(false)     // matches the other 9 dropdowns
    .setHelpText('485 only. Blank for every other visa type.')
    .build();
  sh.getRange(2, SA_COL, lastRow - 1, 1).setDataValidation(rule);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Skills Authority added as column X with ' + SA_VALUES.length + ' options.\n\n' +
    'Fill it for 485 clients only. Leave blank for everything else.');
}

function columnLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}
