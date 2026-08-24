/**
 * Tests for the pure derivations.  node --experimental-strip-types lib/data/derive.test.mjs
 * (or: npx tsc then run against the emitted JS — see the npm script)
 *
 * 🔑 These decide what a consultant acts on: which files count as gone quiet,
 * whether a visa has expired, the grant rate the director reads, and which
 * rungs of the follow-up ladder still apply. Until derive.ts was split out
 * they could not be tested without mocking a database, so none of them were.
 */
import { daysBetween, daysUntil, isOpen, goingQuiet, expiringSoon, isLiveLead,
         recentEnquiries, outcomes, ladderFor, LADDER,
         dueWithin, isActive, isAwaiting } from './derive.ts'

let pass = 0, fail = 0
const check = (l, ok, d) => { console.log((ok ? '  PASS  ' : '  FAIL  ') + l + (d ? `   — ${d}` : ''))
  ok ? pass++ : fail++ }
const T = new Date('2026-08-21T09:00:00')
const m = (o = {}) => ({ client_code:'X', full_name:'X', office:'BRISBANE', team:null,
  consultant:null, visa_type:null, processing_stage:null, visa_outcome:'Pending',
  visa_expiry:null, last_contact:null, next_due:null, docs_outstanding:null, ...o })

console.log('=== dates ===')
check('null in, null out', daysBetween(null, T) === null)
check('garbage date does not become 0', daysBetween('not-a-date', T) === null, String(daysBetween('not-a-date', T)))
check('7 days ago is 7', daysBetween('2026-08-14', T) === 7)
check('today is 0', daysBetween('2026-08-21', T) === 0)
check('a FUTURE date is negative, not clamped', daysBetween('2026-08-28', T) === -7)

console.log('\n=== open vs decided ===')
for (const [o, want] of [['Pending',true],['Granted',false],['Refused',false],['Withdrawn',false],[null,true]])
  check(`${o ?? 'null'} → ${want ? 'open' : 'closed'}`, isOpen(m({ visa_outcome:o })) === want)

console.log('\n=== going quiet ===')
{
  const rows = [m({ client_code:'A', last_contact:'2026-07-19' }),   // 33d
                m({ client_code:'B', last_contact:'2026-08-14' }),   //  7d
                m({ client_code:'C', last_contact:null }),           // never
                m({ client_code:'D', last_contact:'2026-07-01', visa_outcome:'Granted' })]
  const q = goingQuiet(rows, T)
  check('only the genuinely quiet one', q.length === 1 && q[0].m.client_code === 'A', `${q.length} rows`)
  check('🔴 a GRANTED file is never chased', !q.some((x) => x.m.client_code === 'D'))
  // A null last_contact means "we have no record", not "contacted today". It is
  // excluded here on purpose — M5a owns the never-contacted case via its own
  // import baseline, and double-counting it would chase the same file twice.
  check('a NULL last contact is not silently treated as 0 days', !q.some((x) => x.m.client_code === 'C'))
  check('sorted oldest first', goingQuiet([m({client_code:'A',last_contact:'2026-08-01'}),
    m({client_code:'B',last_contact:'2026-07-01'})], T)[0].m.client_code === 'B')
}

console.log('\n=== expiring ===')
{
  const rows = [m({ client_code:'E', visa_expiry:'2026-08-18' }),   // expired 3d ago
                m({ client_code:'F', visa_expiry:'2026-09-01' }),   // 11d
                m({ client_code:'G', visa_expiry:'2027-06-01' })]   // far away
  const x = expiringSoon(rows, T)
  check('an EXPIRED visa is still listed', x.some((r) => r.m.client_code === 'E'))
  check('...with a negative day count, not zero', x.find((r) => r.m.client_code === 'E').left === -3)
  check('expired sorts FIRST — most urgent', x[0].m.client_code === 'E')
  check('a far-off expiry is excluded', !x.some((r) => r.m.client_code === 'G'))
}

console.log('\n=== outcomes ===')
{
  const none = outcomes([m(), m()])
  check('🔴 nothing decided → rate is NULL, never 0', none.rate === null, String(none.rate))
  check('...and decided is 0', none.decided === 0)
  const mixed = outcomes([m({visa_outcome:'Granted'}), m({visa_outcome:'Granted'}),
                          m({visa_outcome:'Refused'}), m({visa_outcome:'Pending'})])
  check('Pending excluded from the denominator', mixed.decided === 3, String(mixed.decided))
  check('2 of 3 granted → 67%', mixed.rate === 67, String(mixed.rate))
  check('rows sorted by count', mixed.rows[0][0] === 'Granted')
}

