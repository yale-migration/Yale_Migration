/**
 * setup_dashboard_tab.gs — builds the DASHBOARD tab inside the MASTER spreadsheet.
 *
 * WHY A TAB AND NOT LOOKER STUDIO:
 *   - no new login for Robinder, no new platform (his CR-001 "Google friendly" requirement)
 *   - opens in the Google Sheets phone app
 *   - live: it reads MASTER directly, so there is no refresh schedule to configure
 *   - ZERO Make operations — this costs nothing against the 1,000/month free allowance
 *   The billable Looker build (P2-01) keeps what this deliberately cannot do:
 *   per-branch access control, trend charts over time, and s56 deadline tracking.
 *
 * SAFE TO RUN REPEATEDLY. It deletes and rebuilds the DASHBOARD tab only.
 * It never reads, writes or touches a single cell of MASTER.
 *
 * HOW TO RUN:  open MASTER → Extensions → Apps Script → paste → Run → buildDashboard
 * Output goes to the execution log (View → Logs). No dialogs — getUi().alert() hangs
 * when a script is run from the editor rather than the sheet (D-245).
 */

var DATA_TAB  = 'MASTER';      // the tab holding client rows — headers in row 1, data from row 2
var DASH_TAB  = 'DASHBOARD';
var LAST_COL  = 'Y';           // MASTER runs A..Y (25 columns)

// Colours
var NAVY   = '#1b3a5c';
var BAND   = '#eef2f6';
var RULE   = '#c9d4de';
var MUTED  = '#5b6b7a';
var ALERT  = '#fdece9';
var ALERTX = '#c0392b';

/** Rows are "open" when no outcome has been recorded yet. */
var OPEN = "(N is null or N = 'Pending')";

function buildDashboard() {
  var ss = SpreadsheetApp.getActive();

  if (!ss.getSheetByName(DATA_TAB)) {
    Logger.log('ABORTED — no tab named "' + DATA_TAB + '" in this spreadsheet.');
    Logger.log('Tabs found: ' + ss.getSheets().map(function (s) { return s.getName(); }).join(' · '));
    return;
  }

  var old = ss.getSheetByName(DASH_TAB);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(DASH_TAB, 0);   // position 0 = first tab, so it opens on this

  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 230);
  [2, 3, 4, 5, 6].forEach(function (c) { sh.setColumnWidth(c, 130); });

  title_(sh);
  kpis_(sh);

  var r = 9;
  r = block_(sh, r, '1 · BRANCH PERFORMANCE',
      'How is each office and team performing? Every open matter, grouped.',
      "select J, K, count(A) where A is not null and " + OPEN +
      " group by J, K order by count(A) desc limit 12" +
      " label J 'Office', K 'Team', count(A) 'Open matters'", 14);

  r = block_(sh, r, '2 · WHERE MATTERS ARE STUCK',
      'Open matters by processing stage. The biggest number is the bottleneck.',
      "select M, count(A) where A is not null and " + OPEN +
      " group by M order by count(A) desc limit 12" +
      " label M 'Processing stage', count(A) 'Open matters'", 14);

  r = block_(sh, r, '3 · WORKLOAD PER CONSULTANT',
      'Who is carrying the most open files right now.',
      "select L, count(A) where A is not null and " + OPEN +
      " group by L order by count(A) desc limit 15" +
      " label L 'Consultant', count(A) 'Open matters'", 17);

  var quietStart = r;
  r = block_(sh, r, '4 · GOING QUIET — oldest contact first',
      'Open files sorted by last contact. Anything shaded red has not been contacted in over 14 days.',
      "select A, C, L, R, M where A is not null and " + OPEN +
      " and R is not null order by R asc limit 15" +
      " label A 'Code', C 'Client', L 'Consultant', R 'Last contact', M 'Stage'", 18);
  quietHighlight_(sh, quietStart + 3);
  // QUERY output carries no number format, so a date arrives as its serial (46216).
  // Column 4 of this view is Last contact — format it, or the most human column on
  // the whole dashboard reads as a five-digit number.
  sh.getRange(quietStart + 3, 4, 15, 1).setNumberFormat('d mmm yyyy');

  r = block_(sh, r, '5 · OUTCOMES',
      'Every matter that has reached a decision.',
      "select N, count(A) where A is not null and N is not null and N <> 'Pending'" +
      " group by N order by count(A) desc limit 8" +
      " label N 'Outcome', count(A) 'Matters'", 11);

  // Visa Type is a MIXED-TYPE column: '485', '189', '500' look numeric while '820/801',
  // 'SBS', 'Nomination', 'Bridging' are text. QUERY forces one type per column and nulls
  // the minority — which is why 820/801 appeared as a blank row with a count beside it.
  // Fix: build a virtual range where the column is text, so nothing is silently dropped.
  var t = function (c) { return "ARRAYFORMULA(TO_TEXT('" + DATA_TAB + "'!" + c + "2:" + c + "))"; };
  r = block_(sh, r, '6 · VISA MIX',
      'What the practice actually works on, open matters only.',
      "select Col1, count(Col3) where Col3 <> '' and (Col2 = '' or Col2 = 'Pending')" +
      " group by Col1 order by count(Col3) desc limit 15" +
      " label Col1 'Visa type', count(Col3) 'Open matters'", 17,
      '{' + t('H') + ',' + t('N') + ',' + t('A') + '}');

  footer_(sh, r);

  sh.setFrozenRows(2);
  ss.setActiveSheet(sh);
  SpreadsheetApp.flush();

  Logger.log('DASHBOARD built. 6 views + 6 headline numbers.');
  Logger.log('It reads ' + DATA_TAB + '!A2:' + LAST_COL + ' live — the numbers grow by themselves as clients are added.');
  Logger.log('Nothing in ' + DATA_TAB + ' was read, written or changed.');
}

