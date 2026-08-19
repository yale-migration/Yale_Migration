/**
 * M9 — INDEPENDENT DEADLINE CHECK for the S56 TRACKER.                 (D-342)
 *
 * ========================= WHY THIS EXISTS =========================
 * The classifier extracts `letter_date` and `days_allowed` from the Department's
 * letter and computes the due date itself. That date is a LEGAL DEADLINE: miss
 * it and the Department decides the application on the information it already
 * has, without asking again.
 *
 * 🔴 A language model doing date arithmetic is not something to take on trust.
 * So this script recomputes every due date from the two extracted primitives —
 * plain deterministic arithmetic, no model involved — and flags any row where
 * the two disagree.
 *
 * **Two independent computations of the same legal deadline.** That is the whole
 * idea, and it is the minimum this deserves.
 *
 * ⛔ IT NEVER OVERWRITES THE DATE. If they disagree we do not know WHICH is
 * wrong — the arithmetic is sound, but `letter_date` or `days_allowed` may
 * themselves have been mis-read from the letter. Silently "correcting" one of
 * them would hide the very disagreement that tells a human to open the PDF.
 * It flags, notes both values, and sets Needs Review. A person adjudicates.
 *
 * ---- the third check, which is the cleverest one -------------------------
 * The verbatim deadline sentence is stored beside the date. If the sentence says
 * "28 days" and `Days Allowed` reads 30, the PARSE was wrong — and that is
 * catchable without the letter, by reading the number back out of the sentence
 * the model itself quoted. A model that misquotes its own source is caught here.
 *
 * ⚠️ Deadlines are extendable ("We might let you have more time…"), so a passed
 * date is reported, never actioned. Nothing here closes, cancels or clears.
 *
 * 🔴 Depends on m5_dormant_detector.gs for its date helpers — same project, so
 * they are in scope. Reused rather than copied because two strict date parsers
 * WILL drift, and the collision gate cannot catch drift between two functions
 * with different names (D-328).
 *
 * Read-only except for flagging. Run it daily, or after any batch of new rows.
 */

var S56V_SHEET_ID = '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k';
var S56V_TAB      = 'S56 TRACKER';
var S56V_FIRST    = 2;

// Must match S56_HEADERS in setup_s56_tracker_tab.gs. Verified by name at runtime
// rather than trusted — a shifted column here means flagging the wrong row.
var S56V_COL = { RECEIVED:1, NAME:2, SUBCLASS:3, DUE:4, INTERNAL:5, DAYS:6,
                 LETTER:7, SENTENCE:8, TRN:9, APPID:10, FILENO:11, CATEGORY:12,
                 CONFIDENCE:13, REVIEW:14, SUBJECT:15, LINK:16, ASSIGNEE:17,
                 STATUS:18, RAW:19 };

// D-58: the Department's clock is 28 days; Yale works to day 26 so there are two
// days of margin before a legal deadline. INTERNAL DUE = legal due - 2.
var S56V_INTERNAL_MARGIN = 2;

var S56V_CLOSED = ['Closed'];


function verifyS56Deadlines() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) { Logger.log('ABORT — could not get the document lock.'); return; }
  try { s56vRun_(); } finally { lock.releaseLock(); }
}