console.log('\n=== enquiries ===')
{
  const e = (o) => ({ id:1, enquiry_date:null, name:null, phone:null, email:null, channel:null,
    visa_interest:null, office:null, assigned_to:null, status:null, follow_up_due:null,
    last_contact:null, ...o })
  check('Not Proceeding is not live', !isLiveLead(e({ status:'Not Proceeding' })))
  check('Converted is not live', !isLiveLead(e({ status:'Converted' })))
  check('a null status IS live — unset is not closed', isLiveLead(e({ status:null })))
  const r = recentEnquiries([e({enquiry_date:'2026-08-20'}), e({enquiry_date:'2026-08-01'}),
                             e({enquiry_date:'2026-08-25'})], T)
  check('last 7 days only', r.length === 1, `${r.length}`)
  check('🔴 a FUTURE-dated enquiry is excluded, not counted as today',
        !r.some((x) => x.enquiry_date === '2026-08-25'))
}

console.log('\n=== the s56 ladder — the compression rule ===')
{
  const d = (allowed, letter) => ladderFor({ letter_date: letter, days_allowed: allowed }, T)
  check('28-day letter keeps all four rungs',
        JSON.stringify(d(28,'2026-08-14').rungs) === JSON.stringify([7,14,21,26]))
  // 🔴 The whole point. Rungs past the deadline would tell a consultant to chase
  // AFTER the Department had already decided the application.
  /* ⚠️ CONTRACT CHANGED 24 Aug (D-400). The ladder used to be the four standard
   * rungs minus any that fell past the deadline, with "the internal deadline"
   * hardcoded as day 26. That is only true of a 28-day letter:
   *   · on a 60-day letter it labelled day 26 the internal deadline — 43% of
   *     the track — and left the real one (day 58) unmarked entirely;
   *   · on a 14-day letter it drew ONE rung at day 7 and no internal deadline,
   *     so the date the team actually works to was missing from the ladder
   *     built to show it.
   * The internal deadline is `allowed - 2` (their SOP, D-58) and is now ALWAYS
   * a rung. These two assertions changed because the behaviour is different and
   * better, not because they were wrong before. */
  check('14-day letter: rungs past the internal deadline are dropped, and day 12 is added',
        JSON.stringify(d(14,'2026-08-14').rungs) === JSON.stringify([7,12]),
        JSON.stringify(d(14,'2026-08-14').rungs))
  check('...and reports how many standard rungs it dropped', d(14,'2026-08-14').dropped === 3)
  check('🔴 a 7-day letter still gets its internal deadline — day 5, not an empty rail',
        JSON.stringify(d(7,'2026-08-18').rungs) === JSON.stringify([5]),
        JSON.stringify(d(7,'2026-08-18').rungs))
  check('...and says all four standard rungs were dropped', d(7,'2026-08-18').dropped === 4)
  check('🔴 a 60-day letter marks day 58, not day 26, as the internal deadline',
        d(60,'2026-08-14').internal === 58, String(d(60,'2026-08-14').internal))
  check('...and keeps the standard rungs before it',
        JSON.stringify(d(60,'2026-08-14').rungs) === JSON.stringify([7,14,21,26,58]),
        JSON.stringify(d(60,'2026-08-14').rungs))
  check('a 28-day letter reports NOTHING dropped — day 26 IS the internal deadline',
        d(28,'2026-08-14').dropped === 0, String(d(28,'2026-08-14').dropped))
  check('🔴 days_allowed of 0 is malformed, not a crisis — not placeable',
        d(0,'2026-08-14').placeable === false)
  check('🔴 a NEGATIVE days_allowed never renders "−5 days only"',
        d(-5,'2026-08-14').placeable === false)
  check('no letter date → not placeable, not silently zero', d(28,null).placeable === false)
  check('no day count → not placeable', ladderFor({letter_date:'2026-08-14',days_allowed:null},T).placeable === false)
  check('progress never exceeds 100%', d(7,'2026-06-01').pct === 100, String(d(7,'2026-06-01').pct))
  check('progress never goes negative for a future letter', d(28,'2026-09-01').pct === 0)
}

console.log('\n=== the chase list — the half that was built backwards ===')
{
  const rows = [m({ client_code:'A', next_due:'2026-08-24' }),   // in 3
                m({ client_code:'B', next_due:'2026-08-18' }),   // 3 overdue
                m({ client_code:'C', next_due:'2026-09-30' }),   // far out
                m({ client_code:'D', next_due:null }),
                m({ client_code:'E', next_due:'2026-08-22', visa_outcome:'Granted' })]
  const d = dueWithin(rows, T)
  check('only what falls due inside the fortnight', d.length === 2, `${d.length}`)
  // 🔴 The point of the whole card. `goingQuiet` looks BACKWARD at what has
  // already been neglected; he asked for what is ABOUT to be.
  check('🔴 overdue sorts FIRST, not filtered out',
        d[0].m.client_code === 'B' && d[0].inDays === -3, JSON.stringify(d[0]?.inDays))
  check('a granted file is never chased', !d.some((x) => x.m.client_code === 'E'))
  check('a file with no due date is not silently treated as due', !d.some((x) => x.m.client_code === 'D'))
  check('nothing due → empty, not a thrown error', dueWithin([m()], T).length === 0)
}

