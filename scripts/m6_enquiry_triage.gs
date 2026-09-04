/**
 * M6 — ENQUIRY TRIAGE: the decision layer.        (spec: docs/M6-AUTOREPLY-SPEC.md)
 *
 * ============================ WHAT THIS IS, AND IS NOT ============================
 * M6 has four steps. Two of them need Meta access we do not have:
 *
 *   1. instant acknowledgement on WhatsApp/Messenger   ← needs Meta (I-3, I-4)
 *   2. qualifying questions in-channel                 ← needs Meta
 *   3. DECIDE what to do with the message, and log it  ← THIS FILE
 *   4. follow-up cadence                               ← already M8, done
 *
 * 🔑 The channel is plumbing. **The decision is the module.** Whether a message may be
 * auto-answered at all, what subclass it is about, who should own it — none of that
 * depends on whether it arrived by WhatsApp, Messenger or a paste into a cell. So it is
 * built and tested now, and the transport is wired when the access exists.
 *
 * ⛔ NOTHING HERE SENDS ANYTHING. It returns a decision. A human or a later module acts.
 *
 * ======================== 🔴 THE PART THAT MUST NOT BE WRONG ========================
 * Only a Registered Migration Agent may give migration advice (D-06). An auto-reply that
 * engages with a refusal, a tribunal matter or a cancellation is an unregistered person
 * advising on a visa **under Yale's name and Robinder's MARN**.
 *
 * The block list is not our invention — it is their own staff behaviour made explicit.
 * From four real WhatsApp conversations (M6 spec, 29 Jul): every substantive question
 * about a refusal or ART went **deliberately unanswered**. Staff already refuse these.
 * ⛔ **The automation enforces the existing behaviour. It must never invent a new one.**
 *
 * 🔑 The failure that matters is ASYMMETRIC, so the design is asymmetric too:
 *   · blocking a harmless message  → a human replies a bit later. Cost: minutes.
 *   · answering a blocked one      → unregistered migration advice under an RMA's name.
 * So every uncertainty resolves to BLOCK. `m6Triage_` blocks on a bare "refused" with no
 * context, and that is correct behaviour, not over-matching.
 *
 * ========================= WHY AUTO-ASSIGN IS DELIBERATELY TIMID =========================
 * The spec says "auto-assign per the roster matrix". It does — but it will return
 * `Unassigned` rather than a name it is not sure of, because:
 *   · ENQUIRIES `Assigned To` is a LOCKED dropdown; a name off the list is REFUSED silently (D-353)
 *   · the roster changed THREE times in two weeks — Mershe left, Gopi joined and left (D-355)
 *   · nothing in an inbound message reveals which TEAM the enquirer belongs to. Inferring
 *     "Filipino" from Taglish is a guess about a person, and one of the four real enquirers
 *     had a Swedish phone number.
 * A lead sitting on `Unassigned` is visible on the board. A lead assigned to the wrong
 * consultant looks handled and is not.
 *
 * Run `runM6SelfTest()` — no sheet, no network, no channel.
 */

var M6_TAB = 'ENQUIRIES';

// ⛔ THEIR behaviour, transcribed — not a policy we designed. Every one of these appears
// in the spec's trigger list, which was derived from what staff already refuse to answer.
// Stems, so "refused"/"refusal"/"cancelled"/"cancellation"/"overstayed" all match.
var M6_BLOCK_PATTERNS = [
  { re: /\brefus/i,                 why: 'a refusal' },
  { re: /\bart\b|\baat\b|tribunal/i, why: 'a tribunal or review matter' },
  { re: /\bcancel/i,                why: 'a visa cancellation' },
  { re: /\bs\s?501\b|character test/i, why: 'a character / s501 matter' },
  { re: /\bappeal/i,                why: 'an appeal' },
  { re: /\breview\b/i,              why: 'a review' },
  { re: /\boverstay/i,              why: 'an overstay' },
  { re: /\bbridging\b/i,            why: 'a bridging visa situation' },
  { re: /\bdeport|\bremoval notice/i, why: 'a removal matter' },
  { re: /\bban\b|exclusion period|\bpic\s?4020\b/i, why: 'an exclusion or PIC 4020 matter' }
];

