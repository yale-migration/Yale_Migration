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
// Anything NOT listed here routes to Needs Review — deliberately (D-236: no 190 checklist exists).
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
  ['417','N','','417_WORKING-HOLIDAY.pdf'],    ['417','Y','','417_WORKING-HOLIDAY.pdf']
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
  sh.getRange(1, 1, 1, 4).protect().setDescription('M4 lookup — edit values, not headers');
  Logger.log('CHECKLIST MAP built with ' + MAP_ROWS.length + ' rows.');
}
