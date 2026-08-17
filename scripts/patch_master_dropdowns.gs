/**
 * patch_master_dropdowns.gs — adds values to two MASTER dropdowns IN PLACE.  (D-323)
 *
 * ⛔ DO NOT RE-RUN setup_master_sheet.gs TO DO THIS. That script rebuilds headers,
 * widths, date formats and every dropdown on the tab. MASTER now carries live
 * structure it did not have when that script was written — columns Z..AE, the AC
 * dropdown, and M4's numeric index contract on G/H/V/X/Y. Rebuilding is a far bigger
 * blast radius than the two values we actually need.
 *
 * ---- WHAT AND WHY -----------------------------------------------------------
 *
 * H `Visa Type` += '186'
 *   ⛔ RETRACTED 18 Aug (D-325). **186 WAS ALREADY IN THE DROPDOWN.** This header used
 *   to call it "a live blocker — the cell rejects it". That was wrong, and the run log
 *   said so: `OK H — already has 186. Nothing to do.`
 *
 *   How the mistake was made, because it is worth not repeating: the claim came from
 *   reading setup_master_sheet.gs with `sed -n '55,75p'`. The Visa Type array spans
 *   lines 54–56 and '186' is on line 54. **The read started one line below the
 *   evidence**, showed the tail of the array, and the absence of 186 in what came back
 *   was treated as absence from the list. Nothing was ever checked against the live
 *   sheet. This function's own guard is what proved it, by refusing to patch.
 *
 *   The real coverage gap is bigger and duller: MASTER offers 23 visa types and
 *   CHECKLIST MAP resolves 13, so 10 route to NEEDS REVIEW — 300, 186, 191, 600,
 *   Skills Assessment, EOI, ART, Bridging, Other, and (until D-325) 190. That is
 *   correct behaviour, not a bug: we hold no checklist for any of them.
 *
 *   Left in place deliberately. It is a no-op now and its guard is the reason the
 *   error surfaced at all.
 *
 * U `Source` += 'SMS'
 *   ROADMAP C-5 says this dropdown needs 'Referral' and 'SMS'. **'Referral' is
 *   already there** — checked in setup_master_sheet.gs before writing this, so only
 *   SMS is actually missing. C-5's remaining work is the capture path, not the column.
 *
 * ---- THE TRAP THIS SCRIPT EXISTS TO AVOID -----------------------------------
 * requireValueInList(..).setAllowInvalid(false) blocks APPS SCRIPT WRITES too, not
 * just typing. That is how column Y silently rejected every write for days. We read
 * the CURRENT list off the sheet and append to it, so nothing already there is lost,
 * and we preserve the existing allowInvalid setting rather than guessing at it.
 *
 * Run patchMasterDropdowns(), then verifyMasterDropdowns().
 */

var PD_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var PD_TAB      = 'MASTER';

var PD_PATCHES = [
  { col: 8,  letter: 'H', header: 'Visa Type', add: ['186'] },
  { col: 21, letter: 'U', header: 'Source',    add: ['SMS'] }
];


function patchMasterDropdowns() {
  // 🔴 getDocumentLock(), NOT getScriptLock() (D-324). They are DIFFERENT mutexes.
  // master_codes.gs holds a DOCUMENT lock and runs on a 5-minute timer against this
  // same tab. A script lock does not exclude it — taking the wrong one is the same as
  // taking none, while looking in review exactly like it is handled.
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — another script holds the lock.'); return; }

  try {
    var sh = SpreadsheetApp.openById(PD_SHEET_ID).getSheetByName(PD_TAB);
    if (!sh) { Logger.log('ABORT — no tab named ' + PD_TAB); return; }

    var lastRow = Math.max(sh.getMaxRows(), 2);

    PD_PATCHES.forEach(function (p) {
      // Guard: the column must still be the one we think it is. If someone has
      // inserted a column, patching by number would edit the wrong dropdown.
      var header = String(sh.getRange(1, p.col).getValue()).trim();
      if (header !== p.header) {
        Logger.log('SKIP ' + p.letter + ' — header is "' + header + '", expected "' + p.header +
                   '". A column has moved. Do NOT patch blind; stop and look.');
        return;
      }

      var probe = sh.getRange(2, p.col).getDataValidation();
      if (!probe) {
        Logger.log('SKIP ' + p.letter + ' — no data validation on this column at all.');
        return;
      }
      if (probe.getCriteriaType() !== SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
        Logger.log('SKIP ' + p.letter + ' — validation is ' + probe.getCriteriaType() +
                   ', not a plain list. Patching it would change its kind.');
        return;
      }

      var current = probe.getCriteriaValues()[0].slice();
      var missing = p.add.filter(function (v) { return current.indexOf(v) === -1; });
      if (!missing.length) {
        Logger.log('OK ' + p.letter + ' — already has ' + p.add.join(', ') + '. Nothing to do.');
        return;
      }

      var updated = current.concat(missing);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(updated, true)
        .setAllowInvalid(probe.getAllowInvalid())   // preserve, never assume
        .build();

      try {
        sh.getRange(2, p.col, lastRow - 1, 1).setDataValidation(rule);
        SpreadsheetApp.flush();
        Logger.log('PATCHED ' + p.letter + ' ' + p.header + ' += ' + missing.join(', ') +
                   '   (' + current.length + ' -> ' + updated.length + ' values)');
      } catch (e) {
        Logger.log('FAILED ' + p.letter + ' — ' + e.message);
      }
    });

    Logger.log('');
    Logger.log('Now run verifyMasterDropdowns().');

  } finally {
    lock.releaseLock();
  }
}


/** Proves the values are there AND that a real write of each one is accepted. */
function verifyMasterDropdowns() {
  var sh = SpreadsheetApp.openById(PD_SHEET_ID).getSheetByName(PD_TAB);
  var pass = 0, fail = 0;
  function check(label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
    ok ? pass++ : fail++;
  }

  Logger.log('=== MASTER dropdowns ===');
  var row = sh.getLastRow() + 1;

  PD_PATCHES.forEach(function (p) {
    var rule = sh.getRange(2, p.col).getDataValidation();
    check(p.letter + ' still has a list', !!rule);
    if (!rule) return;

    var vals = rule.getCriteriaValues()[0];
    p.add.forEach(function (v) {
      check(p.letter + ' contains "' + v + '"', vals.indexOf(v) > -1, vals.join(' / '));

      // The list containing a value and the CELL accepting it are two different
      // claims. setAllowInvalid(false) is what makes the difference, so test the
      // write itself rather than trusting the list.
      var cell = sh.getRange(row, p.col);
      try {
        cell.setValue(v);
        SpreadsheetApp.flush();
        check(p.letter + ' actually accepts "' + v + '" being written', true);
      } catch (e) {
        check(p.letter + ' actually accepts "' + v + '" being written', false, e.message);
      }
      try { cell.clearContent(); SpreadsheetApp.flush(); } catch (ignore) {}
    });
  });

  // 186 must NOT have been added to anything M4 treats as supported. Route B is
  // where it belongs — flagged for review, never silently mis-filed.
  Logger.log('');
  Logger.log('REMINDER: 186 has no checklist. M4 will stamp it NEEDS REVIEW, which is correct.');
  Logger.log(pass + '/' + (pass + fail) + ' checks passed');
  Logger.log(fail === 0 ? 'DROPDOWNS OK.' : 'Fix the failures above.');
}