// Their form and their SOPs use these. Digits win over words when both appear.
var M6_SUBCLASS_WORDS = [
  { re: /\b(?:subclass\s*)?500\b|student visa/i,          code: '500' },
  { re: /\b(?:subclass\s*)?485\b|graduate visa|post[- ]study/i, code: '485' },
  { re: /\b(?:subclass\s*)?482\b|skills in demand|tss\b/i, code: '482' },
  { re: /\b(?:subclass\s*)?18[67]\b|employer nomination|\bens\b/i, code: '186' },
  { re: /\b(?:subclass\s*)?189\b|skilled independent/i,    code: '189' },
  { re: /\b(?:subclass\s*)?190\b|state nomination|nominated/i, code: '190' },
  { re: /\b(?:subclass\s*)?491\b|regional/i,               code: '491' },
  { re: /\b(?:subclass\s*)?600\b|tourist|visitor visa/i,   code: '600' },
  { re: /\b(?:subclass\s*)?(?:820|801|309|100)\b|partner visa|spouse/i, code: '820/801' },
  { re: /\b(?:subclass\s*)?407\b|training visa/i,          code: '407' },
  { re: /\b(?:subclass\s*)?417\b|working holiday/i,        code: '417' },
  { re: /citizenship/i,                                    code: 'Citizenship' }
];

// ENQUIRIES G is a LOCKED dropdown: Onshore / Offshore. Nothing else may be written.
var M6_ONSHORE  = /\bin australia\b|\bonshore\b|currently in (?:aus|australia)|here in australia/i;
var M6_OFFSHORE = /\boffshore\b|\boverseas\b|outside australia|in (?:the )?philippines|in india|back home/i;

/**
 * The roster matrix — team × visa line × office. DATA, not logic, so a staff change is a
 * one-line edit here rather than a code change.
 * ⚠️ Must stay a subset of MASTER/ENQUIRIES `Assigned To`. Anything not on that dropdown
 * is refused by the cell without an error (D-353), which looks like the write "worked".
 * ⛔ Gopi is deliberately absent — she left on 22 Aug, four days after joining (D-355).
 */
/* 🔴 POOJA AND ANMOL ARE DELIBERATELY NOT ROUTED HERE YET. (D-426, 31 Aug 2026)
 *
 * RJ gave both as new hires: **Pooja — Indian, Brisbane, "485 dependent"** and
 * **Anmol — Indian, Brisbane, "PR"**. Both are now in all four locked dropdowns
 * so they CAN be assigned by hand. Neither is in this routing table, because
 * both overlap someone already here and this function returns exactly ONE name:
 *
 *   · "485 dependent" collides with **Fiza**, who already takes 485
 *   · "PR" collides with **Inder**, who already takes 189/190/491/482/494/186
 *
 * ⛔ Adding either would silently steal a line from the incumbent — first match
 * in this array wins, with no error and no log. And "485 dependent" cannot be
 * expressed here at all: routing keys on subclass, and has no concept of
 * dependent-vs-primary.
 *
 * 🔑 Two questions must be answered before either is added, and they are RJ's or
 * Robinder's, not ours to infer:
 *   1. Does Pooja take 485 dependents INSTEAD of Fiza, or alongside her?
 *   2. Does Anmol take PR INSTEAD of Inder, or alongside?
 * "Alongside" needs a rule for splitting — round-robin, by workload, by office —
 * which is a decision about their business, not a defect in this table.
 */
var M6_ROSTER = [
  { office: 'TOWNSVILLE', team: null,       visas: null,                                   who: 'Cristelle' },
  { office: null,         team: 'FILIPINO', visas: ['500','485','820/801'],                who: 'Star' },
  { office: null,         team: 'FILIPINO', visas: ['189','190','491','482','494','186'],  who: 'RJ' },
  { office: null,         team: 'INDIAN',   visas: ['500'],                                who: 'Gayatri' },
  { office: null,         team: 'INDIAN',   visas: ['820/801','485','600'],                who: 'Fiza' },
  /* 🔴 INDER HAS LEFT — RJ, 4 Sep: "Inder sir has left the office for good."  (D-439)
   *
   * His route is REMOVED so no NEW enquiry is assigned to someone who is gone.
   * ⛔ But he is deliberately KEPT in the locked dropdowns, and that distinction
   * matters: **8 of the 38 importing clients still carry his name**, and a
   * dropdown that no longer offers "Inder" would REFUSE those rows in silence
   * at paste time — the D-353 bug, caused by tidying up.
   *
   *   dropdown  = who may appear on a record   → must include leavers
   *   routing   = who receives NEW work        → must exclude them
   *
   * These are different questions and this file previously answered both with
   * one list.
   *
   * ⚠️ CONSEQUENCE, STATED NOT HIDDEN: Indian-team 189/190/491/482/494/186
   * enquiries now match no rule and fall through to `Unassigned`. That is the
   * honest outcome — a visible gap beats silently handing a PR enquiry to
   * someone who left — but it is a real hole until Robinder names a successor.
   *
   * 🔑 Anmol is "Indian, Brisbane, PR" (RJ, 31 Aug — D-426) — which is EXACTLY this
   * line. He is very likely Inder's replacement, and what looked like a
   * collision in D-409 may have been a handover. ⛔ NOT assumed. Asked.
   */
];

