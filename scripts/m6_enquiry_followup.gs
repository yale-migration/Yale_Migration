/**
 * M6 — ENQUIRY FOLLOW-UP  (runs daily, zero Make operations)          (D-328)
 *
 * Implements SOP-CI-001 step 10D, in their words:
 *   "Follow up within 7 days and again after 30 days unless the client requests
 *    no further contact."
 *
 * ⛔ APPS SCRIPT, NOT MAKE — and that is a decision, not a convenience. The Free plan
 * caps ACTIVE scenarios at 2 and M3 + M4 are those two (D-322). Building M6 in Make
 * would force a paid plan conversation with a client whose first project has not gone
 * live yet. This costs nothing and does the same job.
 *
 * 🔴 DEPENDS ON m5_dormant_detector.gs for its date helpers. Same Apps Script project,
 * so they are simply in scope. Reused rather than copied on purpose: two copies of
 * parseBaseline_() would drift, and the collision gate cannot catch drift between two
 * functions with DIFFERENT names. The guard at the top of run() fails loudly instead
 * of mysteriously if that file is ever removed.
 *
 * ============================ WHAT IT WRITES ============================
 * `Follow-up Due` (J)  the NEXT scheduled touch point, or blank when the cadence is
 *                      finished or the enquiry is closed.
 * `Notes`         (K)  one M6: line, rewritten every run, never stacked.
 *
 * It deliberately does NOT write `Status` (I). Status is the consultant's judgement
 * and its vocabulary is theirs (SOP-CI-001 10B). Nothing here infers it.
 *
 * ========================= WHY THERE IS A BASELINE =========================
 * The 621 rows coming from `DATA SHEET.xlsx` (D-327) are dated from 26 June. Every
 * one of them is already past its 30-day window. Without a baseline the first run
 * writes "no outcome recorded" against ALL 621 on day one — a wall of red on the
 * client's own sheet that says nothing, on the morning we are trying to show them
 * something that works. This is the same failure M5a's IMPORT_BASELINE exists to
 * prevent (D-322); it is applied here before it can happen rather than after.
 *
 * An enquiry dated ON OR BEFORE the baseline is HISTORICAL: recorded honestly as
 * imported-with-no-outcome, counted in the log, and left out of the live cadence.
 * Anything dated after it runs the real 7/30 rule.
 *
 * 🔴 Set M6_BASELINE to the enquiry import date. '' disables the branch entirely,
 *    which is the safe state before the import.
 */

var M6_TAB      = 'ENQUIRIES';
var M6_FIRST    = 2;
var M6_DAY1     = 7;     // SOP-CI-001 10D — "within 7 days"
var M6_DAY2     = 30;    // SOP-CI-001 10D — "and again after 30 days"
var M6_BASELINE = '';    // 'yyyy-MM-dd' on enquiry-import day. '' = branch off.

var M6_COL = { DATE:1, NAME:2, PHONE:3, STATUS:9, DUE:10, NOTES:11 };

// From the ENQUIRIES Status dropdown. These three mean the conversation is over —
// 'Not Proceeding' is also how "the client requests no further contact" is recorded,
// which is the exception SOP-CI-001 10D names explicitly.
var M6_CLOSED = ['Not Proceeding', 'Lost Lead', 'Converted'];

// Every note this script writes starts with this. It is how the script finds and
// replaces its OWN line without touching a word a consultant typed.
var M6_TAG = 'M6:';


function updateEnquiryFollowUps() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try { m6Run_(); } finally { lock.releaseLock(); }
}


