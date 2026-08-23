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
 * ✅ THE RESPONSES ARRIVED — 22 Aug. `Inquiry form (Responses)`, shared with `project1@`
 * and confirmed readable at zero operations cost (D-367). `c1ImportFromResponseSheet()`
 * now reads it directly.
 *
 * ⛔ IT IS DRY-RUN BY DEFAULT AND MUST STAY THAT WAY UNTIL YALE ANSWERS ONE QUESTION.
 * The workbook holds ~2,400 form rows across two tabs, against the 621 in `DATA SHEET.xlsx`
 * that M8's cadence was planned around (D-370). **Which of these is the enquiry system of
 * record is theirs to say, not ours to infer** — and M8 starts a 7/30 follow-up clock on
 * every row it finds, so importing the wrong list is not a tidy-up, it is contacting
 * thousands of people.
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

// ══════════════════════════════════════════════════════════════════════════════
// HEADER RESOLUTION — added 23 Aug, once the real response sheet arrived
// ══════════════════════════════════════════════════════════════════════════════
// 🔴 The live sheet does NOT have the tidy nine headings the form declares. Someone has
// typed client answers INTO the header row and they have stayed there:
//
//   Form Responses 1        [5] "Phone number 0422649333"   [8] "Work Experience CHEF 2 yr"
//                           [0] (BLANK) — and this is the column holding the client's NAME
//   Form Responses 2 2025   [2] a bare phone number          [3] "Column 3"
//
// 🔑 `Filipino StudentsAdmissions` is the same form UNCONTAMINATED — "Phone Number",
// "Work Experience", "Referred by". It is the reference for what these headings should
// say, which is how the pattern list below was derived rather than guessed.
//
// The contamination is always an answer APPENDED to a real label, so prefix matching
// recovers it. Anything that does not resolve is NOT dropped — it goes to Notes with its
// own heading, so a column we failed to recognise is visible rather than lost.
var C1_FIELD_PATTERNS = {
  NAME:      ['full name'],
  EMAIL:     ['email address'],
  PHONE:     ['phone number', 'phone'],
  LOCATION:  ['current address'],
  INTEREST:  ['inquiring for', 'interested in'],
  TIMESTAMP: ['timestamp'],
  // these have no ENQUIRIES column and go to Notes, labelled (A-32)
  CLIENTTYPE:['client type'],
  REFERRED:  ['referred by'],
  EDUCATION: ['educational background'],
  WORK:      ['work experience'],
  VISAHELD:  ['please specify below if you currently hold a visa',
              'please indicate below if you currently hold a visa'],
  INQUIRY:   ['please specify your inquiry'],
  CONTACTPREF:['best type of contact']
};

/**
 * Resolve a real header row to column indexes. Prefix match, case-insensitive.
 * @return {Object} { fields:{FIELD:index}, unmapped:[{i,label}], notes:[string] }
 */
function c1ResolveHeaders_(hdr) {
  var norm = function (h) { return String(h == null ? '' : h).replace(/\s+/g, ' ').trim().toLowerCase(); };
  var fields = {}, taken = {}, notes = [];

  Object.keys(C1_FIELD_PATTERNS).forEach(function (f) {
    for (var p = 0; p < C1_FIELD_PATTERNS[f].length; p++) {
      var pat = C1_FIELD_PATTERNS[f][p];
      for (var i = 0; i < hdr.length; i++) {
        if (taken[i]) continue;
        if (norm(hdr[i]).indexOf(pat) === 0) { fields[f] = i; taken[i] = true; return; }
      }
    }
  });

  // 🔴 Form Responses 1 holds the client's NAME in column 0 with NO heading at all.
  // Falling back to position is fragile, so it is guarded: only column 0, only when no
  // Name column resolved, and only when that heading is genuinely empty. It is also
  // reported, because a positional guess should never be silent.
  if (fields.NAME === undefined && hdr.length && norm(hdr[0]) === '') {
    fields.NAME = 0; taken[0] = true;
    notes.push('name taken from column A, which has no heading');
  }

  var unmapped = [];
  for (var j = 0; j < hdr.length; j++) {
    if (taken[j]) continue;
    var label = String(hdr[j] == null ? '' : hdr[j]).trim();
    if (label) unmapped.push({ i: j, label: label });
  }
  return { fields: fields, unmapped: unmapped, notes: notes };
}

