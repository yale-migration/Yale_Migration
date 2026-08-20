import { Card, CardHead, Chip, Row, Empty, StatTile, type Tone } from './primitives'
import { NeedsToday, type Action } from './needs-today'
import { S56Card } from './s56-card'
import { goingQuiet, expiringSoon, isOpen, daysBetween } from '@/lib/data/matters'
import type { Matter, S56Deadline, Viewer } from '@/lib/data/types'

/** Director and branch-manager view. Identical component — RLS decides the rows. */
export function StaffView({ matters, s56, viewer, today }: {
  matters: Matter[]; s56: S56Deadline[]; viewer: Viewer; today: Date
}) {
  const open = matters.filter(isOpen)
  const quiet = goingQuiet(matters, today)
  const expiring = expiringSoon(matters, today)
  const s56Near = s56.filter((d) => {
    const left = d.due_date_internal ? -(daysBetween(d.due_date_internal, today) ?? 0) : null
    return left !== null && left <= 7
  })

  // Ranked by consequence, not by count. A Section 56 deadline is a legal
  // instrument; a quiet file is a bad habit. They do not belong in one list
  // sorted by size.
  const actions: Action[] = []
  if (s56Near.length) actions.push({
    tone: 'crit', count: s56Near.length, title: 'Section 56 due inside a week',
    detail: s56Near.map((d) => d.client_name ?? d.client_code ?? 'Unnamed').join(' · '),
  })
  const urgentExp = expiring.filter((x) => x.left <= 14)
  if (urgentExp.length) actions.push({
    tone: 'crit', count: urgentExp.length, title: 'Visa expiring within 14 days',
    detail: urgentExp.map((x) => `${x.m.full_name} (${x.left}d)`).join(' · '),
  })
  const coldest = quiet.filter((q) => q.days >= 21)
  if (coldest.length) actions.push({
    tone: 'crit', count: coldest.length, title: 'No contact for 21 days or more',
    detail: coldest.map((q) => `${q.m.full_name} · ${q.m.consultant ?? 'unassigned'}`).join(' · '),
  })

  const byConsultant = new Map<string, number>()
  for (const m of open) {
    // ⚠️ "Unassigned" is a real state in their data and it must be VISIBLE.
    // Dropping these rows would hide the files nobody owns — which are exactly
    // the ones that go quiet.
    const k = m.consultant ?? 'Unassigned'
    byConsultant.set(k, (byConsultant.get(k) ?? 0) + 1)
  }
  const staff = [...byConsultant.entries()].sort((a, b) => b[1] - a[1])
  const maxLoad = Math.max(...staff.map(([, n]) => n), 1)

  // Stage distribution. Computed from the rows this viewer was ALLOWED to see —
  // a count taken before scoping is how a branch manager learns the size of the
  // other branch's pipeline.
  const stageCount = new Map<string, number>()
  for (const m of open) {
    const k = m.processing_stage ?? 'Not set'
    stageCount.set(k, (stageCount.get(k) ?? 0) + 1)
  }
  const byStage = [...stageCount.entries()].sort((a, b) => b[1] - a[1])
  const maxStage = Math.max(...byStage.map(([, n]) => n), 1)

  return (
    <>
      <NeedsToday actions={actions} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 my-3.5">
        <StatTile label="Open matters" value={open.length}
                  sub={viewer.office ?? 'all offices'} />
        <StatTile label="Section 56 live" value={s56.length} sub="legal deadlines running"
                  tone={s56Near.length ? 'crit' : 'neutral'} />
        <StatTile label="Going quiet" value={quiet.length} sub="no contact 14 days+"
                  tone={quiet.length ? 'crit' : 'neutral'} />
        <StatTile label="Expiring 60 days" value={expiring.length} sub="visa expiry approaching"
                  tone={expiring.length ? 'warn' : 'neutral'} />
      </div>

      <div className="grid grid-cols-12 gap-3.5">
        <S56Card rows={s56} today={today} />

        <Card className="col-span-12 lg:col-span-6">
          <CardHead title="Going quiet" tag="oldest first"
                    hint="Open files with no contact for over 14 days." />
          {quiet.length === 0 ? (
            <Empty>Nobody has gone quiet. Every open file has been contacted in the last 14 days.</Empty>
          ) : quiet.map(({ m, days }) => {
            const tone: Tone = days >= 21 ? 'crit' : 'warn'
            return <Row key={m.client_code} tone={tone}
                        title={`${m.full_name} · ${m.visa_type ?? '—'}`}
                        meta={`${m.consultant ?? 'Unassigned'} · ${m.office} · ${m.processing_stage ?? '—'}`}
                        chip={<Chip tone={tone}>{days} days</Chip>} />
          })}
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHead title="Visa expiring soon" tag="next 60 days"
                    hint="Counted from the expiry date on each file." />
          {expiring.length === 0 ? (
            <Empty>No visa on an open file expires in the next 60 days.</Empty>
          ) : expiring.map(({ m, left }) => {
            // Already expired is its own state, not just "very soon".
            const tone: Tone = left < 0 ? 'crit' : left <= 14 ? 'crit' : left <= 30 ? 'warn' : 'good'
            return <Row key={m.client_code} tone={tone}
                        title={`${m.full_name} · ${m.visa_type ?? '—'}`}
                        meta={`${m.consultant ?? 'Unassigned'} · ${m.office}`}
                        chip={<Chip tone={tone}>
                          {left < 0 ? `EXPIRED ${Math.abs(left)}d ago` : `${left} days`}
                        </Chip>} />
          })}
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHead title="Where matters are stuck" tag="by stage"
                    hint="The largest queue is the bottleneck." />
          {byStage.length === 0 ? <Empty>No open matters to place.</Empty> : (
            <div className="flex flex-col gap-2.5">
              {byStage.map(([stage, n]) => (
                <div key={stage} className="grid grid-cols-[116px_1fr_34px] gap-2.5 items-center">
                  <div className="text-[12.5px] text-ink-2 truncate">{stage}</div>
                  <div className="h-[9px] bg-card-sunk rounded-[5px] overflow-hidden shadow-[inset_0_0_0_1px_var(--rule)]">
                    <div className="h-full rounded-[5px] bg-[var(--accent)]"
                         style={{ width: `${(n / maxStage) * 86}%` }} />
                  </div>
                  <div className="text-[13px] font-semibold text-right num">{n}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHead title="Consultant workload" tag="open files"
                    hint="Who is carrying the most right now." />
          {staff.length === 0 ? <Empty>No open matters to assign.</Empty> : (
            <div className="flex flex-col gap-2.5">
              {staff.map(([name, n]) => (
                <div key={name} className="grid grid-cols-[116px_1fr_34px] gap-2.5 items-center">
                  <div className={`text-[12.5px] truncate ${name === 'Unassigned' ? 'text-[var(--crit)] font-semibold' : 'text-ink-2'}`}>
                    {name}
                  </div>
                  <div className="h-[9px] bg-card-sunk rounded-[5px] overflow-hidden shadow-[inset_0_0_0_1px_var(--rule)]">
                    <div className="h-full rounded-[5px]"
                         style={{ width: `${(n / maxLoad) * 86}%`,
                                  background: name === 'Unassigned' ? 'var(--crit)' : 'var(--s1)' }} />
                  </div>
                  <div className="text-[13px] font-semibold text-right num">{n}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