function m6Run_() {
  if (typeof startOfDay_ !== 'function' || typeof parseBaseline_ !== 'function') {
    Logger.log('ABORT — m5_dormant_detector.gs is not in this project.');
    Logger.log('M6 reuses its date helpers. Add that file and run again.');
    return;
  }

  var sh = SpreadsheetApp.getActive().getSheetByName(M6_TAB);
  if (!sh) { Logger.log('ABORT — no tab named ' + M6_TAB); return; }

  var last = sh.getLastRow();
  if (last < M6_FIRST) { Logger.log('No enquiries yet — nothing to do.'); return; }
  var n = last - M6_FIRST + 1;

  var baseline = parseBaseline_(M6_BASELINE);
  if (M6_BASELINE && !baseline) {
    Logger.log('ABORT: M6_BASELINE "' + M6_BASELINE + '" is not a yyyy-MM-dd date.');
    return;   // a mistyped baseline must stop the run, never fall through to the live rule
  }

  var dates   = sh.getRange(M6_FIRST, M6_COL.DATE,   n, 1).getValues();
  var names   = sh.getRange(M6_FIRST, M6_COL.NAME,   n, 1).getValues();
  var phones  = sh.getRange(M6_FIRST, M6_COL.PHONE,  n, 1).getValues();
  var status  = sh.getRange(M6_FIRST, M6_COL.STATUS, n, 1).getValues();
  var dueRng  = sh.getRange(M6_FIRST, M6_COL.DUE,    n, 1);
  var noteRng = sh.getRange(M6_FIRST, M6_COL.NOTES,  n, 1);
  var due     = dueRng.getValues();
  var notes   = noteRng.getValues();

  var today = startOfDay_(new Date());
  var live = 0, closed = 0, historical = 0, nodate = 0, blank = 0;
  var due7 = 0, due30 = 0, lapsed = 0;

  for (var i = 0; i < n; i++) {
    // An enquiry is a row with someone to contact. Name OR phone — the log has
    // 82 rows with a number and no name, and those are still real enquiries.
    if (!String(names[i][0]).trim() && !String(phones[i][0]).trim()) { blank++; continue; }

    notes[i][0] = m6Strip_(notes[i][0]);

    if (contains_(M6_CLOSED, status[i][0])) {
      due[i][0] = '';                       // closed: no next touch point, ever
      closed++;
      continue;
    }

    var d = startOfDay_(toDate_(dates[i][0]));
    if (!d) {
      due[i][0] = '';
      notes[i][0] = m6Note_(notes[i][0], 'no enquiry date — cannot schedule a follow-up');
      nodate++;
      continue;
    }

    if (baseline && d <= baseline) {
      // Historical. Say what is true — it came in with no outcome — and stop.
      // NOT "overdue": nobody failed to act on it inside a system that did not exist.
      due[i][0] = '';
      notes[i][0] = m6Note_(notes[i][0], 'historical enquiry, imported with no outcome recorded');
      historical++;
      continue;
    }

    live++;
    var first  = addDays_(d, M6_DAY1);
    var second = addDays_(d, M6_DAY2);

    if (today < first) {
      due[i][0] = fmt_(first);              // first window not open yet
      due7++;
    } else if (today < second) {
      due[i][0] = fmt_(second);             // 7-day window passed, 30-day is next
      due30++;
    } else {
      // Both windows are behind us. SOP-CI-001 stops at 30 days, so there is no
      // third date to offer — what is needed now is a decision, not another chase.
      due[i][0] = '';
      notes[i][0] = m6Note_(notes[i][0],
        'both follow-ups (day ' + M6_DAY1 + ' and day ' + M6_DAY2 +
        ') are past and no outcome is recorded — set a Status');
      lapsed++;
    }
  }

  dueRng.setValues(due);
  noteRng.setValues(notes);
  SpreadsheetApp.flush();

  Logger.log('=== M6 enquiry follow-up ===');
  Logger.log('  live enquiries ................ ' + live);
  Logger.log('     next touch = day ' + M6_DAY1 + ' ..... ' + due7);
  Logger.log('     next touch = day ' + M6_DAY2 + ' .... ' + due30);
  Logger.log('     🔴 lapsed, needs a Status .. ' + lapsed);
  Logger.log('  closed (' + M6_CLOSED.join('/') + ') ... ' + closed);
  Logger.log('  historical (pre-baseline) ..... ' + historical);
  Logger.log('  no usable date ................ ' + nodate);
  Logger.log('  blank rows skipped ............ ' + blank);
  Logger.log(baseline
    ? '  baseline ' + fmt_(baseline) + ' — enquiries on or before it are historical'
    : '  ⚠️  M6_BASELINE NOT SET. After the import this flags all 621 rows as lapsed ' +
      'on day one. Set it to the import date.');
}


/** Adds our one line, preserving whatever a human wrote. */
function m6Note_(existing, msg) {
  var line = M6_TAG + ' ' + msg;
  existing = String(existing || '').trim();
  return existing ? line + ' | ' + existing : line;
}

/**
 * Removes ONLY our own previous line. Miss this and the notes column grows a new
 * M6: line every day the script runs — the mistake stripDormant_() was written to
 * fix in M5a, so it is not repeated here.
 */
function m6Strip_(note) {
  var s = String(note || '');
  return s.replace(/M6:[^|]*(\|\s*)?/g, '').trim();
}
