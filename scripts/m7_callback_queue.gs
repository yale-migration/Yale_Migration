/**
 * M7 — promote new-enquiry calls into ENQUIRIES, and report the callback queue.
 *
 * ================= WHY PROMOTION EXISTS AT ALL =================
 * `ARCHITECTURE.md` routes the phone log into ENQUIRIES, and `Phone` is already a
 * value in the ENQUIRIES `Channel` dropdown. But a CALL is not an ENQUIRY: an
 * existing client ringing about their 485 is not a lead, and writing them into
 * ENQUIRIES would have M8 nurture them as a cold prospect on a 7/30 cadence.
 *
 * So CALL LOG records every call, and ONLY the ones marked `Becomes Enquiry = Yes`
 * cross over. One lead, one row, one cadence, owned by M8.
 *
 * ⛔ ONE-WAY AND ONCE. `Promoted` (P) carries the timestamp and is the guard. A row
 * with a timestamp is skipped forever. Promote twice and the person has two rows in
 * ENQUIRIES, two follow-up clocks, and gets chased twice — which reads as harassment
 * from a firm they have just contacted for the first time.
 *
 * ⚠️ IT NEVER WRITES BACK TO CALL LOG EXCEPT THAT ONE TIMESTAMP. It does not edit the
 * call record, does not set Status, does not touch Notes.
 *
 * ================= WHY THE QUEUE REPORT DOES NOT WRITE =================
 * The callback queue IS the sheet: `Callback Due` plus the red highlight from
 * setup_call_log_tab.gs already surface an overdue callback where the person is
 * looking. A script that also wrote "overdue" into a cell would be a second copy of
 * a fact the sheet already shows — and every second copy in this project has drifted
 * from the first. `callbackQueueReport()` is READ-ONLY on purpose.
 */

var M7_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var M7_CALL_TAB = 'CALL LOG';
var M7_ENQ_TAB  = 'ENQUIRIES';
var M7_FIRST    = 2;

// CALL LOG A..Q — must match CL_HEADERS in setup_call_log_tab.gs. Proven at runtime.
// ⚠️ SHIFTED 22 Aug — the intake block (Email/Location/Visa Interest) went in at F/G/H,
// so everything from Matched Code rightwards moved by three. setup_call_log_tab.gs is the
// contract; if these two disagree, promote writes the wrong cells and reports success.
var M7_CL = { RECEIVED:1, NAME:2, PHONE:3, NEWEXIST:4, REASON:5,
              EMAIL:6, LOCATION:7, VISA:8,
              CODE:9, MATCHED:10, MATCHEDON:11, OUTSTANDING:12, IDVERIFIED:13,
              BESTCB:14, CBDUE:15, CBSTATUS:16, HANDLEDBY:17, BECOMES:18,
              PROMOTED:19, NOTES:20 };

// ENQUIRIES A..K (+ L Last Contact, added D-339 — M8 reads it, we never write it).
var M7_ENQ = { DATE:1, NAME:2, PHONE:3, EMAIL:4, CHANNEL:5, VISA:6, LOCATION:7,
               ASSIGNED:8, STATUS:9, DUE:10, NOTES:11 };

// ⚠️ DERIVED. This was hardcoded as 17 in two getRange calls and silently stopped reading
// 'Becomes Enquiry' the moment the intake block widened the tab to 20 — promote reported
// "not marked Yes: 1" and skipped every lead, with no error. A hardcoded width beside a
// list that grows is the same trap as CL_HELPER_PHONE=18, found the same afternoon.
var M7_CL_WIDTH = M7_CL.NOTES;

var M7_PROMOTE_WHEN = 'Yes';


function promoteCallsToEnquiries() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try { m7PromoteRun_(); } finally { lock.releaseLock(); }
}


