import { Card, CardHead, Chip, Row, Empty, type Tone } from './primitives'
import type { Enquiry } from '@/lib/data/types'
import { daysBetween, isLiveLead } from '@/lib/data/matters'

/** View 7: new enquiries this week. */
export function EnquiriesCard({ rows, today }: { rows: Enquiry[]; today: Date }) {
  const week = rows.filter((e) => {
    const d = daysBetween(e.enquiry_date, today)
    return d !== null && d >= 0 && d <= 7
  })
  const overdue = rows.filter((e) => {
    if (!isLiveLead(e)) return false
    const d = e.follow_up_due ? daysBetween(e.follow_up_due, today) : null
    return d !== null && d > 0
  })

  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHead title="New enquiries" tag="last 7 days"
                hint="From the enquiry log. Follow-up runs on their own 7 then 30 day cadence." />
      <div className="flex items-baseline gap-2.5 mb-3.5">
        <b className="font-serif text-[34px] leading-none num">{week.length}</b>
        <span className="text-[12.5px] text-ink-3">this week · {rows.length} in the log</span>
        {overdue.length > 0 && <Chip tone="crit">{overdue.length} follow-up overdue</Chip>}
      </div>
      {week.length === 0 ? (
        <Empty>No new enquiries in the last 7 days.</Empty>
      ) : week.map((e) => {
        const dueIn = e.follow_up_due ? daysBetween(e.follow_up_due, today) : null
        const tone: Tone = dueIn !== null && dueIn > 0 ? 'crit' : 'neutral'
        return (
          <Row key={e.id} tone={tone}
               // ⚠️ A lead with no name still shows — as their number. 82 rows
               // in their own log are exactly that, and dropping them would
               // under-report the pipeline to the person judging it.
               title={e.name ?? e.phone ?? 'No name or number recorded'}
               meta={`${e.channel ?? 'unknown channel'}${e.visa_interest ? ` · ${e.visa_interest}` : ''} · ${e.office ?? 'no office'} · ${e.assigned_to ?? 'Unassigned'}`}
               chip={dueIn !== null && dueIn > 0
                 ? <Chip tone="crit">{dueIn}d overdue</Chip>
                 : <Chip tone="neutral">{e.status ?? '—'}</Chip>} />
        )
      })}
    </Card>
  )
}
