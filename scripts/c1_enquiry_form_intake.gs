/**
 * C-1 — CLIENT ENQUIRY FORM → ENQUIRIES                    (contracted, 2h · D-314)
 *
 * Their own Google Form is the front door. D-314: **"Ask for it — do not design it."**
 * We asked, and on 21 Aug they sent the live link. The nine questions below were read
 * out of the form's own payload, not guessed:
 *
 *   INQUIRY FORM YALE MIGRATION PINOY
 *   1 Complete Name            6 Current Work Experience
 *   2 Age                      7 Course completed
 *   3 Mobile No./WhatsApp No.  8 Interested in?   (checkbox, 10 options, multi-select)
 *   4 Email Address            9 free-text: "tell us about your situation"
 *   5 Location  (Australia | Philippines)
 *
 * ⛔ WHAT IS NOT DONE, AND WHY IT IS NOT A BUG
 * We hold the form's QUESTIONS. We do not hold its RESPONSES. `project1@` can read three
 * of their spreadsheets and the form's response destination is not one of them — it was
 * never established and never asked for (I-14 was closed on the field set alone, D-358).
 * So `onC1FormSubmit` and `c1ImportFromResponseSheet` are written and tested, and neither
 * can run until that access exists. **The transform is the work; the pipe is one setting.**
 *
 * ============================ THREE DELIBERATE BLANKS ============================
 * These are decisions, not omissions. Do not "fix" them.
 *
 * 1. `Channel` (E) is left BLANK.
 *    🔴 D-330: we once defaulted enquiry Channel to `Phone` and Rey corrected it four
 *    hours later — *"inquiries come from both whatsapp and social media"*. The form does
 *    not ask how they found Yale, so we do not know. A form submitted from a Facebook ad
 *    is a Facebook enquiry, and calling it `Website` would quietly corrupt the one number
 *    the enquiry dashboard exists to report.
 *
 * 2. `Status` (I) is left BLANK.
 *    Status is the consultant's judgement and the vocabulary is theirs (SOP-CI-001 10B).
 *    m8_lead_followup.gs deliberately never writes it either; this matches.
 *
 * 3. `Assigned To` (H) is left BLANK.
 *    A human decides who owns a lead. ⚠️ It is also a locked dropdown, and the roster has
 *    changed three times in two weeks (D-355) — writing a name we inferred is how you get
 *    a cell that silently refuses.
 *
 * 🔑 `Visa Interest` (F) is FREE TEXT, checked against setup_master_sheet.gs before writing
 * this. So their own wording is stored VERBATIM — "Graduate Visa", not "485". Translating
 * their words into visa subclasses would be us deciding what a person is applying for,
 * which is migration advice and not ours to give. A consultant reads it and decides.
 *
 * Run `runC1SelfTest()` — it needs no sheet, no form and no network.
 */

// ⚠️ C1_ prefix on EVERY global. Apps Script gives all .gs files in a project ONE global
// scope, and this project has already been bitten twice — CF_HEADER declared in two files
// with different values, and FIRST_ROW shared silently between M5 and master_codes.
var C1_TAB     = 'ENQUIRIES';
var C1_HEADERS = ['Date','Name','Phone','Email','Channel','Visa Interest','Location',
                  'Assigned To','Status','Follow-up Due','Notes'];

// Their question titles, exactly as the live form returns them. If they rename a question
// the map misses and the value lands in Notes rather than vanishing — see c1MapResponse_.
var C1_Q = {
  NAME:     'Complete Name',
  AGE:      'Age',
  PHONE:    'Mobile No./WhatsApp No.',
  EMAIL:    'Email Address',
  LOCATION: 'Location',
  WORK:     'Current Work Experience',
  COURSE:   'Course completed',
  INTEREST: 'Interested in?'
};

// Their form says where the person IS. ENQUIRIES column G is a LOCKED dropdown holding
// Onshore/Offshore, so this is a translation into the sheet's vocabulary, not a judgement.
var C1_LOCATION = { 'Australia': 'Onshore', 'Philippines': 'Offshore' };

// A-32, their words: "too much column is a lot to handle." These three questions have no
// ENQUIRIES column and they are NOT getting one. They go to Notes, labelled, so nothing
// is lost and the sheet does not grow.
var C1_TO_NOTES = [
  { q: 'AGE',    label: 'Age' },
  { q: 'WORK',   label: 'Work experience' },
  { q: 'COURSE', label: 'Course completed' }
];