function m7PromoteRun_() {
  var ss = SpreadsheetApp.openById(M7_SHEET_ID);
  var cl = ss.getSheetByName(M7_CALL_TAB);
  var eq = ss.getSheetByName(M7_ENQ_TAB);
  if (!cl) { Logger.log('ABORT — no tab named ' + M7_CALL_TAB); return; }
  if (!eq) { Logger.log('ABORT — no tab named ' + M7_ENQ_TAB); return; }

  // Prove BOTH tabs before writing to either. A shifted column on the ENQUIRIES side
  // would write a phone number into Visa Interest and look like a data-entry mistake.
  // Positions shifted by the intake block (22 Aug). This guard is what caught the shift
  // during the change — it refused to write rather than writing into the wrong columns,
  // which is exactly the failure it was built for.
  if (!m7CheckHeaders_(cl, { 3:'Phone', 6:'Email', 7:'Location', 8:'Visa Interest',
                             18:'Becomes Enquiry', 19:'Promoted' }, M7_CALL_TAB)) return;
  if (!m7CheckHeaders_(eq, { 1:'Date', 2:'Name', 3:'Phone', 5:'Channel', 9:'Status' }, M7_ENQ_TAB)) return;

  var last = cl.getLastRow();
  if (last < M7_FIRST) { Logger.log('No calls logged — nothing to promote.'); return; }
  var n = last - M7_FIRST + 1;

  var rows = cl.getRange(M7_FIRST, 1, n, M7_CL_WIDTH).getValues();
  var promotedCol = cl.getRange(M7_FIRST, M7_CL.PROMOTED, n, 1);
  var promoted = promotedCol.getValues();

  var toAdd = [], marked = 0, already = 0, notFlagged = 0, blank = 0;
  var now = new Date();

  for (var i = 0; i < n; i++) {
    var r = rows[i];
    var v = function (c) { return String(r[c - 1] == null ? '' : r[c - 1]).trim(); };

    if (!v(M7_CL.NAME) && !v(M7_CL.PHONE)) { blank++; continue; }
    if (String(promoted[i][0]).trim()) { already++; continue; }
    if (v(M7_CL.BECOMES) !== M7_PROMOTE_WHEN) { notFlagged++; continue; }

    // (There was a second guard here with the IDENTICAL condition to the blank check
    // above — unreachable, and it made the code look like it screened for something it
    // never screened for. A guard that cannot fire is not a guard. Removed 20 Aug.
    // A row with a phone and no name IS promotable: M8 can still ring them, and 82 rows
    // in their own enquiry log are exactly that — a number with no name.)

    var row = new Array(11).fill('');
    row[M7_ENQ.DATE - 1]     = r[M7_CL.RECEIVED - 1] || now;
    row[M7_ENQ.NAME - 1]     = v(M7_CL.NAME);
    row[M7_ENQ.PHONE - 1]    = v(M7_CL.PHONE);
    row[M7_ENQ.CHANNEL - 1]  = 'Phone';          // already in the ENQUIRIES Channel dropdown
    // The intake block. Before 22 Aug these three were left blank because CALL LOG had
    // nowhere to hold them, so every promoted call produced an enquiry the system could
    // not email, could not place onshore/offshore, and could not report by visa line.
    row[M7_ENQ.EMAIL - 1]    = v(M7_CL.EMAIL);
    row[M7_ENQ.VISA - 1]     = v(M7_CL.VISA);     // free text both sides — verbatim
    // ⛔ ENQUIRIES G is a LOCKED dropdown. Anything that is not exactly Onshore/Offshore is
    // dropped and kept in Notes instead — passing it through is D-353, silently refused.
    var loc = v(M7_CL.LOCATION);
    row[M7_ENQ.LOCATION - 1] = (loc === 'Onshore' || loc === 'Offshore') ? loc : '';
    row[M7_ENQ.ASSIGNED - 1] = v(M7_CL.HANDLEDBY) || 'Unassigned';
    // ⛔ Status is left BLANK on purpose. It is the consultant's judgement in their own
    // vocabulary (SOP-CI-001 10B) and nothing here infers it — the same rule M8 follows.
    // ⛔ Follow-up Due is left BLANK: M8 computes the whole 7/30 cadence from Date, and a
    // date written here would be a second, competing source for the same clock.
    row[M7_ENQ.NOTES - 1]    = 'From CALL LOG ' + Utilities.formatDate(
                                 now, Session.getScriptTimeZone(), 'yyyy-MM-dd')
                               + (v(M7_CL.REASON) ? ' — ' + v(M7_CL.REASON) : '')
                               + ((loc && loc !== 'Onshore' && loc !== 'Offshore')
                                  ? ' | Location on the call log said: ' + loc : '');
    toAdd.push(row);
    promoted[i][0] = now;
    marked++;
  }

  if (toAdd.length) {
    // Append below whatever is there. getLastRow() is read INSIDE the lock, so a
    // concurrent M8 run cannot shift the target between our read and our write.
    eq.getRange(eq.getLastRow() + 1, 1, toAdd.length, 11).setValues(toAdd);
    SpreadsheetApp.flush();
    // 🔴 Stamp Promoted ONLY AFTER the ENQUIRIES write has committed. Stamp first and a
    // failure here loses the lead silently — it would look promoted and never exist.
    promotedCol.setValues(promoted);
    SpreadsheetApp.flush();
  }

  Logger.log('=== M7 promote calls -> ENQUIRIES ===');
  Logger.log('  promoted .......................... ' + marked);
  Logger.log('  already promoted, skipped ......... ' + already);
  Logger.log('  not marked "' + M7_PROMOTE_WHEN + '" .................. ' + notFlagged);
  Logger.log('  blank rows ........................ ' + blank);
  Logger.log('');
  Logger.log(marked ? 'M8 now owns the 7/30 cadence for those ' + marked + ' lead(s).'
                    : 'Nothing new to promote.');
}