var M6_REPLY_ACK =
  'Hi! Thank you for reaching out to Yale Migration. One of our consultants will get in touch ' +
  'with you shortly. To help us prepare, could you please answer a few quick questions?';

var M6_REPLY_QUESTIONS = [
  'Your full name?',
  'Which visa are you asking about? (e.g. Student 500, Graduate 485, Partner, Work 482, ' +
    'Tourist 600 — or just describe your situation)',
  'Are you currently in Australia, or overseas?',
  'If you hold a visa now — what type, and when does it expire?'
];

// ⛔ VERBATIM from the spec. Do not "improve" it: it deliberately promises nothing, quotes
// nothing, and commits to no timeframe beyond what their own staff already say.
var M6_REPLY_BLOCKED =
  'Thank you for reaching out. Your situation needs review by one of our Registered ' +
  'Migration Agents — they will contact you directly.';

/**
 * Triage one inbound enquiry message.
 * @return {Object} decision — nothing is sent, nothing is written.
 */
function m6Triage_(text, opts) {
  opts = opts || {};
  var t = String(text == null ? '' : text);

  var blocked = null;
  for (var i = 0; i < M6_BLOCK_PATTERNS.length; i++) {
    if (M6_BLOCK_PATTERNS[i].re.test(t)) { blocked = M6_BLOCK_PATTERNS[i].why; break; }
  }

  // 🔴 A visa expiring inside 30 days is urgent AND legally delicate — the wrong holding
  // reply can cost someone their status. It blocks even when no trigger word appears.
  var days = m6DaysToExpiry_(t, opts.today);
  if (blocked === null && days !== null && days <= 30) {
    blocked = 'a visa expiring in ' + days + ' day(s)';
  }

  var subclass = '';
  for (var j = 0; j < M6_SUBCLASS_WORDS.length; j++) {
    if (M6_SUBCLASS_WORDS[j].re.test(t)) { subclass = M6_SUBCLASS_WORDS[j].code; break; }
  }

  var location = '';
  if (M6_OFFSHORE.test(t)) location = 'Offshore';
  else if (M6_ONSHORE.test(t)) location = 'Onshore';

  return {
    blocked:      blocked !== null,
    blockReason:  blocked,
    // ⛔ A blocked message gets the holding reply and NOTHING else — no questions, because
    // qualifying questions read as engaging with the substance.
    reply:        blocked !== null ? M6_REPLY_BLOCKED : M6_REPLY_ACK,
    questions:    blocked !== null ? [] : M6_REPLY_QUESTIONS.slice(),
    subclass:     subclass,
    location:     location,
    daysToExpiry: days,
    // Every blocked message needs a human. So does anything we could not read.
    needsHuman:   blocked !== null || (!subclass && !location)
  };
}

