/**
 * Yale Migration — MASTER DATABASE: client-code engine
 * Sheet: "MASTER"  | Columns: A Client Code, B Full Name, ... K Date Added
 *
 * Why two triggers:
 *  - onEdit fires when a HUMAN types (instant feedback)
 *  - assignMissingCodes() also runs on a 5-minute timer, because Apps Script
 *    onEdit does NOT fire for rows created via API/automation (Make).
 *
 * Setup (one time):
 *  1. Extensions -> Apps Script, paste this file, Save.
 *  2. Run assignMissingCodes() once and Allow permissions.
 *  3. Triggers (clock icon) -> Add trigger -> assignMissingCodes -> Time-driven
 *     -> Minutes timer -> Every 5 minutes -> Save.
 */

var SHEET_NAME   = 'MASTER';
var CODE_PREFIX  = 'YM-2026-';
var COL_CODE     = 1;  // A
var COL_NAME     = 2;  // B
var COL_DATE     = 11; // K
var FIRST_ROW    = 2;  // row 1 = headers

/** Fires when someone types in the sheet. */
function onEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== SHEET_NAME) return;
  if (e.range.getColumn() !== COL_NAME) return; // only react to Full Name
  assignMissingCodes();
}

/** Assigns a code + Date Added to every row that has a name but no code. */
function assignMissingCodes() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) return;

  var lastRow = sh.getLastRow();
  if (lastRow < FIRST_ROW) return;

  var n = lastRow - FIRST_ROW + 1;
  var codes = sh.getRange(FIRST_ROW, COL_CODE, n, 1).getValues();
  var names = sh.getRange(FIRST_ROW, COL_NAME, n, 1).getValues();
  var dates = sh.getRange(FIRST_ROW, COL_DATE, n, 1).getValues();

  var next = nextNumber_(codes);
  var changed = false;

  for (var i = 0; i < n; i++) {
    var hasName = String(names[i][0]).trim() !== '';
    var hasCode = String(codes[i][0]).trim() !== '';
    if (hasName && !hasCode) {
      codes[i][0] = CODE_PREFIX + pad_(next, 5);
      next++;
      changed = true;
      if (String(dates[i][0]).trim() === '') {
        dates[i][0] = new Date();
      }
    }
  }

  if (changed) {
    sh.getRange(FIRST_ROW, COL_CODE, n, 1).setValues(codes);
    sh.getRange(FIRST_ROW, COL_DATE, n, 1).setValues(dates);
  }
}

/** Highest existing number + 1 (never reuses a code, even after deletions). */
function nextNumber_(codes) {
  var max = 0;
  for (var i = 0; i < codes.length; i++) {
    var v = String(codes[i][0]).trim();
    if (v.indexOf(CODE_PREFIX) === 0) {
      var num = parseInt(v.substring(CODE_PREFIX.length), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  }
  return max + 1;
}

function pad_(num, size) {
  var s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}