/** READ-ONLY. Reports the callback queue; writes nothing. */
function callbackQueueReport() {
  var cl = SpreadsheetApp.openById(M7_SHEET_ID).getSheetByName(M7_CALL_TAB);
  if (!cl) { Logger.log('ABORT — no tab named ' + M7_CALL_TAB); return; }
  var last = cl.getLastRow();
  if (last < M7_FIRST) { Logger.log('No calls logged.'); return; }

  var rows = cl.getRange(M7_FIRST, 1, last - M7_FIRST + 1, M7_CL_WIDTH).getValues();
  var now = new Date();
  var pending = 0, overdue = 0, weak = 0, unverified = 0, lines = [];

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var v = function (c) { return String(r[c - 1] == null ? '' : r[c - 1]).trim(); };
    if (!v(M7_CL.NAME) && !v(M7_CL.PHONE)) continue;

    if (v(M7_CL.MATCHEDON).indexOf('VERIFY') > -1) weak++;
    if (v(M7_CL.MATCHEDON) && !v(M7_CL.IDVERIFIED)) unverified++;

    if (v(M7_CL.CBSTATUS) === 'Pending') {
      pending++;
      var dueRaw = r[M7_CL.CBDUE - 1];
      var due = dueRaw instanceof Date ? dueRaw : null;
      if (due && due < now) {
        overdue++;
        lines.push('    row ' + (i + M7_FIRST) + '  ' + (v(M7_CL.NAME) || v(M7_CL.PHONE))
                   + '  due ' + Utilities.formatDate(due, Session.getScriptTimeZone(),
                                                     'yyyy-MM-dd HH:mm'));
      }
    }
  }

  Logger.log('=== CALL LOG — callback queue (read-only) ===');
  Logger.log('  callbacks pending ................. ' + pending);
  Logger.log('  ⛔ OVERDUE ........................ ' + overdue);
  lines.forEach(function (l) { Logger.log(l); });
  Logger.log('');
  Logger.log('  ⚠️ matched on NAME only ........... ' + weak + '  (no DOB exists to confirm — A-35)');
  Logger.log('  ⚠️ matched but ID not confirmed ... ' + unverified);
  Logger.log('');
  Logger.log('Nothing was written. The red rows in CALL LOG are the queue.');
}


function m7CheckHeaders_(sh, expect, tabName) {
  var hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
              .map(function (h) { return String(h || '').trim(); });
  for (var pos in expect) {
    if (hdr[Number(pos) - 1] !== expect[pos]) {
      Logger.log('ABORT — ' + tabName + ' column ' + pos + ' is "' + hdr[Number(pos) - 1]
                 + '", expected "' + expect[pos] + '". Tab shape changed; writing nothing.');
      return false;
    }
  }
  return true;
}
