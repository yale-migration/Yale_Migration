/**
 * read_client_sheets.gs — dumps the STRUCTURE of the two sheets the client's team shared,
 * so the import can be designed against what is actually in them.
 *
 * WHY THIS EXISTS: both sheets are private. They cannot be fetched from outside, and the
 * Make API does not return module data on this plan (D-289). Apps Script runs as
 * project1@yalemigration.com.au, so if the sheets are shared with that account — or with
 * "anyone with the link" — this reads them directly. Nothing else can.
 *
 * READ-ONLY. It opens, reads, and logs. It never writes to either sheet.
 *
 * ⚠️ PRIVACY: these may hold real client details. This script deliberately logs
 *    HEADERS IN FULL but only SAMPLE_ROWS of data, with long values truncated —
 *    enough to design the mapping, not a full export of their client list.
 *    🔴 Never paste the output into the repo. Chat/analysis only.
 *
 * RUN:  MASTER → Extensions → Apps Script → paste → Run → readClientSheets
 *       then copy the whole execution log and send it over.
 */

var SHEETS_TO_READ = [
  { label: 'SHEET A', id: '1_YDeb7iwHQr0c3MGKp0jp8MMyqBzqlr7sz36u8Qn4pc' },
  { label: 'SHEET B', id: '1J58XGyYmwdhzIRLiJxGfw-xUvYors4Ah6ks3JWkgD9c' }
];

var SAMPLE_ROWS = 4;     // data rows to show per tab
var SCAN_ROWS   = 14;    // rows scanned to find the header row
var MAX_COLS    = 26;    // A..Z
var MAX_CHARS   = 40;    // truncate long cell values

function readClientSheets() {
  Logger.log('Running as: ' + Session.getEffectiveUser().getEmail());
  Logger.log('');

  SHEETS_TO_READ.forEach(function (target) {
    Logger.log('══════════════════════════════════════════════════════');
    Logger.log(target.label + '  ·  ' + target.id);
    Logger.log('══════════════════════════════════════════════════════');

    var ss;
    try {
      ss = SpreadsheetApp.openById(target.id);
    } catch (e) {
      Logger.log('🔴 CANNOT OPEN — ' + e.message);
      Logger.log('   Fix: ask the team to share this sheet with');
      Logger.log('        project1@yalemigration.com.au  (Viewer is enough),');
      Logger.log('        or set it to "Anyone with the link — Viewer".');
      Logger.log('');
      return;
    }

    Logger.log('NAME: ' + ss.getName());
    var tabs = ss.getSheets();
    Logger.log('TABS (' + tabs.length + '): ' + tabs.map(function (t) { return t.getName(); }).join(' · '));
    Logger.log('');

    tabs.forEach(function (sh) { dumpTab_(sh); });
  });

  Logger.log('══════════════════════════════════════════════════════');
  Logger.log('Done. Copy this whole log and send it over.');
}

function dumpTab_(sh) {
  var lastRow = sh.getLastRow();
  var lastCol = Math.min(sh.getLastColumn(), MAX_COLS);

  Logger.log('──────────────────────────────────────────');
  Logger.log('TAB: "' + sh.getName() + '"   ' + lastRow + ' rows × ' + sh.getLastColumn() + ' cols');

  if (lastRow === 0 || lastCol === 0) { Logger.log('  (empty)'); Logger.log(''); return; }

  var scan = Math.min(SCAN_ROWS, lastRow);
  var grid = sh.getRange(1, 1, scan, lastCol).getDisplayValues();

  // The header row is the first row with the most non-empty cells — their sheets put a
  // title band on rows 1-3 (D-50), so row 1 is very often NOT the headers.
  var headerRow = 0, best = 0;
  for (var r = 0; r < scan; r++) {
    var filled = grid[r].filter(function (v) { return String(v).trim() !== ''; }).length;
    if (filled > best) { best = filled; headerRow = r; }
  }

  if (headerRow > 0) {
    Logger.log('  ⚠️ rows 1–' + headerRow + ' look like a title band, headers are on row ' + (headerRow + 1));
    for (var t = 0; t < headerRow; t++) {
      var band = grid[t].filter(function (v) { return String(v).trim() !== ''; }).join(' | ');
      if (band) Logger.log('     row ' + (t + 1) + ': ' + cut_(band, 120));
    }
  }

  Logger.log('  HEADERS (row ' + (headerRow + 1) + '):');
  grid[headerRow].forEach(function (h, i) {
    if (String(h).trim() !== '') {
      Logger.log('     ' + colLetter_(i + 1) + '  ' + h);
    }
  });

  var firstData = headerRow + 2;                       // 1-indexed
  var available = lastRow - firstData + 1;
  if (available <= 0) { Logger.log('  (no data rows)'); Logger.log(''); return; }

  Logger.log('  DATA ROWS: ' + available + '   (showing first ' + Math.min(SAMPLE_ROWS, available) + ')');
  var sample = sh.getRange(firstData, 1, Math.min(SAMPLE_ROWS, available), lastCol).getDisplayValues();
  sample.forEach(function (row, i) {
    var cells = [];
    row.forEach(function (v, c) {
      if (String(v).trim() !== '') cells.push(colLetter_(c + 1) + '=' + cut_(v, MAX_CHARS));
    });
    Logger.log('     r' + (firstData + i) + ': ' + cells.join('  ·  '));
  });

  // how full is each column — tells us which ones are actually used
  var all = sh.getRange(firstData, 1, available, lastCol).getDisplayValues();
  var fill = [];
  for (var c = 0; c < lastCol; c++) {
    var n = 0;
    for (var r2 = 0; r2 < all.length; r2++) if (String(all[r2][c]).trim() !== '') n++;
    if (String(grid[headerRow][c]).trim() !== '') {
      fill.push(colLetter_(c + 1) + ':' + Math.round(n / available * 100) + '%');
    }
  }
  Logger.log('  COLUMN FILL: ' + fill.join(' '));
  Logger.log('');
}

function cut_(v, n) {
  v = String(v).replace(/\s+/g, ' ').trim();
  return v.length > n ? v.substring(0, n) + '…' : v;
}

function colLetter_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}
