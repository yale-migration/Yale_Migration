import { redirect } from 'next/navigation'
import { resolveViewer } from '@/lib/viewer'
import { getEnquiries, daysBetween, isLiveLead } from '@/lib/data/matters'
import { Nav } from '@/components/nav'
import { Card, CardHead, Chip, Row, Empty, StatTile, type Tone } from '@/components/primitives'

export const dynamic = 'force-dynamic'

export default async function EnquiriesPage(
  { searchParams }: { searchParams: Promise<{ as?: string }> },
) {
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  if (!viewer) redirect('/dashboard')
  // ⛔ Clients never see the lead pipeline. There is no client RLS policy on
  // the table either — this redirect is convenience, the database is the rule.
  if (viewer.role === 'client') redirect(`/dashboard${sp.as ? `?as=${sp.as}` : ''}`)

  const today = new Date()
  const rows = await getEnquiries(viewer)
  const live = rows.filter(isLiveLead)
  const week = rows.filter((e) => {
    const d = daysBetween(e.enquiry_date, today); return d !== null && d >= 0 && d <= 7
  })
  const overdue = live.filter((e) => {
    const d = e.follow_up_due ? daysBetween(e.follow_up_due, today) : null
    return d !== null && d > 0
  })

  return (
    <main className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <Nav current="enquiries" as={sp.as} />
      <header className="my-4">
        <h1 className="text-[21px]">Enquiries</h1>
        <p className="text-[12.5px] text-ink-3 mt-1">
          Leads, not clients. Follow-up runs on their own cadence — within 7 days, then again
          after 30 — and stops the moment a reply is logged.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <StatTile label="This week" value={week.length} sub="new enquiries" />
        <StatTile label="Live leads" value={live.length} sub="still being worked" />
        <StatTile label="Follow-up overdue" value={overdue.length} sub="past their due date"
                  tone={overdue.length ? 'crit' : 'neutral'} />
        <StatTile label="In the log" value={rows.length} sub="all time" />
      </div>

      <Card>
        <CardHead title="All enquiries" tag="newest first" />
        {rows.length === 0 ? (
          <Empty>No enquiries recorded yet. They arrive here once the enquiry log is connected.</Empty>
        ) : rows.map((e) => {
          const dueIn = e.follow_up_due ? daysBetween(e.follow_up_due, today) : null
          const isOver = isLiveLead(e) && dueIn !== null && dueIn > 0
          const tone: Tone = !isLiveLead(e) ? 'neutral' : isOver ? 'crit' : 'good'
          return (
            <Row key={e.id} tone={tone}
                 title={e.name ?? e.phone ?? 'No name or number recorded'}
                 meta={`${e.enquiry_date ?? 'no date'} · ${e.channel ?? 'unknown channel'}${
                   e.visa_interest ? ` · ${e.visa_interest}` : ''} · ${e.office ?? 'no office'} · ${
                   e.assigned_to ?? 'Unassigned'}`}
                 chip={isOver ? <Chip tone="crit">{dueIn}d overdue</Chip>
                              : <Chip tone={tone}>{e.status ?? '—'}</Chip>} />
          )
        })}
      </Card>
    </main>
  )
}