/**
 * THE TRANSFORM. Pure: an object of {question title: answer} in, one ENQUIRIES row out.
 * No sheet, no clock, no network — which is the only reason it can be tested today,
 * months before the response feed exists.
 *
 * @param {Object} resp   question title -> answer (string, or array for checkboxes)
 * @param {Date}   when   submission timestamp
 * @return {Array} one row in C1_HEADERS order
 */
function c1MapResponse_(resp, when) {
  resp = resp || {};
  var get = function (key) {
    var v = resp[C1_Q[key]];
    if (v === null || v === undefined) return '';
    // Checkboxes arrive as an array. Join with the separator their sheet already uses.
    return Array.isArray(v) ? v.filter(String).join(' · ') : String(v).trim();
  };

  var notes = [];
  C1_TO_NOTES.forEach(function (n) {
    var v = get(n.q);
    if (v) notes.push(n.label + ': ' + v);
  });

  // The free-text question is long and its title is a whole sentence, so it is matched by
  // elimination rather than by name — if they reword it, it still arrives.
  var known = {};
  Object.keys(C1_Q).forEach(function (k) { known[C1_Q[k]] = true; });
  Object.keys(resp).forEach(function (title) {
    if (known[title] || /^timestamp$/i.test(title)) return;
    var v = resp[title];
    v = Array.isArray(v) ? v.join(' · ') : String(v == null ? '' : v).trim();
    if (v) notes.push(v);          // unlabelled: it is the client's own sentence
  });

  var loc = get('LOCATION');
  // ⛔ An unrecognised location is dropped, never passed through. Column G is
  // setAllowInvalid(false) and would refuse it — the D-353 failure, silently.
  var locOut = Object.prototype.hasOwnProperty.call(C1_LOCATION, loc) ? C1_LOCATION[loc] : '';
  if (loc && !locOut) notes.push('Location on the form said: ' + loc);

  var row = {
    'Date':          when || '',
    'Name':          get('NAME'),
    'Phone':         get('PHONE'),
    'Email':         get('EMAIL'),
    'Channel':       '',            // deliberate — see header note 1 (D-330)
    'Visa Interest': get('INTEREST'),
    'Location':      locOut,
    'Assigned To':   '',            // deliberate — see header note 3
    'Status':        '',            // deliberate — see header note 2
    'Follow-up Due': '',            // M8 owns the cadence, not this
    'Notes':         notes.join(' | ')
  };
  return C1_HEADERS.map(function (h) { return row[h]; });
}

/** Live trigger. Install on the RESPONSE SHEET once access exists. */
function onC1FormSubmit(e) {
  if (!e || !e.namedValues) { Logger.log('C-1: no event payload — run from a form trigger.'); return; }
  var resp = {};
  Object.keys(e.namedValues).forEach(function (k) {
    var v = e.namedValues[k];
    resp[k] = (v && v.length === 1) ? v[0] : v;
  });
  c1Append_([c1MapResponse_(resp, new Date())]);
  Logger.log('C-1: 1 enquiry appended.');
}

/**
 * Bulk backfill from the form's response sheet, once we can read it.
 * ⛔ Idempotent by EMAIL + DATE. Re-running must never double a lead — M8 would then
 * run two follow-up clocks against one person, which is the failure D-343 describes.
 */
function c1ImportFromResponseSheet(spreadsheetId, tabName) {
  var src = SpreadsheetApp.openById(spreadsheetId).getSheetByName(tabName || 'Form Responses 1');
  if (!src) { Logger.log('C-1: response tab not found.'); return; }
  var vals = src.getDataRange().getValues();
  if (vals.length < 2) { Logger.log('C-1: no responses.'); return; }
  var head = vals[0];

  var dest = SpreadsheetApp.getActive().getSheetByName(C1_TAB);
  var seen = {};
  dest.getDataRange().getValues().slice(1).forEach(function (r) {
    seen[String(r[3]).toLowerCase() + '|' + String(r[0])] = true;   // Email | Date
  });

  var add = [], skipped = 0;
  for (var i = 1; i < vals.length; i++) {
    var resp = {}, when = vals[i][0];
    for (var c = 0; c < head.length; c++) resp[head[c]] = vals[i][c];
    var row = c1MapResponse_(resp, when);
    var key = String(row[3]).toLowerCase() + '|' + String(row[0]);
    if (seen[key]) { skipped++; continue; }
    seen[key] = true;
    add.push(row);
  }
  if (add.length) c1Append_(add);
  Logger.log('C-1: appended ' + add.length + ', skipped ' + skipped + ' already present.');
}