function s56vRun_() {
  if (typeof startOfDay_ !== 'function' || typeof addDays_ !== 'function'
      || typeof fmt_ !== 'function' || typeof toDate_ !== 'function') {
    Logger.log('ABORT — m5_dormant_detector.gs is not in this project.');
    Logger.log('This script reuses its date helpers. Add that file and run again.');
    return;
  }

  var sh = SpreadsheetApp.openById(S56V_SHEET_ID).getSheetByName(S56V_TAB);
  if (!sh) { Logger.log('ABORT — no tab named ' + S56V_TAB); return; }

  // Never trust the column map. Prove it before flagging anything.
  var hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
              .map(function (h) { return String(h || '').trim(); });
  var EXPECT = { 4: 'DUE DATE (legal)', 5: 'INTERNAL DUE', 6: 'Days Allowed',
                 7: 'Letter Date', 8: 'Deadline Sentence', 14: 'Needs Review' };
  for (var pos in EXPECT) {
    if (hdr[Number(pos) - 1] !== EXPECT[pos]) {
      Logger.log('ABORT — column ' + pos + ' is "' + hdr[Number(pos) - 1] +
                 '", expected "' + EXPECT[pos] + '". The tab has changed shape.');
      return;
    }
  }

  var last = sh.getLastRow();
  if (last < S56V_FIRST) { Logger.log('No rows yet — nothing to check.'); return; }
  var n = last - S56V_FIRST + 1;

  var rows    = sh.getRange(S56V_FIRST, 1, n, 19).getValues();
  var reviewR = sh.getRange(S56V_FIRST, S56V_COL.REVIEW, n, 1);
  var review  = reviewR.getValues();
  var dueCells = sh.getRange(S56V_FIRST, S56V_COL.DUE, n, 1);

  var today = startOfDay_(new Date());
  var checked = 0, agree = 0, mismatch = 0, unparseable = 0,
      sentenceMismatch = 0, overdue = 0, dueSoon = 0, noBasis = 0;
  var notes = [];

  for (var i = 0; i < n; i++) {
    var r = rows[i];
    var v = function (c) { return String(r[c - 1] == null ? '' : r[c - 1]).trim(); };
    if (!v(S56V_COL.NAME) && !v(S56V_COL.SUBJECT)) { notes.push(null); continue; }  // blank row

    var letter = startOfDay_(toDate_(r[S56V_COL.LETTER - 1]));
    var days   = parseInt(v(S56V_COL.DAYS), 10);
    var stated = startOfDay_(toDate_(r[S56V_COL.DUE - 1]));
    var note = [];

    // ---- CHECK 3 (done first — it validates the INPUTS to checks 1 and 2) ----
    // Read the number of days back out of the sentence the model itself quoted.
    var sentence = v(S56V_COL.SENTENCE);
    var m = sentence.match(/\b(\d{1,3})\s*days?\b/i);
    if (m && !isNaN(days) && parseInt(m[1], 10) !== days) {
      note.push('🔴 PARSE MISMATCH: the quoted sentence says ' + m[1] +
                ' days but Days Allowed reads ' + days);
      sentenceMismatch++;
    }

    if (!letter || isNaN(days)) {
      // No basis to recompute. Say so — do not quietly skip.
      noBasis++;
      if (!v(S56V_COL.DUE)) {
        note.push('no letter date / days allowed and no due date — nothing to work from');
      } else {
        note.push('⚠️ a due date is set but letter date or days allowed is missing, '
                + 'so it cannot be independently checked');
      }
      notes.push(note.length ? note.join(' | ') : null);
      continue;
    }

    checked++;
    // ---- CHECK 1 · the legal deadline -------------------------------------
    // Spec: due = letter_date + 1 day + days_allowed. The "+1" is the
    // Department's own wording: "starting on the day AFTER we emailed this".
    var recomputed = addDays_(letter, days + 1);

    if (!stated) {
      note.push('🔴 NO DUE DATE SET. Arithmetic gives ' + fmt_(recomputed));
      mismatch++;
    } else if (fmt_(stated) !== fmt_(recomputed)) {
      note.push('🔴 DEADLINE DISAGREEMENT — sheet says ' + fmt_(stated) +
                ', arithmetic on (' + fmt_(letter) + ' + 1 + ' + days + ') gives ' +
                fmt_(recomputed) + '. OPEN THE LETTER. Not auto-corrected.');
      mismatch++;
    } else {
      agree++;
    }

    // ---- CHECK 2 · the internal date the team actually works to ------------
    var internalWant = addDays_(recomputed, -S56V_INTERNAL_MARGIN);
    var internalGot  = startOfDay_(toDate_(r[S56V_COL.INTERNAL - 1]));
    if (!internalGot || fmt_(internalGot) !== fmt_(internalWant)) {
      note.push('internal due should be ' + fmt_(internalWant) +
                ' (legal − ' + S56V_INTERNAL_MARGIN + ' days, D-58)');
    }

    // ---- urgency, reported only ------------------------------------------
    var closed = S56V_CLOSED.indexOf(v(S56V_COL.STATUS)) > -1;
    if (!closed) {
      var basis = stated || recomputed;
      if (basis < today) {
        overdue++;
        note.push('⛔ PAST THE LEGAL DEADLINE (' + fmt_(basis) + '). Deadlines are '
                + 'extendable — this is NOT closed automatically. A human must act.');
      } else if (basis <= addDays_(today, 7)) {
        dueSoon++;
      }
    }

    // Anything flagged goes to Needs Review so it surfaces, not just in a log
    // nobody reads.
    if (note.length && String(review[i][0]).trim().toUpperCase() !== 'YES') {
      review[i][0] = 'YES';
    }
    notes.push(note.length ? note.join(' | ') : null);
  }

  // Write the findings as cell NOTES on the due date — visible where the number
  // is, rather than in a log that closes with the window.
  for (var j = 0; j < notes.length; j++) {
    try {
      var cell = dueCells.getCell(j + 1, 1);
      if (notes[j]) cell.setNote(notes[j]); else cell.clearNote();
    } catch (e) { /* a note failing must never stop the check */ }
  }
  reviewR.setValues(review);
  SpreadsheetApp.flush();

  Logger.log('=== S56 deadline check ===');
  Logger.log('  rows independently recomputed .. ' + checked);
  Logger.log('  ✅ agree ....................... ' + agree);
  Logger.log('  🔴 DISAGREE — open the letter .. ' + mismatch);
  Logger.log('  🔴 sentence vs days mismatch ... ' + sentenceMismatch);
  Logger.log('  ⚠️  no basis to check ........... ' + noBasis);
  Logger.log('  ⛔ past the legal deadline ..... ' + overdue);
  Logger.log('  ⏳ due within 7 days ........... ' + dueSoon);
  Logger.log('');
  Logger.log(mismatch + sentenceMismatch === 0
    ? 'Every computed deadline matches an independent recomputation.'
    : '🔴 ' + (mismatch + sentenceMismatch) + ' row(s) flagged. Notes are on the DUE DATE cells, '
      + 'and Needs Review is set to YES. Nothing was auto-corrected.');
}
