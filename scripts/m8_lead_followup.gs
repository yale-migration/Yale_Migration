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
 * `Notes`         (K)  one M8: line, rewritten every run, never stacked.
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
 * 🔴 Set M8_BASELINE to the enquiry import date. '' disables the branch entirely,
 *    which is the safe state before the import.
 */

var M8_TAB      = 'ENQUIRIES';
var M8_FIRST    = 2;
var M8_DAY1     = 7;     // SOP-CI-001 10D — "within 7 days"
var M8_DAY2     = 30;    // SOP-CI-001 10D — "and again after 30 days"
var M8_BASELINE = '';    // 'yyyy-MM-dd' on enquiry-import day. '' = branch off.

var M8_COL = { DATE:1, NAME:2, PHONE:3, STATUS:9, DUE:10, NOTES:11, LAST_CONTACT:12 };

/**
 * ---- STOP-ON-REPLY (D-339) ----------------------------------------------
 * ROADMAP M8 is "7-day + 30-day cadence, **stop-on-reply**". The cadence shipped
 * first; this is the other half.
 *
 * ⛔ We cannot detect a reply on our own. Reading the inbox is M9 and the
 * WhatsApp/social channels are M6 — neither is built and both are blocked on
 * access we do not hold. So the honest mechanism is: **the moment a human logs a
 * reply in column L, the machine stops chasing.**
 *
 * A lead who has come back to us is a live conversation, not a cold one, and a
 * nurture sequence has no business chasing it. When M6/M9 land they write the
 * same column and this becomes automatic with no change here.
 *
 * Degrades safely: if column L does not exist, behaviour is exactly what it was.
 */

// From the ENQUIRIES Status dropdown. These three mean the conversation is over —
// 'Not Proceeding' is also how "the client requests no further contact" is recorded,
// which is the exception SOP-CI-001 10D names explicitly.
var M8_CLOSED = ['Not Proceeding', 'Lost Lead', 'Converted'];

// Every note this script writes starts with this. It is how the script finds and
// replaces its OWN line without touching a word a consultant typed.
var M8_TAG = 'M8:';

/**
 * ---- FLOOD GUARD (19 Aug 2026) ------------------------------------------
 * The header above explains why M8_BASELINE exists: import 621 enquiries dated from
 * 26 June with no baseline and the first run stamps "no outcome recorded" on every
 * one of them, on the client's live sheet.
 *
 * 🔴 That protection was a COMMENT and a variable someone has to remember to set. On
 * 19 Aug a daily 8am trigger was installed, so the first run after any future import
 * is unattended — nobody is watching to stop it. The demo-rows incident had exactly
 * this shape: the instruction existed in five documents and was in none of the ones
 * read at go-live.
 *
 * So the script now refuses instead of trusting. If the baseline is unset and this run
 * would mark more than M8_FLOOD_LIMIT rows lapsed at once, it writes NOTHING and says
 * why. A real day's work never lapses 25 enquiries simultaneously; only an import does.
 *
 * Setting M8_BASELINE to the import date turns the guard off by making it unnecessary —
 * those rows become 'historical' and never reach the lapsed count.
 */
var M8_FLOOD_LIMIT = 25;


function updateEnquiryFollowUps() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try { m8Run_(); } finally { lock.releaseLock(); }
}


