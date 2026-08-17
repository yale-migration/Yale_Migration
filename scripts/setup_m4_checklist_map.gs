/**
 * M4 SETUP — runs ONCE. Two jobs, both idempotent, both safe to re-run.
 *   1. Adds column Y "Checklist Filed" to MASTER  (the done-marker, same role as Folder URL for M3)
 *   2. Creates the CHECKLIST MAP tab — the lookup M4 uses to pick the right file
 *
 * Read results in the Execution log. NO getUi() — that hangs when run from the editor (D-245).
 */
var CF_HEADER = 'Checklist Filed';
var CF_COL    = 25;            // column Y
var MAP_TAB   = 'CHECKLIST MAP';

// Visa Type | Dependent (Y/N) | Authority or Location | Canonical filename
// Dependent = Y when Party 2 Name (col D) is filled.
// Anything NOT listed here routes to Needs Review — deliberately.
//
// ⛔ THIS LINE USED TO READ: "(D-236: no 190 checklist exists)".
// It was true when written. It stopped being true on 11 Aug, when A-02 closed and the
// corrected 190 checklist arrived and was filed as 190_SKILLED-NOMINATED.docx (D-280) —
// after we had asked Robinder for it THREE times. Nobody came back to this line, so 190
// stayed out of the map for a week, every 190 client was stamped
// 'NO CHECKLIST MAPPED — review', and the document we chased hardest was never filed.
//
// 🔑 A comment stating a FACT ABOUT THE OUTSIDE WORLD is a fact with no expiry date on it.
// This one outlived its truth and was believed anyway (D-325).
var MAP_ROWS = [
  ['485','N','ACECQA','485_INDIVIDUAL_ACECQA.pdf'],
  ['485','N','TRA','485_INDIVIDUAL_TRA.pdf'],
  ['485','N','VETASSESS','485_INDIVIDUAL_VETASSESS.docx'],
  ['485','N','Not required (Bachelor/Masters)','485_INDIVIDUAL_MASTERS-BACHELORS.pdf'],
  ['485','N','Engineers Australia','485_INDIVIDUAL_MASTERS-BACHELORS.pdf'],
  ['485','Y','ACECQA','485_DEPENDENT_ACECQA.pdf'],
  ['485','Y','TRA','485_DEPENDENT_TRA.pdf'],
  ['485','Y','VETASSESS','485_DEPENDENT_VETASSESS.pdf'],
  ['485','Y','Not required (Bachelor/Masters)','485_DEPENDENT_MASTERS-BACHELORS.pdf'],
  ['485','Y','Engineers Australia','485_DEPENDENT_MASTERS-BACHELORS.pdf'],
  ['500','N','Onshore','500_INDIVIDUAL_ONSHORE.pdf'],
  ['500','N','Offshore','500_INDIVIDUAL_OFFSHORE.pdf'],
  ['500','Y','Onshore','500_DEPENDENT_ONSHORE.pdf'],
  ['500','Y','Offshore','500_DEPENDENT_OFFSHORE.pdf'],
  ['482','N','','482_SKILLS-IN-DEMAND.docx'],  ['482','Y','','482_SKILLS-IN-DEMAND.docx'],
  ['SBS','N','','482_SKILLS-IN-DEMAND.docx'],  ['SBS','Y','','482_SKILLS-IN-DEMAND.docx'],
  ['Nomination','N','','482_SKILLS-IN-DEMAND.docx'], ['Nomination','Y','','482_SKILLS-IN-DEMAND.docx'],
  ['407','N','','407_TRAINING.docx'],          ['407','Y','','407_TRAINING.docx'],
  ['820/801','N','','820-801_PARTNER.docx'],   ['820/801','Y','','820-801_PARTNER.docx'],
  ['189','N','','189_SKILLED-INDEPENDENT.docx'], ['189','Y','','189_SKILLED-INDEPENDENT.docx'],
  ['491','N','','491_SKILLED-REGIONAL.docx'],  ['491','Y','','491_SKILLED-REGIONAL.docx'],
  ['494','N','','494_EMPLOYER-REGIONAL.docx'], ['494','Y','','494_EMPLOYER-REGIONAL.docx'],
  ['802','N','','802_CHILD.docx'],             ['802','Y','','802_CHILD.docx'],
  ['101','N','','101-802_CHILD-VISAS.docx'],   ['101','Y','','101-802_CHILD-VISAS.docx'],
  ['417','N','','417_WORKING-HOLIDAY.pdf'],    ['417','Y','','417_WORKING-HOLIDAY.pdf'],
  // 🔴 ADDED 18 Aug (D-325). 190 was in M4's router and in MASTER's dropdown, and the
  // checklist file has been sitting in docs/05-canonical-checklists since 11 Aug — but
  // it had NO ROW HERE, so every 190 client was stamped 'NO CHECKLIST MAPPED — review'
  // and the checklist was never filed.
  //
  // This is the checklist we asked Robinder for THREE TIMES (A-02, D-280): v1 and v2
  // both described 491/189/regional under a 190 heading. We chased it, he corrected it
  // twice, we filed it — and then never connected it.
  //
  // Worse, verify_blueprints.py contained a check that ASSERTED this behaviour:
  //   "visa 190 reaches route A (so the guard stamps it even with no MAP row)"
  // A passing test that encodes the bug as expected behaviour. Replaced.
  ['190','N','','190_SKILLED-NOMINATED.docx'], ['190','Y','','190_SKILLED-NOMINATED.docx']
];

