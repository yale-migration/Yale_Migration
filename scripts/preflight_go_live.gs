/**
 * preflight_go_live.gs — the gate that must print GO before ANY Make scenario is
 * switched on.  (D-323)
 *
 * ========================= WHY THIS EXISTS =========================
 * MASTER currently holds **14 demo rows** put there by seed_demo_rows.gs so the
 * dashboard could be proven against data. They are invented people with
 * @example.com addresses. Everything downstream is now built and armed:
 *
 *   M3       would create 14 FAKE CLIENT FOLDERS in Yale's real OneDrive
 *   M4a      would file real checklists into them
 *   M4b      would draft a checklist email to each @example.com address
 *   M4 v4 C  would later draft a chase email to the same addresses
 *
 * None of that errors. It all "succeeds". The client opens their OneDrive and finds
 * a dozen clients who do not exist, in a folder tree they showed us as their live
 * system of record.
 *
 * The instruction to run removeDemoRows() first is written down in FIVE places —
 * STATUS.md, DASHBOARD-TRACKER.md, CALL-QUESTIONS-robinder.md and twice in
 * DECISIONS.md. It was in NEITHER of the two documents anyone actually reads at
 * go-live: CUTOVER-PLAN.md (which seed_demo_rows.gs points at by name) and
 * WHERE-WE-STAND.md (which CLAUDE.md calls the one file to read after a reset).
 *
 * Written down five times and still missable is not a documentation problem.
 * So it is a check now, not a sentence.
 *
 * 🔴 THE MARKER IS THE EMAIL, NOT THE CODE (D-296). master_codes.gs runs on a
 * 5-minute timer and overwrites anything in column A that is not a valid
 * YM-2026-##### code — so the DEMO-001 prefix was gone within five minutes of
 * seeding, and removeDemoRows() silently stopped finding anything. @example.com is
 * reserved by RFC 2606 and can never belong to a real client.
 *
 * Read-only. Changes nothing. Run it as often as you like.
 */

var PF_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var PF_TAB      = 'MASTER';

// The five indices M4 addresses NUMERICALLY. If any of these move, M4 reads the
// wrong field and files the wrong checklist while reporting success.
var PF_CRITICAL = { 7: 'Location', 8: 'Visa Type', 22: 'Folder URL',
                    24: 'Skills Authority', 25: 'Checklist Filed' };

// Route A of M4 v4. Anything outside this list is stamped NEEDS REVIEW — correct,
// but worth counting out loud so nobody is surprised by the number on day one.
var PF_SUPPORTED = ['485','500','482','SBS','Nomination','407','820/801','189',
                    '190','491','494','802','101','417'];

var PF_COL = { CODE:1, NAME:3, EMAIL:6, VISA:8, FOLDER:22, FILED:25, FLAG:31 };