/* ---------------------------------------------------------------- pieces */

function title_(sh) {
  sh.getRange('A1:F1').merge()
    .setValue('YALE MIGRATION — OPERATIONS DASHBOARD')
    .setFontSize(16).setFontWeight('bold')
    .setFontColor('#ffffff').setBackground(NAVY)
    .setVerticalAlignment('middle');
  sh.setRowHeight(1, 40);

  sh.getRange('A2:F2').merge()
    .setFormula('="Live from the ' + DATA_TAB +
                ' sheet · nobody updates this by hand · opened "&TEXT(NOW(),"d mmm yyyy, h:mm am/pm")')
    .setFontSize(9).setFontColor(MUTED).setBackground(BAND);
  sh.setRowHeight(2, 22);
}

function kpis_(sh) {
  var labels = ['Clients on file', 'Open matters', 'Going quiet', 'Granted', 'Folder missing', 'Checklist missing'];
  var d = "'" + DATA_TAB + "'!";
  // A matter is OPEN when its outcome is blank OR "Pending". Both must be counted:
  // the dropdown offers "Pending" and real rows use it, while automation-created rows
  // leave it blank. Counting only blanks under-reported every operational tile.
  var open = function (extra) {
    return '=COUNTIFS(' + d + 'A2:A,"<>",' + extra + d + 'N2:N,"")' +
           '+COUNTIFS(' + d + 'A2:A,"<>",' + extra + d + 'N2:N,"Pending")';
  };
  var quiet = d + 'S2:S,"<"&TODAY(),' + d + 'S2:S,"<>",';

  var formulas = [
    '=COUNTA(' + d + 'A2:A)',
    open(''),                                  // open matters
    open(quiet),                               // open AND overdue for follow-up
    '=COUNTIF(' + d + 'N2:N,"Granted")',
    open(d + 'V2:V,"",'),                      // open with no folder yet
    open(d + 'Y2:Y,"",')                       // open with no checklist yet
  ];

  sh.getRange(4, 1, 1, 6).setValues([labels])
    .setFontSize(9).setFontWeight('bold').setFontColor(MUTED)
    .setHorizontalAlignment('center').setBackground(BAND);

  sh.getRange(5, 1, 1, 6).setFormulas([formulas])
    .setFontSize(24).setFontWeight('bold').setFontColor(NAVY)
    .setHorizontalAlignment('center');
  sh.setRowHeight(5, 44);

  // the two operational tiles read as warnings when they are not zero
  [3, 5, 6].forEach(function (c) {
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0)
      .setBackground(ALERT).setFontColor(ALERTX)
      .setRanges([sh.getRange(5, c)]).build();
    var rules = sh.getConditionalFormatRules();
    rules.push(rule);
    sh.setConditionalFormatRules(rules);
  });

  sh.getRange(6, 1, 1, 6).setBackground(RULE);
  sh.setRowHeight(6, 3);
}

/**
 * One titled section holding one QUERY. Returns the row the NEXT block starts on.
 * `reserve` is how many rows this block owns — every QUERY carries a LIMIT so its
 * output can never spill into the block below it.
 */
function block_(sh, row, heading, note, query, reserve, customRange) {
  sh.getRange(row, 1, 1, 6).merge()
    .setValue(heading)
    .setFontSize(11).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground(NAVY).setVerticalAlignment('middle');
  sh.setRowHeight(row, 26);

  sh.getRange(row + 1, 1, 1, 6).merge()
    .setValue(note).setFontSize(9).setFontColor(MUTED).setFontStyle('italic');

  var range = customRange || ("'" + DATA_TAB + "'!A2:" + LAST_COL);
  sh.getRange(row + 2, 1).setFormula(
    '=IFERROR(QUERY(' + range + ',"' + query.replace(/"/g, '""') + '",0),"Nothing to show yet")'
  );
  sh.getRange(row + 2, 1, 1, 6).setFontWeight('bold').setBackground(BAND);

  return row + reserve;
}

/** Shades the "Going quiet" list where last contact is more than 14 days ago. */
function quietHighlight_(sh, firstDataRow) {
  var target = sh.getRange(firstDataRow, 1, 15, 5);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($D' + firstDataRow + '<>"",$D' + firstDataRow + '<TODAY()-14)')
    .setBackground(ALERT).setFontColor(ALERTX)
    .setRanges([target]).build();
  var rules = sh.getConditionalFormatRules();
  rules.push(rule);
  sh.setConditionalFormatRules(rules);
}

function footer_(sh, row) {
  sh.getRange(row, 1, 1, 6).merge()
    .setValue('Counts cover open matters only — anything Granted, Refused or Withdrawn is excluded ' +
              'so closed files never inflate the numbers. "Going quiet" uses the Next Follow-up Due ' +
              'date set each morning by the follow-up script.')
    .setFontSize(8).setFontColor(MUTED).setWrap(true);
  sh.setRowHeight(row, 34);
}
