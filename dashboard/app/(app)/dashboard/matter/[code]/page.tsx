import Link from 'next/link'
import { getMatter, getMatterS56, daysBetween, isOpen } from '@/lib/data/matters'
import { Card, CardHead, Chip, Row, StatTile, type Tone } from '@/components/primitives'
import { S56Ladder } from '@/components/s56-ladder'
import { resolveViewer } from '@/lib/viewer'

export const dynamic = 'force-dynamic'

const fmt = (d: string | null) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-AU',
      { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default async function MatterPage(
  { params, searchParams }:
  { params: Promise<{ code: string }>; searchParams: Promise<{ as?: string }> },
) {
  const { code } = await params
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  const today = new Date()
  const back = `/dashboard${sp.as ? `?as=${sp.as}` : ''}`

  const matter = viewer ? await getMatter(decodeURIComponent(code), viewer) : null

  // 🔴 ONE message for "does not exist" and "not yours". Two different messages
  // would let anyone walk the client-code sequence and learn which are real.
  if (!viewer || !matter) {
    return (
      <main className="max-w-[720px] mx-auto px-5 py-16">
        <Link href={back} className="text-[13px] font-medium">← Back to the board</Link>
        <h1 className="text-[24px] mt-6">That file is not available</h1>
        <p className="text-[14px] text-ink-2 mt-2 leading-relaxed">
          Either it does not exist, or it is not one you have access to. If you believe you should
          be able to see it, ask your branch manager.
        </p>
      </main>
    )
  }

  const s56 = await getMatterS56(matter.client_code, viewer)
  const owed = (matter.docs_outstanding ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const quietDays = daysBetween(matter.last_contact, today)
  const expiryLeft = matter.visa_expiry ? -(daysBetween(matter.visa_expiry, today) ?? 0) : null
  const open = isOpen(matter)

  const expTone: Tone =
    expiryLeft === null ? 'neutral' : expiryLeft < 0 ? 'crit'
    : expiryLeft <= 14 ? 'crit' : expiryLeft <= 30 ? 'warn' : 'neutral'
  const quietTone: Tone =
    quietDays === null ? 'neutral' : quietDays >= 21 ? 'crit' : quietDays > 14 ? 'warn' : 'neutral'

  return (
    <main className="max-w-[1000px] mx-auto px-5 pt-5 pb-16">
      <Link href={back}
            className="text-[13px] font-medium inline-flex items-center gap-1.5 min-h-[44px]">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3.5L5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to the board
      </Link>

      <header className="pb-4 mt-1 border-b border-rule">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[26px]">{matter.full_name}</h1>
          <span className="text-[13px] text-ink-3 num">{matter.client_code}</span>
          {!open && <Chip tone="neutral">{matter.visa_outcome}</Chip>}
        </div>
        <p className="text-[13px] text-ink-3 mt-1.5">
          {matter.visa_type ?? 'No visa type recorded'} · {matter.office}
          {matter.team && ` · ${matter.team}`} ·{' '}
          {/* Unassigned is shown, never hidden — the unowned files are the ones
              that go quiet, and hiding it here would hide the cause. */}
          <span className={matter.consultant ? '' : 'text-[var(--crit)] font-semibold'}>
            {matter.consultant ?? 'Unassigned'}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
        <StatTile label="Stage" value={matter.processing_stage ?? '—'}
                  sub={open ? 'open matter' : 'closed'} />
        <StatTile label="Documents"
                  value={owed.length ? `${owed.length} outstanding` : 'All received'}
                  sub={owed.length ? 'chase these' : 'nothing to chase'}
                  tone={owed.length ? 'warn' : 'good'} />
        <StatTile label="Last contact" value={quietDays === null ? '—' : `${quietDays}d ago`}
                  sub={fmt(matter.last_contact)} tone={quietTone} />
        <StatTile label="Visa expiry"
                  value={expiryLeft === null ? '—'
                        : expiryLeft < 0 ? `${Math.abs(expiryLeft)}d ago` : `${expiryLeft}d`}
                  sub={fmt(matter.visa_expiry)} tone={expTone} />
      </div>

      <div className="grid grid-cols-12 gap-3.5">
        {s56.length > 0 && (
          <Card className="col-span-12">
            <CardHead title="Section 56 — Department deadlines" tag="legal"
                      hint="Miss one and the Department decides on what it already has, without asking again." />
            {s56.map((d) => {
              const left = d.due_date_internal ? -(daysBetween(d.due_date_internal, today) ?? 0) : null
              const tone: Tone = left === null ? 'crit' : left < 0 || left <= 7 ? 'crit'
                                : left <= 14 ? 'warn' : 'good'
              return (
                <div key={d.id} className="py-3 border-b border-rule last:border-b-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13.5px] font-medium">
                        Letter dated {fmt(d.letter_date)}
                        {d.days_allowed != null && ` · ${d.days_allowed} days allowed`}
                      </div>
                      <div className="text-[11.5px] text-ink-3 mt-0.5">
                        Internal {fmt(d.due_date_internal)} · legal {fmt(d.due_date_legal)}
                      </div>
                    </div>
                    <Chip tone={tone}>
                      {left === null ? 'NO DATE — not tracked'
                       : left < 0 ? `${Math.abs(left)}d past internal` : `${left}d internal`}
                    </Chip>
                  </div>
                  {/* 🔑 The verbatim sentence, so a human can check the computed
                      date against the letter's own words rather than trusting it. */}
                  {d.deadline_sentence && (
                    <p className="text-[12.5px] text-ink-2 mt-2 p-2.5 rounded-md bg-card-sunk
                                  border-l-2 border-[var(--rule-strong)]">
                      “{d.deadline_sentence}”
                    </p>
                  )}
                  <S56Ladder d={d} today={today} />
                  {d.needs_review && (
                    <p className="text-[12px] text-[var(--crit)] font-medium mt-2">
                      Flagged for review — check this against the letter before acting on it.
                    </p>
                  )}
                </div>
              )
            })}
          </Card>
        )}

        <Card className="col-span-12 lg:col-span-7">
          <CardHead title="Documents outstanding" tag={owed.length ? `${owed.length}` : 'none'}
                    hint="What the checklist for this visa still needs from the client." />
          {owed.length === 0 ? (
            <p className="py-5 text-[13px] text-ink-3">
              Nothing outstanding. Everything the checklist asks for has been received.
            </p>
          ) : owed.map((d) => (
            <Row key={d} tone="warn" title={d} chip={<Chip tone="warn">Waiting</Chip>} />
          ))}
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHead title="Key dates" tag="from the register" />
          <Row tone="neutral" title="Next follow-up due" meta={fmt(matter.next_due)} />
          <Row tone={quietTone} title="Last contact" meta={fmt(matter.last_contact)}
               chip={quietDays !== null && quietDays > 14
                     ? <Chip tone={quietTone}>{quietDays} days</Chip> : undefined} />
          <Row tone={expTone} title="Visa expiry" meta={fmt(matter.visa_expiry)} />
        </Card>
      </div>

      <p className="text-[11.5px] text-ink-3 mt-6 pt-4 border-t border-rule">
        {/* ⛔ Says plainly where the truth lives. Someone will otherwise edit
            here, find it reverted at the next sync, and lose trust in both. */}
        This is a read-only view of the client register. Changes are made in the register itself.
      </p>
    </main>
  )
}
