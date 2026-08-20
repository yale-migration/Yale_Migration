/**
 * Tests for the pure derivations.  node --experimental-strip-types lib/data/derive.test.mjs
 * (or: npx tsc then run against the emitted JS — see the npm script)
 *
 * 🔑 These decide what a consultant acts on: which files count as gone quiet,
 * whether a visa has expired, the grant rate the director reads, and which
 * rungs of the follow-up ladder still apply. Until derive.ts was split out
 * they could not be tested without mocking a database, so none of them were.
 */
import { daysBetween, isOpen, goingQuiet, expiringSoon, isLiveLead,
         recentEnquiries, outcomes, ladderFor, LADDER } from './derive.ts'

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
  check('🔴 14-day letter drops the rungs past the deadline',
        JSON.stringify(d(14,'2026-08-14').rungs) === JSON.stringify([7]),
        JSON.stringify(d(14,'2026-08-14').rungs))
  check('...and reports how many it dropped', d(14,'2026-08-14').dropped === 3)
  check('🔴 a 7-day letter leaves NO rung at all', d(7,'2026-08-18').rungs.length === 0)
  check('no letter date → not placeable, not silently zero', d(28,null).placeable === false)
  check('no day count → not placeable', ladderFor({letter_date:'2026-08-14',days_allowed:null},T).placeable === false)
  check('progress never exceeds 100%', d(7,'2026-06-01').pct === 100, String(d(7,'2026-06-01').pct))
  check('progress never goes negative for a future letter', d(28,'2026-09-01').pct === 0)
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed')
process.exit(fail === 0 ? 0 : 1)