/** One sheet row -> one ENQUIRIES row, using a resolved header map. */
function c1RowToEnquiry_(row, res, fallbackWhen) {
  var F = res.fields;
  var at = function (f) {
    var i = F[f];
    if (i === undefined || i >= row.length) return '';
    var v = row[i];
    return v === null || v === undefined ? '' : String(v).trim();
  };

  var notes = [];
  [['CLIENTTYPE','Client type'],['REFERRED','Referred by'],['EDUCATION','Education'],
   ['WORK','Work experience'],['VISAHELD','Visa held'],['INQUIRY','Enquiry'],
   ['CONTACTPREF','Best contact']].forEach(function (pair) {
    var v = at(pair[0]); if (v) notes.push(pair[1] + ': ' + v);
  });
  // ⛔ An unrecognised column is NEVER dropped — it lands in Notes with its heading, so a
  // header we failed to parse shows up as data rather than as silence.
  res.unmapped.forEach(function (u) {
    var v = u.i < row.length && row[u.i] != null ? String(row[u.i]).trim() : '';
    if (v) notes.push(u.label + ': ' + v);
  });

  // ⛔ ENQUIRIES G is a locked dropdown (Onshore/Offshore). Their form asks for an
  // ADDRESS, which is neither — so Location stays BLANK and the address goes to Notes.
  // Inferring onshore/offshore from an address string is a guess about where a person
  // is, and that is not ours to make (D-353, D-359).
  var addr = at('LOCATION');
  if (addr) notes.push('Address: ' + addr);

  var when = at('TIMESTAMP') || fallbackWhen || '';
  var row_ = {
    'Date': when, 'Name': at('NAME'), 'Phone': at('PHONE'), 'Email': at('EMAIL'),
    'Channel': '',            // D-330 — the form never asks how they found Yale
    'Visa Interest': at('INTEREST'),
    'Location': '',           // see above
    'Assigned To': '', 'Status': '', 'Follow-up Due': '',
    'Notes': notes.join(' | ')
  };
  return C1_HEADERS.map(function (h) { return row_[h]; });
}

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

// 🔑 The live response workbook, shared by RJ on 22 Aug and confirmed readable by
// project1@ via rpcSpreadsheet at zero operations cost (D-367).
var C1_RESPONSES_ID = '1vNnefC2nS4dKDDWPnCSJDvt09tkwdjpUQSK7KbuHwAo';
// ⛔ Only the two FORM tabs. `Query`, `CallsmessagesRecord` and `Filipino
// StudentsAdmissions` are theirs — a query log, a call log and an admissions list. They
// are not form responses and importing them would put 1,870 rows of the wrong thing into
// ENQUIRIES, where M8 would then start a follow-up clock on every one.
var C1_RESPONSE_TABS = ['Form Responses 1', 'Form Responses 2 2025'];

/**
 * Backfill ENQUIRIES from the shared response workbook.
 *
 *     c1ImportFromResponseSheet()            ← DRY RUN. Reports, writes nothing.
 *     c1ImportFromResponseSheet(true)        ← writes
 *
 * ⛔ DRY RUN BY DEFAULT, and that is deliberate. There are ~2,400 rows across the two
 * tabs against 621 in the source we originally planned for (D-370). A silent import of
 * the wrong scale is exactly the failure M8's flood guard exists to prevent, and this
 * runs before anyone has decided which list is the system of record.
 *
 * ⛔ Idempotent by EMAIL + DATE. Re-running must never double a lead — M8 would then run
 * two follow-up clocks against one person (D-343).
 */