/** Days until a date mentioned in free text, or null. Conservative by design. */
function m6DaysToExpiry_(text, today) {
  var t = String(text || '');
  var m = t.match(/expir\w*[^.\n]{0,40}?(\d{1,2})[\/\- ](\d{1,2})[\/\- ](\d{2,4})/i);
  if (!m) return null;
  var d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
  if (y < 100) y += 2000;
  // ⚠️ Their own data had 47% of dates day/month transposed by Excel's US locale (D-327).
  // So a value over 12 in the SECOND position means the pair is the other way round.
  if (mo > 12 && d <= 12) { var s = d; d = mo; mo = s; }
  if (mo > 12 || d > 31) return null;
  var when = new Date(y, mo - 1, d), now = today ? new Date(today) : new Date();
  if (isNaN(when.getTime())) return null;
  return Math.round((when - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}

/**
 * Who should own this lead? Returns 'Unassigned' unless the match is unambiguous.
 * ⛔ Unassigned is a RESULT, not a failure. A lead on the wrong consultant looks handled.
 */
function m6AssignTo_(office, team, subclass) {
  var o = String(office || '').toUpperCase(), tm = String(team || '').toUpperCase();
  for (var i = 0; i < M6_ROSTER.length; i++) {
    var r = M6_ROSTER[i];
    if (r.office && r.office !== o) continue;
    if (r.team && r.team !== tm) continue;
    if (r.visas && (!subclass || r.visas.indexOf(subclass) === -1)) continue;
    if (!r.office && !tm) continue;   // no team means no confident routing
    return r.who;
  }
  return 'Unassigned';
}

/** Triage + shape into an ENQUIRIES row. Still writes nothing. */
function m6ToEnquiryRow_(msg, meta, today) {
  meta = meta || {};
  var d = m6Triage_(msg, { today: today });
  var notes = [];
  if (d.blocked) notes.push('⛔ HOLD — ' + d.blockReason + '. RMA only; no advice given.');
  if (d.daysToExpiry !== null) notes.push('visa expiry in ' + d.daysToExpiry + ' day(s) per the message');
  if (msg) notes.push('Enquiry: ' + String(msg).replace(/\s+/g, ' ').slice(0, 300));

  return {
    row: [
      meta.date || '', meta.name || '', meta.phone || '', meta.email || '',
      // Channel is passed in by whatever caught the message. ⛔ Never inferred — D-330.
      meta.channel || '',
      d.subclass, d.location,
      m6AssignTo_(meta.office, meta.team, d.subclass),
      '',   // Status — the consultant's judgement, never ours (SOP-CI-001 10B)
      '',   // Follow-up Due — M8 owns the whole cadence, exclusively
      notes.join(' | ')
    ],
    decision: d
  };
}

// ══════════════════════════════════════════════════════════════════════════════
function runM6SelfTest() {
  var pass = 0, fail = 0;
  var check = function (l, ok, d) {
    Logger.log((ok ? '  PASS  ' : '  FAIL  ') + l + (d ? '   — ' + d : ''));
    ok ? pass++ : fail++;
  };
  var TODAY = new Date('2026-08-23T00:00:00');
  var T = function (s) { return m6Triage_(s, { today: TODAY }); };

  Logger.log('=== 🔴 HARD BLOCK — every one of these is migration advice if answered ===');
  [['She got refusal on tourist visa', 'refusal'],
   ['What are the new ART process changes?', 'ART'],
   ['my case is at the AAT', 'AAT'],
   ['they cancelled my student visa', 'cancellation'],
   ['I want to appeal the decision', 'appeal'],
   ['can I apply for review', 'review'],
   ['I have overstayed my visa', 'overstay'],
   ['I am on a bridging visa now', 'bridging'],
   ['got a s501 character issue', 's501'],
   ['I received a removal notice', 'removal']
  ].forEach(function (p) {
    check('blocks: "' + p[1] + '"', T(p[0]).blocked === true, T(p[0]).blockReason);
  });
  // 🔑 These three are the real conversations from their own screenshots that staff left
  // unanswered. If the automation would answer one, it is doing what a human refused to.
  check('🔴 all three REAL unanswered enquiries are blocked',
        T('She got refusal on tourist').blocked && T('new ART process changes').blocked &&
        !T('What is the process for Subclass 417 Visa?').blocked,
        'the 417 one is a plain question and correctly NOT blocked');

  Logger.log('\n=== a blocked message gets the holding reply and NOTHING else ===');
  var b = T('my visa was refused last month');
  check('holding reply is the verbatim approved one', b.reply === M6_REPLY_BLOCKED);
  check('🔴 NO qualifying questions are asked', b.questions.length === 0);
  check('...and it is flagged for a human', b.needsHuman === true);
  check('the reply promises nothing and quotes nothing',
        !/\$|fee|cost|day|week|guarantee/i.test(b.reply), b.reply);

  Logger.log('\n=== a normal enquiry gets the acknowledgement + 4 questions ===');
  var n = T('Hi, I want to apply for a student visa 500, I am in Australia');
  check('not blocked', n.blocked === false);
  check('subclass read from free text', n.subclass === '500', n.subclass);
  check('location read from free text', n.location === 'Onshore', n.location);
  check('exactly 4 questions, per the spec', n.questions.length === 4);
  check('the ack never invents an SLA', !/\d+\s*(hour|day|business)/i.test(n.reply));

  Logger.log('\n=== free-text extraction ===');
  check('485 from "graduate visa"', T('asking about graduate visa').subclass === '485');
  check('820/801 from "partner visa"', T('partner visa for my wife').subclass === '820/801');
  check('600 from "tourist"', T('tourist visa for my mother').subclass === '600');
  check('offshore from "overseas"', T('I am overseas right now').location === 'Offshore');
  check('offshore from "in the Philippines"', T('currently in the Philippines').location === 'Offshore');
  check('unreadable message extracts nothing and flags a human',
        T('hi').subclass === '' && T('hi').needsHuman === true);

  Logger.log('\n=== 🔴 visa expiring inside 30 days blocks even with no trigger word ===');
  var soon = T('my student visa expires 10/09/2026, what should I do');
  check('expiry parsed', soon.daysToExpiry !== null, String(soon.daysToExpiry));
  check('🔴 blocked on urgency alone', soon.blocked === true, soon.blockReason);
  var far = T('my visa expires 10/06/2027 and I want to plan ahead');
  check('a distant expiry does NOT block', far.blocked === false, String(far.daysToExpiry));
  // Their own data had 47% of dates transposed by Excel's US locale (D-327).
  check('a transposed date (13/09) is still read, not discarded',
        T('expires 09/13/2026').daysToExpiry !== null);

  Logger.log('\n=== routing — Unassigned is a RESULT, not a failure ===');
  check('Townsville goes to Cristelle regardless of visa',
        m6AssignTo_('TOWNSVILLE', 'INDIAN', '500') === 'Cristelle');
  check('Filipino + 485 -> Star', m6AssignTo_('BRISBANE', 'FILIPINO', '485') === 'Star');
  check('Filipino + 482 -> RJ', m6AssignTo_('BRISBANE', 'FILIPINO', '482') === 'RJ');
  check('Indian + 500 -> Gayatri', m6AssignTo_('BRISBANE', 'INDIAN', '500') === 'Gayatri');
  check('🔴 no team known -> Unassigned, never a guess',
        m6AssignTo_('BRISBANE', '', '500') === 'Unassigned');
  check('🔴 no subclass known -> Unassigned', m6AssignTo_('BRISBANE', 'INDIAN', '') === 'Unassigned');
  // ⛔ She left on 22 Aug. The dropdown would refuse her name silently (D-353, D-355).
  check('🔴 Gopi is in no routing path', JSON.stringify(M6_ROSTER).indexOf('Gopi') === -1);

  Logger.log('\n=== the ENQUIRIES row ===');
  var r = m6ToEnquiryRow_('I need help with my 482 visa, I am in Australia',
                          { date: '2026-08-23', name: 'A. Cruz', phone: '+61400111222',
                            channel: 'WhatsApp', office: 'BRISBANE', team: 'FILIPINO' }, TODAY);
  check('row is 11 wide, matching ENQUIRIES', r.row.length === 11, String(r.row.length));
  check('visa interest filled', r.row[5] === '482');
  check('location filled', r.row[6] === 'Onshore');
  check('assigned to RJ', r.row[7] === 'RJ', r.row[7]);
  check('🔴 Status left blank — the consultant decides', r.row[8] === '');
  check('🔴 Follow-up Due left blank — M8 owns the cadence', r.row[9] === '');
  check('🔴 Channel is what the caller passed in, never inferred', r.row[4] === 'WhatsApp');
  var rb = m6ToEnquiryRow_('my visa was cancelled', { channel: 'Facebook' }, TODAY);
  check('a blocked lead is marked HOLD in Notes', rb.row[10].indexOf('⛔ HOLD') === 0, rb.row[10]);
  check('...and is still logged, not dropped', rb.row.length === 11);

  Logger.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
  if (fail) throw new Error('M6 self-test FAILED: ' + fail);
  return pass + '/' + (pass + fail);
}