function setupM4() {
  var ss = SpreadsheetApp.getActive();
  addChecklistFiledColumn_(ss);
  buildChecklistMap_(ss);
  SpreadsheetApp.flush();
  Logger.log('M4 SETUP COMPLETE.');
}

function addChecklistFiledColumn_(ss) {
  var sh = ss.getSheetByName('MASTER');
  if (!sh) { Logger.log('ERROR: MASTER tab not found.'); return; }
  var hdr = sh.getRange(1, 1, 1, sh.getMaxColumns()).getValues()[0];
  for (var i = 0; i < hdr.length; i++) {
    if (String(hdr[i]).trim() === CF_HEADER) { Logger.log('Column "' + CF_HEADER + '" already present.'); return; }
  }
  if (sh.getMaxColumns() < CF_COL) sh.insertColumnsAfter(sh.getMaxColumns(), CF_COL - sh.getMaxColumns());
  var ref = sh.getRange(1, 1);
  sh.getRange(1, CF_COL).setValue(CF_HEADER)
    .setFontWeight('bold').setFontColor(ref.getFontColor()).setBackground(ref.getBackground());
  sh.setColumnWidth(CF_COL, 230);
  Logger.log('Added "' + CF_HEADER + '" as column Y.');
}

function buildChecklistMap_(ss) {
  var sh = ss.getSheetByName(MAP_TAB);
  if (!sh) sh = ss.insertSheet(MAP_TAB);
  sh.clear();                                   // safe: this tab is generated, never hand-edited data
  var head = ['Visa Type', 'Dependent', 'Authority or Location', 'Checklist File'];
  sh.getRange(1, 1, 1, 4).setValues([head])
    .setFontWeight('bold').setBackground('#1f2430').setFontColor('#ffffff');
  sh.getRange(2, 1, MAP_ROWS.length, 4).setValues(MAP_ROWS);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 110); sh.setColumnWidth(2, 100);
  sh.setColumnWidth(3, 240); sh.setColumnWidth(4, 330);
  // Drop our own previous protection first. sh.clear() does NOT remove protections, so
  // re-running this "idempotent" setup was stacking a new protected range every time.
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (pr) {
    if (pr.getDescription() === 'M4 lookup — edit values, not headers') pr.remove();
  });
  sh.getRange(1, 1, 1, 4).protect().setDescription('M4 lookup — edit values, not headers');
  Logger.log('CHECKLIST MAP built with ' + MAP_ROWS.length + ' rows.');
}
