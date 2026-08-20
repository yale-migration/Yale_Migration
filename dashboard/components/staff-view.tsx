import Link from 'next/link'
import { Card, CardHead, Chip, Row, Empty, StatTile, Owner, type Tone } from './primitives'
import { NeedsToday, type Action } from './needs-today'
import { S56Card } from './s56-card'
import { goingQuiet, expiringSoon, isOpen, daysBetween } from '@/lib/data/matters'
import type { Matter, S56Deadline, Viewer, Enquiry } from '@/lib/data/types'
import { OutcomesCard } from './outcomes-card'
import { EnquiriesCard } from './enquiries-card'

/** Director and branch-manager view. Identical component — RLS decides the rows. */
export function StaffView({ matters, s56, enquiries, viewer, today, as }: {
  matters: Matter[]; s56: S56Deadline[]; enquiries: Enquiry[]
  viewer: Viewer; today: Date; as?: string
}) {
  // ⚠️ Carry `as` across the navigation. Without it, clicking a row during a
  // demo silently drops you back to the director view — which would look like
  // the access control failing, in front of the person being shown it.
  const matterHref = (code: string) =>
    `/dashboard/matter/${encodeURIComponent(code)}${as ? `?as=${as}` : ''}`
  // Every counted number gets somewhere to go. A tile that states a figure and
  // cannot open it makes the reader go and find those rows by hand, which is
  // the work the board was supposed to remove.
  const listHref = (f: string) =>
    `/dashboard/clients?filter=${f}${as ? `&as=${as}` : ''}`

  const open = matters.filter(isOpen)
  const quiet = goingQuiet(matters, today)
  // 🔴 Counted, not hidden. A file with no contact date is not a quiet file —
  // it is a file nobody can tell about, which is worse.
  const noContactDate = open.filter((m) => !m.last_contact).length
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
    // One deadline → straight to that file. Several → the card listing them.
    href: s56Near.length === 1 && s56Near[0]?.client_code
      ? matterHref(s56Near[0]!.client_code!) : '#s56',
  })
  const urgentExp = expiring.filter((x) => x.left <= 14)
  if (urgentExp.length) actions.push({
    tone: 'crit', count: urgentExp.length, title: 'Visa expiring within 14 days',
    detail: urgentExp.map((x) => `${x.m.full_name} (${x.left}d)`).join(' · '),
    href: urgentExp.length === 1 && urgentExp[0]
      ? matterHref(urgentExp[0].m.client_code) : listHref('expiring'),
  })
  const coldest = quiet.filter((q) => q.days >= 21)
  if (coldest.length) actions.push({
    tone: 'crit', count: coldest.length, title: 'No contact for 21 days or more',
    detail: coldest.map((q) => `${q.m.full_name} · ${q.m.consultant ?? 'unassigned'}`).join(' · '),
    href: coldest.length === 1 && coldest[0]
      ? matterHref(coldest[0].m.client_code) : listHref('quiet'),
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
  const officeCount = new Map<string, number>()
  for (const m of open) officeCount.set(m.office, (officeCount.get(m.office) ?? 0) + 1)
  const offices = [...officeCount.entries()].sort((a, b) => b[1] - a[1])

  const byStage = [...stageCount.entries()].sort((a, b) => b[1] - a[1])
  const maxStage = Math.max(...byStage.map(([, n]) => n), 1)

  return (
    <>
      <NeedsToday actions={actions} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 my-3.5">
        <StatTile label="Open matters" value={open.length}
                  sub={viewer.office ?? 'all offices'} href={listHref('open')} />
        {/* s56 has no client list of its own — the card below IS the list, so
            this scrolls to it rather than opening a page that repeats it. */}
        <StatTile label="Section 56 live" value={s56.length} sub="legal deadlines running"
                  tone={s56Near.length ? 'crit' : 'neutral'} href="#s56" />
        <StatTile label="Going quiet" value={quiet.length} sub="no contact 14 days+"
                  tone={quiet.length ? 'crit' : 'neutral'} href={listHref('quiet')} />
        <StatTile label="Expiring 60 days" value={expiring.length} sub="visa expiry approaching"
                  tone={expiring.length ? 'warn' : 'neutral'} href={listHref('expiring')} />
      </div>

      {/* 🔑 The five-times ask. A combined board answers "how is the practice";
          it never answers "how is Townsville", which is the question he keeps
          asking. Only rendered for someone who can see more than one branch —
          a Brisbane manager does not need a link to the only branch they have. */}
      {offices.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3.5">
          <span className="text-[11px] tracking-[.06em] uppercase text-ink-3 font-semibold
                           self-center mr-1">Branches</span>
          {offices.map(([office, n]) => (
            <Link key={office}
                  href={`/dashboard/branch/${encodeURIComponent(office)}${as ? `?as=${as}` : ''}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-xl
                             border border-rule bg-card text-[13px] font-medium
                             hover:border-[var(--accent)] transition-colors">
              {office}
              <span className="text-ink-3 num">{n}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-3.5">
        <S56Card rows={s56} today={today} as={as} />

        <Card className="col-span-12 lg:col-span-6">
          <CardHead title="Going quiet" tag="oldest first"
                    hint="Open files with no contact for over 14 days." />
          {quiet.length === 0 ? (
            <Empty>
              {/* 🔴 Was "Every open file has been contacted in the last 14 days."
                  goingQuiet SKIPS rows with a null last_contact, and in the real
                  import that is 0 of 38 rows populated — so the reassuring
                  sentence would have been printed over a practice where nothing
                  was known. Same defect already fixed once in the Sheet version. */}
              No open file has a contact date older than 14 days.
              {noContactDate > 0 && (
                <> <b className="text-[var(--crit)]">{noContactDate} file
                {noContactDate === 1 ? ' has' : 's have'} no contact date recorded at all</b> and
                cannot be checked.</>
              )}
            </Empty>
          ) : quiet.map(({ m, days }) => {
            const tone: Tone = days >= 21 ? 'crit' : 'warn'
            return <Row key={m.client_code} tone={tone} href={matterHref(m.client_code)}
                        title={`${m.full_name} · ${m.visa_type ?? '—'}`}
                        meta={<>{<Owner value={m.consultant} />} · {m.office} · {m.processing_stage ?? '—'}</>}
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
            return <Row key={m.client_code} tone={tone} href={matterHref(m.client_code)}
                        title={`${m.full_name} · ${m.visa_type ?? '—'}`}
                        meta={<>{<Owner value={m.consultant} />} · {m.office}</>}
                        chip={<Chip tone={tone} solid={left < 0}>
                          {left < 0 ? `Expired ${Math.abs(left)}d ago` : `${left} days`}
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
                <Link key={name} href={`/dashboard/consultant/${encodeURIComponent(name)}${as ? `?as=${as}` : ''}`}
                      className="grid grid-cols-[116px_1fr_34px] gap-2.5 items-center min-h-[44px]
                                 -mx-1.5 px-1.5 rounded-md hover:bg-[var(--card-sunk)] transition-colors">
                  <div className={`text-[12.5px] truncate ${name === 'Unassigned' ? 'text-[var(--crit)] font-semibold' : 'text-ink-2'}`}>
                    {name}
                  </div>
                  <div className="h-[9px] bg-card-sunk rounded-[5px] overflow-hidden shadow-[inset_0_0_0_1px_var(--rule)]">
                    <div className="h-full rounded-[5px]"
                         style={{ width: `${(n / maxLoad) * 86}%`,
                                  background: name === 'Unassigned' ? 'var(--crit)' : 'var(--accent)' }} />
                  </div>
                  <div className="text-[13px] font-semibold text-right num">{n}</div>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <OutcomesCard matters={matters} />
        <EnquiriesCard rows={enquiries} today={today} />
      </div>
    </>
  )
}