function c1ImportFromResponseSheet(commit) {
  var src = SpreadsheetApp.openById(C1_RESPONSES_ID);
  var dest = SpreadsheetApp.getActive().getSheetByName(C1_TAB);
  if (!dest) { Logger.log('ABORT — no ' + C1_TAB + ' tab in this spreadsheet.'); return; }

  var seen = {};
  dest.getDataRange().getValues().slice(1).forEach(function (r) {
    seen[String(r[3]).toLowerCase().trim() + '|' + String(r[0]).trim()] = true;
  });
  var already = Object.keys(seen).length;

  var add = [], skipped = 0, blank = 0;
  Logger.log('=== C-1 backfill  (' + (commit ? 'WRITING' : 'DRY RUN — nothing will be written') + ') ===');

  C1_RESPONSE_TABS.forEach(function (tab) {
    var sh = src.getSheetByName(tab);
    if (!sh) { Logger.log('  SKIP ' + tab + ' — no such tab'); return; }
    var vals = sh.getDataRange().getValues();
    if (vals.length < 2) { Logger.log('  ' + tab + ': no rows'); return; }

    var res = c1ResolveHeaders_(vals[0]);
    Logger.log('  ' + tab + ': ' + (vals.length - 1) + ' rows · resolved ' +
               Object.keys(res.fields).length + ' fields · ' + res.unmapped.length + ' unmapped -> Notes');
    res.notes.forEach(function (n) { Logger.log('     ⚠️  ' + n); });
    // 🔴 Without a name AND without an email there is nothing to contact and nothing to
    // dedupe on. Better to report those than to create rows nobody can act on.
    if (res.fields.NAME === undefined && res.fields.EMAIL === undefined) {
      Logger.log('     🔴 SKIPPING TAB — neither a name nor an email column could be resolved.');
      return;
    }

    for (var i = 1; i < vals.length; i++) {
      var row = c1RowToEnquiry_(vals[i], res, '');
      if (!String(row[1]).trim() && !String(row[3]).trim()) { blank++; continue; }
      var key = String(row[3]).toLowerCase().trim() + '|' + String(row[0]).trim();
      if (seen[key]) { skipped++; continue; }
      seen[key] = true;
      add.push(row);
    }
  });

  Logger.log('');
  Logger.log('  already in ENQUIRIES ......... ' + already);
  Logger.log('  new rows this run ............ ' + add.length);
  Logger.log('  duplicates skipped ........... ' + skipped);
  Logger.log('  no name and no email ......... ' + blank);

  if (!commit) {
    Logger.log('');
    Logger.log('DRY RUN — nothing written. Re-run as c1ImportFromResponseSheet(true) to commit.');
    Logger.log('⛔ Before committing: confirm with Yale WHICH list is the enquiry system of');
    Logger.log('   record. This workbook holds ~7x the rows of the source M8 was planned');
    Logger.log('   against, and M8 starts a follow-up clock on every row it finds (D-370).');
    return;
  }
  if (add.length) c1Append_(add);
  Logger.log('WROTE ' + add.length + ' row(s) to ' + C1_TAB + '.');
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

  Logger.log('\n=== header resolution against the REAL response sheet (23 Aug) ===');
  {
    // Verbatim header rows read from the live workbook. Contamination included on purpose —
    // a test against tidied-up headers would prove nothing about the sheet we actually read.
    var FR1 = ['', 'Client Type', 'If you have a resume, please upload it below so we can assess your qualification',
      'Timestamp', 'Email Address', 'Phone number 0422649333', 'Referred by Friend',
      'Educational Background', 'Work Experience CHEF 2 yr',
      "Please specify below if you currently hold a visa and it's expiry Subclass 407 Bridging",
      'Inquiring for', 'Please specify your inquiry', 'NOTES', 'ASSIGNED TO CONSULTANT', 'STATUS', 'Remarks'];
    var FR2 = ['Timestamp', 'Email Address', '0451082350', 'Column 3', 'Client Type',
      'Referred by Friend', 'Educational Background', '6 years support worker',
      'Please indicate below if you currently hold a visa and its expiration date.',
      'Inquiring for', 'I am enquiring about course shifting',
      'If you have a resume, please upload it below so we can assess your qualification',
      'Full Name', 'Phone Number', 'Best Type of Contact:', 'Current Address', 'Column 12'];

    var r1 = c1ResolveHeaders_(FR1), r2 = c1ResolveHeaders_(FR2);

    // 🔴 The contamination is an ANSWER appended to a real label. Prefix matching recovers it.
    check('"Phone number 0422649333" still resolves to PHONE', r1.fields.PHONE === 5, String(r1.fields.PHONE));
    check('"Work Experience CHEF 2 yr" still resolves to WORK', r1.fields.WORK === 8, String(r1.fields.WORK));
    check('"Referred by Friend" still resolves to REFERRED', r1.fields.REFERRED === 6, String(r1.fields.REFERRED));

    // 🔴 Form Responses 1 has the client's NAME in an UNHEADED column A.
    check('name falls back to column A when there is no heading', r1.fields.NAME === 0, String(r1.fields.NAME));
    check('...and the fallback is REPORTED, never silent', r1.notes.length === 1, r1.notes.join(''));
    check('a real "Full Name" heading wins over the fallback', r2.fields.NAME === 12, String(r2.fields.NAME));

    // 🔴 A bare phone number as a heading must not be mistaken for the phone COLUMN.
    check('a heading that IS a phone number does not capture PHONE', r2.fields.PHONE === 13, String(r2.fields.PHONE));
    check('"Column 3" resolves to nothing', Object.keys(r2.fields).every(function (k) { return r2.fields[k] !== 3; }));

    // ⛔ Nothing is dropped. An unrecognised column is data, not silence.
    check('unrecognised columns are reported, not discarded', r2.unmapped.length > 0, String(r2.unmapped.length));

    var row1 = new Array(FR1.length).fill('');
    row1[0] = 'A. DELA CRUZ'; row1[3] = '2026-08-01'; row1[4] = 'a@example.com';
    row1[5] = '0400111222'; row1[8] = 'Chef 4 yrs'; row1[10] = 'Graduate Visa'; row1[15] = 'call after 5';
    var e1 = c1RowToEnquiry_(row1, r1, null);
    check('a real FR1 row produces a name', H(e1, 'Name') === 'A. DELA CRUZ', H(e1, 'Name'));
    check('...a phone', H(e1, 'Phone') === '0400111222');
    check('...and their visa wording verbatim', H(e1, 'Visa Interest') === 'Graduate Visa');
    check('work experience goes to Notes, not a new column', H(e1, 'Notes').indexOf('Chef 4 yrs') > -1);
    check('an UNMAPPED column still reaches Notes with its heading',
          H(e1, 'Notes').indexOf('Remarks: call after 5') > -1, H(e1, 'Notes'));

    var row2 = new Array(FR2.length).fill('');
    row2[12] = 'B. SANTOS'; row2[13] = '0422000111'; row2[15] = '12 George St, Brisbane';
    var e2 = c1RowToEnquiry_(row2, r2, null);
    check('FR2 name comes from the real heading', H(e2, 'Name') === 'B. SANTOS');
    // 🔴 Their form asks for an ADDRESS. ENQUIRIES Location is a LOCKED Onshore/Offshore
    // dropdown. Inferring one from the other is a guess about where a person is.
    check('🔴 an address does NOT get written into the locked Location column',
          H(e2, 'Location') === '', H(e2, 'Location'));
    check('...it is preserved in Notes instead', H(e2, 'Notes').indexOf('12 George St') > -1);
    check('Channel stays blank on the sheet path too (D-330)', H(e2, 'Channel') === '');
    check('every produced row is the right width', e1.length === C1_HEADERS.length && e2.length === C1_HEADERS.length);
  }

  Logger.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
  if (fail) throw new Error('C-1 self-test FAILED: ' + fail);
  return pass + '/' + (pass + fail);
}
