import { redirect } from 'next/navigation'
import { resolveViewer } from '@/lib/viewer'
import { isLive } from '@/lib/supabase/config'
import { getEnquiries, daysBetween, isLiveLead, fmtDate } from '@/lib/data/matters'
import { Nav } from '@/components/nav'
import { Card, CardHead, Chip, Row, Empty, StatTile, type Tone } from '@/components/primitives'

export const metadata = { title: 'Enquiries · Yale Migration' }
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
    <main id="main" className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <Nav current="enquiries" as={sp.as} live={isLive()} />
      <header className="my-4">
        <h1 className="text-[24px]">Enquiries</h1>
        <p className="text-[12.5px] text-ink-3 mt-1">
          Leads, not clients. Follow-up runs on their own cadence — within 7 days, then again
          after 30 — and stops the moment a reply is logged.
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 mb-4">
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
                 /* ⛔ `location` (Onshore/Offshore), NOT `office`. The ENQUIRIES tab has
                    no office column, so `e.office` is null on every live row and this line
                    used to read "no office" for all of them — a field that looks missing
                    when it was never collected. Location IS collected, and onshore vs
                    offshore changes which checklist and which lodgement path applies. */
                 meta={[fmtDate(e.enquiry_date), e.channel ?? '—', e.visa_interest,
                        e.location, e.assigned_to ?? 'Unassigned']
                        .filter(Boolean).join(' · ')}
                 chip={isOver ? <Chip tone="crit">{dueIn}d overdue</Chip>
                              : <Chip tone={tone}>{e.status ?? '—'}</Chip>} />
          )
        })}
      </Card>
    </main>
  )
}