function preflightGoLive() {
  var sh = SpreadsheetApp.openById(PF_SHEET_ID).getSheetByName(PF_TAB);
  if (!sh) { Logger.log('ABORT — no tab named ' + PF_TAB); return; }

  var stop = 0, warn = 0;
  function blocker(label, ok, detail) {
    Logger.log((ok ? '  OK    ' : '  STOP  ') + label + (detail ? '  — ' + detail : ''));
    if (!ok) stop++;
  }
  function advisory(label, ok, detail) {
    Logger.log((ok ? '  OK    ' : '  WARN  ') + label + (detail ? '  — ' + detail : ''));
    if (!ok) warn++;
  }

  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  var n = Math.max(lastRow - 1, 0);
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0]
                  .map(function (h) { return String(h || '').trim(); });

  Logger.log('=== 1 · SHAPE — does the sheet still match what the automation assumes? ===');
  for (var pos in PF_CRITICAL) {
    var i = Number(pos);
    blocker('col ' + i + ' is "' + PF_CRITICAL[pos] + '" (M4 reads index ' + (i - 1) + ')',
            headers[i - 1] === PF_CRITICAL[pos], 'found "' + headers[i - 1] + '"');
  }
  blocker('col 31 (AE) is "Chase Flag" — M4 route C selects on it',
          headers[30] === 'Chase Flag', 'found "' + headers[30] + '"');
  blocker('col 27 (AA) is "Docs Outstanding" — the chase email reads it',
          headers[26] === 'Docs Outstanding', 'found "' + headers[26] + '"');

  if (n === 0) {
    Logger.log('');
    Logger.log('MASTER has no data rows. Nothing else to check.');
    Logger.log(stop === 0 ? 'SHAPE OK — but there is nothing to go live WITH.' : 'FIX THE SHAPE FIRST.');
    return;
  }

  var rows = sh.getRange(2, 1, n, Math.max(lastCol, 31)).getValues();
  var v = function (r, c) { return String(r[c - 1] == null ? '' : r[c - 1]).trim(); };
  var real = rows.filter(function (r) { return v(r, PF_COL.NAME); });

  Logger.log('');
  Logger.log('=== 2 · 🔴 DEMO ROWS — the one that quietly ruins the client\'s OneDrive ===');
  var demo = real.filter(function (r) {
    return v(r, PF_COL.EMAIL).toLowerCase().indexOf('@example.com') > -1;
  });
  blocker('no demo rows left in MASTER', demo.length === 0,
          demo.length + ' found: ' + demo.slice(0, 5).map(function (r) {
            return v(r, PF_COL.NAME);
          }).join(', ') + (demo.length > 5 ? ' …' : '') +
          '  →  RUN removeDemoRows() BEFORE SWITCHING ANYTHING ON');

  Logger.log('');
  Logger.log('=== 3 · WHAT THE SCENARIOS WOULD DO ON THE FIRST RUN ===');
  var noFolder   = real.filter(function (r) { return !v(r, PF_COL.FOLDER); });
  var needRoute  = real.filter(function (r) { return v(r, PF_COL.FOLDER) === 'NEEDS ROUTING'; });
  var needFile   = real.filter(function (r) {
    return v(r, PF_COL.FOLDER) && v(r, PF_COL.FOLDER) !== 'NEEDS ROUTING' && !v(r, PF_COL.FILED);
  });
  var unsupported = needFile.filter(function (r) {
    return PF_SUPPORTED.indexOf(v(r, PF_COL.VISA)) === -1;
  });
  var flagged    = real.filter(function (r) { return v(r, PF_COL.FLAG) === 'CHASE'; });
  var flagStuck  = flagged.filter(function (r) { return !v(r, PF_COL.EMAIL); });

  Logger.log('  rows with a name .............. ' + real.length);
  Logger.log('  M3 would create folders for ... ' + noFolder.length);
  Logger.log('  M4 would file checklists for .. ' + needFile.length +
             '  (of which ' + unsupported.length + ' -> NEEDS REVIEW, no checklist exists)');
  Logger.log('  route C would draft chases for  ' + (flagged.length - flagStuck.length));

  advisory('nothing is stuck on NEEDS ROUTING', needRoute.length === 0,
           needRoute.length + ' row(s) need Location/Team fixed before M3 can place them');
  advisory('no row is flagged CHASE with no email address', flagStuck.length === 0,
           flagStuck.length + ' row(s) will sit flagged forever — chase these by phone');

  // Ops. The free plan resets on the 25th and this is the number that decides
  // whether the first day fits inside what is left.
  var est = 1 + noFolder.length * 5 + needFile.length * 4 + (flagged.length - flagStuck.length) * 2;
  Logger.log('  rough first-run operations .... ~' + est +
             '   (M3 ~5/row, M4 ~4/row, chase 2/row, +1 per search)');
  advisory('first run fits comfortably in the free 1,000/month', est < 400, '~' + est + ' estimated');

  Logger.log('');
  Logger.log('=== 4 · DATA THE AUTOMATION NEEDS AND MAY NOT HAVE ===');
  var noEmail = real.filter(function (r) { return !v(r, PF_COL.EMAIL); });
  var noVisa  = real.filter(function (r) { return !v(r, PF_COL.VISA); });
  advisory('every row has an email address', noEmail.length === 0,
           noEmail.length + ' without one — no checklist email and no chase email for these');
  advisory('every row has a visa type', noVisa.length === 0,
           noVisa.length + ' without one — M4 cannot choose a checklist');

  Logger.log('');
  Logger.log('');
  Logger.log('=== 4b · 🔴 THE TWO BASELINES AND THE TRIGGERS ===');
  //
  // Added 20 Aug. The written go-live gate in WHERE-WE-STAND has six items; this
  // script checked ONE of them. That is the exact failure this file was created to
  // end (D-323): an instruction that lives in a document nobody opens at go-live.
  // Turning the remaining CHECKABLE ones into checks is the whole point of the file.
  //
  // Items 2 (Make scheduling), 3 (OneDrive account) and 4 (a date from Robinder) stay
  // human — Apps Script cannot see Make or read Robinder's mind. Items 5 and 6 can be
  // checked from right here, so they are.

  if (typeof IMPORT_BASELINE === 'undefined') {
    advisory('IMPORT_BASELINE is readable', false,
             'm5_dormant_detector.gs is not in this project — cannot check it');
  } else {
    blocker('IMPORT_BASELINE is set (M5a)', String(IMPORT_BASELINE).trim() !== '',
            'EMPTY → every imported row is treated as a NEW intake and flags dormant on '
          + 'day 3, and M4 route C drafts a chase email for each one. Set it to the '
          + 'import date, yyyy-MM-dd.');
  }
  if (typeof M8_BASELINE === 'undefined') {
    advisory('M8_BASELINE is readable', false,
             'm8_lead_followup.gs is not in this project — cannot check it');
  } else {
    blocker('M8_BASELINE is set (M8)', String(M8_BASELINE).trim() !== '',
            'EMPTY → all 621 imported enquiries read as lapsed on day one. Set it to the '
          + 'enquiry-import date, yyyy-MM-dd.');
  }

  // ⚠️ The scripts are useless unattended if nothing fires them. "It is built" and
  // "it runs" are different facts — M8 sat COMPLETE in the repo for a day while its
  // .gs had never been pasted into the project at all.
  try {
    var have = {};
    ScriptApp.getProjectTriggers().forEach(function (t) { have[t.getHandlerFunction()] = true; });
    ['updateFollowUps', 'updateEnquiryFollowUps'].forEach(function (fn) {
      blocker('a trigger exists for ' + fn + '()', !!have[fn],
              'NOT SCHEDULED — it will only ever run when somebody remembers to press Run');
    });
  } catch (e) {
    advisory('triggers could be read', false, e.message);
  }

  Logger.log('=== 5 · TABS — anything here we did not put here? ===');
  // `Sheet4` sat in this workbook for weeks and nobody had opened it. It IS empty
  // (checked 18 Aug) — but "probably empty" was a conclusion nobody had earned, and
  // G8 exists because that assumption has been wrong three times on this project.
  // So it is a check now: any unexpected tab is named, and its size is reported.
  var EXPECTED = ['DASHBOARD', 'MASTER', 'CHECKLIST MAP', 'FOLDER INVENTORY', 'ENQUIRIES'];
  SpreadsheetApp.openById(PF_SHEET_ID).getSheets().forEach(function (t) {
    var nm = t.getName();
    if (EXPECTED.indexOf(nm) > -1) return;
    var r = t.getLastRow(), c = t.getLastColumn();
    if (r === 0 || c === 0) {
      Logger.log('  OK    "' + nm + '" is an unexpected tab but it is EMPTY — safe to delete');
    } else {
      Logger.log('  WARN  "' + nm + '" is unexpected AND HOLDS DATA (' + r + ' rows x ' +
                 c + ' cols). Open it before go-live.');
      warn++;
    }
  });

  Logger.log('');
  Logger.log('================================================================');
  if (stop > 0) {
    Logger.log('🔴 NO-GO — ' + stop + ' blocker(s). Do NOT activate any scenario.');
  } else if (warn > 0) {
    Logger.log('🟠 GO WITH EYES OPEN — no blockers, ' + warn + ' thing(s) to know about above.');
  } else {
    Logger.log('🟢 GO — sheet side is clear.');
  }
  Logger.log('');
  Logger.log('This checks the SHEET only. Still to confirm in Make before switching on:');
  Logger.log('  · M3 and M4 scheduling is Weekdays 09:00/13:00/17:00, NOT the 15-minute default');
  Logger.log('  · the OneDrive connection is on a Yale account, not sharry00010@gmail.com');
  Logger.log('  · Robinder has given a date');
}