console.log('\n=== active vs awaiting — views 1 and 2 were one number ===')
{
  const rows = [m({ processing_stage:'Docs Collection' }),
                m({ processing_stage:'Lodged' }),
                m({ processing_stage:'Awaiting Outcome' }),
                m({ processing_stage:'Lodged', visa_outcome:'Granted' })]
  check('active = being worked, Department cases excluded', rows.filter(isActive).length === 1)
  check('awaiting = lodged + awaiting outcome', rows.filter(isAwaiting).length === 2)
  // 🔴 If a matter fell into both or neither the two tiles would not reconcile
  // against the open count, and he would be the one to notice.
  check('🔴 every open matter is in exactly one of the two',
        rows.filter(isOpen).every((r) => isActive(r) !== isAwaiting(r)))
  check('a null stage counts as active, not lost', isActive(m({ processing_stage:null })))
}

/* ══════════════════════════════════════════════════════════════════════════
 * 🔴 THE TWO DEFECTS THIS SUITE MISSED. Added 24 Aug 2026 (D-395).
 *
 * Both were found by audit, not by these tests — and both are the kind that
 * produce a confident wrong number rather than an error. Every assertion below
 * FAILS against the code as it stood before the fix.
 * ══════════════════════════════════════════════════════════════════════════ */
{
  const T = new Date('2026-08-24T00:00:00')
  const M = (o) => ({ client_code:'X', full_name:'X', office:'BRISBANE', team:null,
    consultant:null, visa_type:null, processing_stage:null, visa_outcome:null,
    visa_expiry:null, last_contact:null, next_due:null, docs_outstanding:null, ...o })

  console.log('\n=== an unparseable date must stay UNKNOWN, never "0 days" ===')
  check('daysUntil(garbage) is null', daysUntil('31/12/2026', T) === null,
        String(daysUntil('31/12/2026', T)))
  check('daysUntil(null) is null', daysUntil(null, T) === null)
  check('daysUntil still works on a real date', daysUntil('2026-08-30', T) === 6,
        String(daysUntil('2026-08-30', T)))
  // ⛔ The old code was `-(daysBetween(x,T) ?? 0)`, which is -0 — and -0 passes
  // every guard: `-0 <= 60` true, `-0 < 0` false, `${-0}` prints "0".
  check('-0 would have slipped through the old guard (why this matters)',
        (-0 <= 60) && !(-0 < 0) && `${-0}` === '0')
  const bad = expiringSoon([M({ visa_expiry:'31/12/2026' })], T)
  check('🔴 a malformed expiry is EXCLUDED, not shown as "0 days"', bad.length === 0,
        JSON.stringify(bad.map((x) => x.left)))
  const good = expiringSoon([M({ visa_expiry:'2026-09-10' })], T)
  check('a real expiry is still included', good.length === 1 && good[0].left === 17,
        JSON.stringify(good.map((x) => x.left)))
  const dueBad = dueWithin([M({ next_due:'31/12/2026' })], T)
  check('🔴 a malformed follow-up date is EXCLUDED, not shown as "Today"',
        dueBad.length === 0, JSON.stringify(dueBad.map((x) => x.inDays)))

  console.log('\n=== outcomes are compared case- and whitespace-insensitively ===')
  const lower = outcomes([M({ visa_outcome:'granted' }), M({ visa_outcome:'granted' }),
                          M({ visa_outcome:'Refused' })])
  check('🔴 lowercase "granted" counts as granted — rate is 67, not 0',
        lower.rate === 67, `rate=${lower.rate} granted=${lower.granted}`)
  check('and it does NOT become a separate outcome row', lower.rows.length === 2,
        JSON.stringify(lower.rows))
  const spaced = outcomes([M({ visa_outcome:'Granted ' }), M({ visa_outcome:' Refused' })])
  check('trailing/leading space does not split a row', spaced.rows.length === 2 && spaced.rate === 50,
        `${JSON.stringify(spaced.rows)} rate=${spaced.rate}`)
  check('rows are displayed with a tidy capital', lower.rows.every(([k]) => /^[A-Z]/.test(k)),
        JSON.stringify(lower.rows))
  check('⛔ still null, never 0, when nothing is decided', outcomes([M({})]).rate === null)
  check('"pending" in any casing is still not a result',
        outcomes([M({ visa_outcome:'pending' })]).decided === 0)

  console.log('\n=== a granted matter is CLOSED whatever the casing ===')
  check('🔴 isOpen("granted") is false — it was true, so it was chased forever',
        isOpen(M({ visa_outcome:'granted' })) === false)
  check('isOpen("WITHDRAWN") is false', isOpen(M({ visa_outcome:'WITHDRAWN' })) === false)
  check('isOpen("Lodged") is true — a stage is not an outcome',
        isOpen(M({ visa_outcome:null, processing_stage:'Lodged' })) === true)
  check('a lowercase-granted file is not chased by goingQuiet',
        goingQuiet([M({ visa_outcome:'granted', last_contact:'2026-01-01' })], T).length === 0)
  check('🔴 isLiveLead("converted") is false',
        isLiveLead({ status:'converted' }) === false)
  check('isLiveLead(null) is true — no status means still live',
        isLiveLead({ status:null }) === true)
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed')
process.exit(fail === 0 ? 0 : 1)