function m8Run_() {
  if (typeof startOfDay_ !== 'function' || typeof parseBaseline_ !== 'function') {
    Logger.log('ABORT — m5_dormant_detector.gs is not in this project.');
    Logger.log('M6 reuses its date helpers. Add that file and run again.');
    return;
  }

  var sh = SpreadsheetApp.getActive().getSheetByName(M8_TAB);
  if (!sh) { Logger.log('ABORT — no tab named ' + M8_TAB); return; }

  var last = sh.getLastRow();
  if (last < M8_FIRST) { Logger.log('No enquiries yet — nothing to do.'); return; }
  var n = last - M8_FIRST + 1;

  var baseline = parseBaseline_(M8_BASELINE);
  if (M8_BASELINE && !baseline) {
    Logger.log('ABORT: M8_BASELINE "' + M8_BASELINE + '" is not a yyyy-MM-dd date.');
    return;   // a mistyped baseline must stop the run, never fall through to the live rule
  }

  var dates   = sh.getRange(M8_FIRST, M8_COL.DATE,   n, 1).getValues();
  var names   = sh.getRange(M8_FIRST, M8_COL.NAME,   n, 1).getValues();
  var phones  = sh.getRange(M8_FIRST, M8_COL.PHONE,  n, 1).getValues();
  var status  = sh.getRange(M8_FIRST, M8_COL.STATUS, n, 1).getValues();
  // L may not exist yet — degrade to the pre-D-339 behaviour rather than throwing.
  var hasLC   = sh.getLastColumn() >= M8_COL.LAST_CONTACT &&
                String(sh.getRange(1, M8_COL.LAST_CONTACT).getValue()).trim() === 'Last Contact';
  var replies = hasLC ? sh.getRange(M8_FIRST, M8_COL.LAST_CONTACT, n, 1).getValues() : null;
  var dueRng  = sh.getRange(M8_FIRST, M8_COL.DUE,    n, 1);
  var noteRng = sh.getRange(M8_FIRST, M8_COL.NOTES,  n, 1);
  var due     = dueRng.getValues();
  var notes   = noteRng.getValues();

  var today = startOfDay_(new Date());
  var live = 0, closed = 0, historical = 0, nodate = 0, blank = 0;
  var due7 = 0, due30 = 0, lapsed = 0, replied = 0;

  for (var i = 0; i < n; i++) {
    // An enquiry is a row with someone to contact. Name OR phone — the log has
    // 82 rows with a number and no name, and those are still real enquiries.
    if (!String(names[i][0]).trim() && !String(phones[i][0]).trim()) { blank++; continue; }

    notes[i][0] = m8Strip_(notes[i][0]);

    if (contains_(M8_CLOSED, status[i][0])) {
      due[i][0] = '';                       // closed: no next touch point, ever
      closed++;
      continue;
    }

    // STOP-ON-REPLY. Checked before the date maths, because a reply ends the
    // sequence regardless of where in the 7/30 window the lead happens to be.
    if (hasLC && String(replies[i][0]).trim()) {
      var rd = startOfDay_(toDate_(replies[i][0]));
      due[i][0] = '';
      notes[i][0] = m8Note_(notes[i][0],
        'replied' + (rd ? ' ' + fmt_(rd) : '') +
        ' — follow-up sequence stopped, this is a live conversation now');
      replied++;
      continue;
    }

    var d = startOfDay_(toDate_(dates[i][0]));
    if (!d) {
      due[i][0] = '';
      notes[i][0] = m8Note_(notes[i][0], 'no enquiry date — cannot schedule a follow-up');
      nodate++;
      continue;
    }

    if (baseline && d <= baseline) {
      // Historical. Say what is true — it came in with no outcome — and stop.
      // NOT "overdue": nobody failed to act on it inside a system that did not exist.
      due[i][0] = '';
      notes[i][0] = m8Note_(notes[i][0], 'historical enquiry, imported with no outcome recorded');
      historical++;
      continue;
    }

    live++;
    var first  = addDays_(d, M8_DAY1);
    var second = addDays_(d, M8_DAY2);

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
      notes[i][0] = m8Note_(notes[i][0],
        'both follow-ups (day ' + M8_DAY1 + ' and day ' + M8_DAY2 +
        ') are past and no outcome is recorded — set a Status');
      lapsed++;
    }
  }

  if (!baseline && lapsed > M8_FLOOD_LIMIT) {
    // Nothing has been written yet — `due` and `notes` are in-memory copies.
    Logger.log('🔴 ABORT — REFUSING TO WRITE. ' + lapsed + ' enquiries would be marked');
    Logger.log('   lapsed in one run and M8_BASELINE is not set.');
    Logger.log('');
    Logger.log('   That is the signature of a fresh import, not a day of real work.');
    Logger.log('   Writing would stamp "no outcome recorded" across the client\'s live sheet.');
    Logger.log('');
    Logger.log('   FIX: set M8_BASELINE to the enquiry import date (yyyy-MM-dd) and re-run.');
    Logger.log('   Those rows then read as historical, which is what they are.');
    Logger.log('   Nothing has been changed.');
    return;
  }

  dueRng.setValues(due);
  noteRng.setValues(notes);
  SpreadsheetApp.flush();

  Logger.log('=== M6 enquiry follow-up ===');
  Logger.log('  live enquiries ................ ' + live);
  Logger.log('     next touch = day ' + M8_DAY1 + ' ..... ' + due7);
  Logger.log('     next touch = day ' + M8_DAY2 + ' .... ' + due30);
  Logger.log('     🔴 lapsed, needs a Status .. ' + lapsed);
  Logger.log('  replied -> sequence stopped ... ' + (hasLC ? replied
             : 'column L ABSENT — stop-on-reply is OFF. Run add_enquiries_last_contact.gs'));
  Logger.log('  closed (' + M8_CLOSED.join('/') + ') ... ' + closed);
  Logger.log('  historical (pre-baseline) ..... ' + historical);
  Logger.log('  no usable date ................ ' + nodate);
  Logger.log('  blank rows skipped ............ ' + blank);
  Logger.log(baseline
    ? '  baseline ' + fmt_(baseline) + ' — enquiries on or before it are historical'
    : '  ⚠️  M8_BASELINE NOT SET. After the import this flags all 621 rows as lapsed ' +
      'on day one. Set it to the import date.');
}


/** Adds our one line, preserving whatever a human wrote. */
function m8Note_(existing, msg) {
  var line = M8_TAG + ' ' + msg;
  existing = String(existing || '').trim();
  return existing ? line + ' | ' + existing : line;
}

/**
 * Removes ONLY our own previous line. Miss this and the notes column grows a new
 * M8: line every day the script runs — the mistake stripDormant_() was written to
 * fix in M5a, so it is not repeated here.
 */
function m8Strip_(note) {
  var s = String(note || '');
  return s.replace(/M8:[^|]*(\|\s*)?/g, '').trim();
}
