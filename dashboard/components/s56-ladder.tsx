import type { S56Deadline } from '@/lib/data/types'
import { daysBetween } from '@/lib/data/matters'

/**
 * The Section 56 escalation ladder — P2-02, and their own rule.
 *
 * D-58, upgraded by Robinder on WhatsApp 30 Jul: follow up at day 7, 14, 21
 * and 26. Internal deadline is day 26, the Department's legal limit is day 28,
 * and the two-day gap is there so the upload can be finished rather than
 * started. The ladder halts the moment the client confirms receipt.
 *
 * 🔴 THE LADDER ASSUMES A 28-DAY LETTER, AND NOT EVERY LETTER IS 28 DAYS.
 * A 14-day request exists in their own history. On one of those, rungs at day
 * 21 and day 26 fall AFTER the legal deadline — rendering them would tell a
 * consultant to chase a client four days after the Department had already
 * decided the application. So rungs past the legal date are dropped and the
 * compression is stated, rather than drawn and quietly wrong.
 */
const RUNGS = [7, 14, 21, 26] as const

export function S56Ladder({ d, today }: { d: S56Deadline; today: Date }) {
  const elapsed = daysBetween(d.letter_date, today)
  const allowed = d.days_allowed

  // No letter date means no ladder can be placed at all. Say that — an empty
  // rail would read as "no follow-ups needed".
  if (elapsed === null || allowed == null) {
    return (
      <p className="text-[12.5px] text-[var(--crit)] mt-2.5">
        No letter date or day count recorded, so the follow-up ladder cannot be placed.
        Open the letter.
      </p>
    )
  }

  const usable = RUNGS.filter((r) => r < allowed)
  const dropped = RUNGS.length - usable.length

  // 🔴 A very short letter leaves NO rung at all — every step of the standard
  // ladder falls past the deadline. An empty rail would read as "nothing to
  // chase", which is the opposite of the truth: a 7-day request is the most
  // urgent thing on the board, not the least.
  if (usable.length === 0) {
    return (
      <p className="text-[12.5px] mt-2.5 p-2.5 rounded-md"
         style={{ background: 'var(--crit-soft)', color: 'var(--crit)' }}>
        <b>{allowed} days only.</b> The standard 7/14/21/26 ladder does not fit — every rung
        falls after the deadline. Chase immediately and escalate to the RMA; do not wait for
        a scheduled follow-up.
      </p>
    )
  }
  const pct = Math.min(100, Math.max(0, (elapsed / allowed) * 100))

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] tracking-[.06em] uppercase text-ink-3 font-semibold">
          Follow-up ladder
        </span>
        <span className="text-[11.5px] text-ink-3 num">
          day {elapsed} of {allowed}
        </span>
      </div>

      <div className="relative h-[26px]">
        {/* the track */}
        <div className="absolute inset-x-0 top-[11px] h-[3px] rounded-full bg-[var(--card-sunk)]
                        shadow-[inset_0_0_0_1px_var(--rule)]" />
        {/* elapsed */}
        <div className="absolute left-0 top-[11px] h-[3px] rounded-full transition-[width]"
             style={{ width: `${pct}%`,
                      background: pct >= 93 ? 'var(--crit)' : pct >= 75 ? 'var(--warn)' : 'var(--accent)' }} />
        {usable.map((r) => {
          const done = elapsed >= r
          const isFinal = r === 26
          return (
            <div key={r} className="absolute -translate-x-1/2 flex flex-col items-center"
                 style={{ left: `${(r / allowed) * 100}%` }}>
              <span
                title={`Day ${r}${isFinal ? ' — internal deadline' : ' follow-up'}`}
                className={`w-[9px] h-[9px] rounded-full mt-[8px] border-2 ${
                  done ? 'border-transparent' : 'border-[var(--rule-strong)] bg-[var(--card)]'}`}
                style={done
                  ? { background: isFinal ? 'var(--crit)' : 'var(--accent)' }
                  : undefined} />
              <span className={`text-[11px] mt-1 num ${done ? 'text-ink-2 font-semibold' : 'text-ink-3'}`}>
                {r}
              </span>
            </div>
          )
        })}
      </div>

      {dropped > 0 && (
        // ⚠️ Not a footnote. A consultant who knows the ladder as "7/14/21/26"
        // will otherwise assume the missing rungs are a rendering fault.
        <p className="text-[11.5px] text-ink-2 mt-2">
          This letter allows <b>{allowed} days</b>, not 28 — {dropped} rung
          {dropped > 1 ? 's' : ''} of the usual 7/14/21/26 ladder would fall after the deadline
          and {dropped > 1 ? 'have' : 'has'} been dropped.
        </p>
      )}
      <p className="text-[11.5px] text-ink-3 mt-1.5">
        The ladder stops as soon as the client confirms receipt.
      </p>
    </div>
  )
}
