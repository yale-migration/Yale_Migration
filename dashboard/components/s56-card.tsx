import { Card, CardHead, Chip, Row, Empty, type Tone } from './primitives'
import type { S56Deadline } from '@/lib/data/types'
import { daysBetween, fmtDate } from '@/lib/data/matters'

/**
 * Section 56 deadlines — the highest-consequence card on the board.
 *
 * Miss one and the Department decides the application on what it already has,
 * without asking again.
 *
 * 🔴 IT LEADS WITH THE INTERNAL DATE, NOT THE LEGAL ONE. Their SOP works two
 * days ahead of the legal deadline (D-58). A screen showing only the legal date
 * invites working to the wire — and the wire is the point at which a client's
 * application is decided without their evidence. The legal date sits beside it
 * so nobody has to trust the arithmetic blindly.
 *
 * ⚠️ `days_allowed` is displayed, never assumed. Real letters carry 14 as well
 * as 28, and every part of this build is written so that a hardcoded 28 cannot
 * creep in anywhere.
 */
export function S56Card({ rows, today, as }: {
  rows: S56Deadline[]; today: Date; as?: string
}) {
  return (
    <Card className="col-span-12" id="s56">
      <CardHead
        title="Section 56 — Department deadlines"
        tag="internal date · legal date"
        hint="Miss one and the Department decides on what it already has, without asking again. Internal dates run two days ahead of the legal date."
      />
      {rows.length === 0 ? (
        <Empty>
          {/* ⚠️ Was "Nothing is running against a Department clock." Nothing
              extracts s56 letters yet — that sentence stated "we are not
              looking" as "there is nothing there", about legal deadlines. */}
          No Section 56 requests have been recorded here yet. Deadlines appear once
          Department email is being read — they are not detected automatically today.
        </Empty>
      ) : (
        <div className="flex flex-col">
          {rows.map((d) => {
            const internal = d.due_date_internal ? -(daysBetween(d.due_date_internal, today) ?? 0) : null
            const legal = d.due_date_legal ? -(daysBetween(d.due_date_legal, today) ?? 0) : null
            const tone: Tone =
              internal === null ? 'neutral' : internal < 0 ? 'crit' : internal <= 7 ? 'crit'
              : internal <= 14 ? 'warn' : 'good'

            // ⚠️ A missing due date is NOT "fine". It means the deadline was never
            // extracted, so nothing is watching it — worse than a near one, and it
            // must never render as a calm grey row that reads as "no deadline".
            const label =
              internal === null ? 'NO DATE — not tracked'
              : internal < 0 ? `${Math.abs(internal)}d PAST internal`
              : `${internal}d internal · ${legal}d legal`

            return (
              <Row
                key={d.id}
                href={d.client_code
                  ? `/dashboard/matter/${encodeURIComponent(d.client_code)}${as ? `?as=${as}` : ''}`
                  : undefined}
                tone={internal === null ? 'crit' : tone}
                title={`${d.client_name ?? 'Unnamed'}${d.subclass ? ` · ${d.subclass}` : ''}`}
                meta={
                  <>
                    {d.office}
                    {d.letter_date && ` · letter ${fmtDate(d.letter_date)}`}
                    {/* parsed from the letter, never assumed */}
                    {d.days_allowed != null && ` · ${d.days_allowed} days allowed`}
                    {d.needs_review && ' · NEEDS REVIEW'}
                  </>
                }
                chip={<Chip tone={internal === null ? 'crit' : tone}
                           solid={internal !== null && internal < 0}>{label}</Chip>}
              />
            )
          })}
        </div>
      )}
    </Card>
  )
}
