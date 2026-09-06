/**
 * FILL THE `Client Code` COLUMN IN S56 TRACKER FROM MASTER.  (D-460)
 *
 * 🔴 WHY THIS EXISTS. A client file finds its Section 56 deadlines by matching
 * `client_code`. The tracker tab recorded only `Client Name`, so every synced
 * deadline arrived with no code and matched nothing — the practice board looked
 * completely correct, because it lists by NAME, while every individual client
 * file showed no deadline at all. Staff included, not just clients (D-459).
 *
 * Column T now holds the code. This fills it.
 *
 * ⛔ IT REFUSES TO GUESS. A code is written only when EXACTLY ONE client in
 * MASTER has that name, compared case- and whitespace-insensitively. Zero
 * matches or two both leave the cell blank.
 *
 * That is not caution for its own sake: attaching a statutory deadline to the
 * wrong person's file in an immigration practice is a worse outcome than
 * showing no deadline. A blank cell still appears on the board, where a human
 * sees it. A wrong link is invisible and confidently incorrect.
 *
 * ⚠️ It never overwrites a value that is already there. Someone who types a
 * code by hand to resolve an ambiguous name has made a decision this script is
 * not entitled to undo.
 *
 * Safe to run repeatedly. Called at the end of verifyS56Deadlines() so it
 * self-heals daily as new clients are added to MASTER.
 */

var S56L_TRACKER   = 'S56 TRACKER';
var S56L_MASTER    = 'MASTER';
var S56L_COL_NAME  = 2;   // B  Client Name, as the Department wrote it
var S56L_COL_CODE  = 20;  // T  Client Code
var S56L_M_CODE    = 1;   // MASTER A  Client Code
var S56L_M_NAME    = 3;   // MASTER C  Full Name

/** Normalise a name for comparison. Must match the SQL bridge: lower(btrim()). */
function s56lNorm_(v) {
  return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' ');
}

function linkS56ClientCodes() {
  var ss = SpreadsheetApp.getActive();
  var tr = ss.getSheetByName(S56L_TRACKER);
  var ma = ss.getSheetByName(S56L_MASTER);
  if (!tr || !ma) {
    Logger.log('linkS56ClientCodes: missing ' + (tr ? S56L_MASTER : S56L_TRACKER) + ' — nothing done');
    return { linked: 0, ambiguous: 0, unknown: 0, skipped: 0 };
  }

  /* Build name -> [codes]. 🔑 A LIST, not a single value: the whole point is to
     be able to tell "one match" from "several", and a map that overwrites would
     silently keep the last one and look unambiguous. */
  var byName = {};
  var mLast = ma.getLastRow();
  if (mLast > 1) {
    var mRows = ma.getRange(2, 1, mLast - 1, Math.max(S56L_M_NAME, S56L_M_CODE)).getValues();
    for (var i = 0; i < mRows.length; i++) {
      var nm = s56lNorm_(mRows[i][S56L_M_NAME - 1]);
      var cd = String(mRows[i][S56L_M_CODE - 1] || '').trim();
      if (!nm || !cd) continue;
      (byName[nm] = byName[nm] || []).push(cd);
    }
  }

  var last = tr.getLastRow();
  if (last < 2) return { linked: 0, ambiguous: 0, unknown: 0, skipped: 0 };

  var width = Math.max(S56L_COL_NAME, S56L_COL_CODE);
  var rows  = tr.getRange(2, 1, last - 1, width).getValues();
  var out   = [];
  var stat  = { linked: 0, ambiguous: 0, unknown: 0, skipped: 0 };

  for (var r = 0; r < rows.length; r++) {
    var existing = String(rows[r][S56L_COL_CODE - 1] || '').trim();
    if (existing) { out.push([existing]); stat.skipped++; continue; }

    var key = s56lNorm_(rows[r][S56L_COL_NAME - 1]);
    if (!key) { out.push(['']); stat.unknown++; continue; }

    var hits = byName[key] || [];
    // Two rows for the same person are one client, not an ambiguity.
    var distinct = hits.filter(function (c, i) { return hits.indexOf(c) === i; });

    if (distinct.length === 1) { out.push([distinct[0]]); stat.linked++; }
    else if (distinct.length > 1) { out.push(['']); stat.ambiguous++; }
    else { out.push(['']); stat.unknown++; }
  }

  // ⚠️ One write, not one per row. A per-row setValue on a daily trigger is how
  // an Apps Script job starts timing out six months later.
  tr.getRange(2, S56L_COL_CODE, out.length, 1).setValues(out);

  Logger.log('linkS56ClientCodes: linked=' + stat.linked +
             ' ambiguous=' + stat.ambiguous +
             ' unknown=' + stat.unknown +
             ' already-set=' + stat.skipped);
  return stat;
}