function c1Append_(rows) {
  var sh = SpreadsheetApp.getActive().getSheetByName(C1_TAB);
  if (!sh) throw new Error('C-1: no ' + C1_TAB + ' tab.');
  var lock = LockService.getDocumentLock();     // M8 writes this tab on a daily trigger
  lock.waitLock(15000);
  try {
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, C1_HEADERS.length).setValues(rows);
  } finally {
    lock.releaseLock();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
function runC1SelfTest() {
  var pass = 0, fail = 0;
  var check = function (label, ok, detail) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + label + (detail ? '   — ' + detail : ''));
    ok ? pass++ : fail++;
  };
  var H = function (row, name) { return row[C1_HEADERS.indexOf(name)]; };
  var full = {
    'Complete Name': 'A. Dela Cruz', 'Age': '29',
    'Mobile No./WhatsApp No.': '+63 917 000 0000', 'Email Address': 'a@example.com',
    'Location': 'Philippines', 'Current Work Experience': 'Chef, 4 years',
    'Course completed': 'BS Hotel Management',
    'Interested in?': ['Graduate Visa', 'Skills Assessment'],
    "We'd love to help you in the best way possible. Could you please share a bit more about your situation or inquiry?":
      'My student visa expires in March.'
  };
  var r = c1MapResponse_(full, new Date('2026-08-22T10:00:00'));

  Logger.log('=== direct fields ===');
  check('name', H(r, 'Name') === 'A. Dela Cruz');
  check('phone', H(r, 'Phone') === '+63 917 000 0000');
  check('email', H(r, 'Email') === 'a@example.com');

  Logger.log('\n=== the locked columns — a wrong value here is REFUSED silently (D-353) ===');
  check('Philippines -> Offshore', H(r, 'Location') === 'Offshore', H(r, 'Location'));
  check('Australia -> Onshore', H(c1MapResponse_({ 'Location': 'Australia' }, null), 'Location') === 'Onshore');
  check('🔴 an unrecognised location is DROPPED, not passed through',
        H(c1MapResponse_({ 'Location': 'Dubai' }, null), 'Location') === '');
  check('...and is preserved in Notes so nothing is lost',
        H(c1MapResponse_({ 'Location': 'Dubai' }, null), 'Notes').indexOf('Dubai') > -1);
  check('🔴 Channel stays BLANK — the form never asks how they found Yale (D-330)',
        H(r, 'Channel') === '');
  check('🔴 Status stays BLANK — it is the consultant\'s judgement', H(r, 'Status') === '');
  check('🔴 Assigned To stays BLANK — the roster changes weekly (D-355)', H(r, 'Assigned To') === '');

  Logger.log('\n=== multi-select and verbatim wording ===');
  check('checkboxes join, they do not overwrite',
        H(r, 'Visa Interest') === 'Graduate Visa · Skills Assessment', H(r, 'Visa Interest'));
  // 🔑 If this ever fails because someone "helpfully" mapped Graduate Visa -> 485, read the
  // header. Deciding which subclass a person needs is migration advice.
  check('🔴 their wording is stored VERBATIM, never translated to a subclass',
        H(r, 'Visa Interest').indexOf('485') === -1);

  Logger.log('\n=== the three fields with no column (A-32: "too much column") ===');
  var n = H(r, 'Notes');
  check('age in Notes', n.indexOf('Age: 29') > -1);
  check('work experience in Notes', n.indexOf('Work experience: Chef, 4 years') > -1);
  check('course in Notes', n.indexOf('Course completed: BS Hotel Management') > -1);
  check('the free-text answer survives even though its title is a sentence',
        n.indexOf('My student visa expires in March.') > -1);
  check('a question we have never seen still reaches Notes rather than vanishing',
        H(c1MapResponse_({ 'Some new question they added': 'yes' }, null), 'Notes').indexOf('yes') > -1);

  Logger.log('\n=== empties and shape ===');
  var e = c1MapResponse_({}, null);
  check('an empty response produces a row, not an exception', e.length === C1_HEADERS.length);
  check('...and every cell is empty', e.every(function (c) { return c === ''; }));
  check('row width always matches the tab', r.length === C1_HEADERS.length);
  check('a blank optional field does not print a stray label',
        H(c1MapResponse_({ 'Complete Name': 'B' }, null), 'Notes') === '');

  Logger.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
  if (fail) throw new Error('C-1 self-test FAILED: ' + fail);
  return pass + '/' + (pass + fail);
}
