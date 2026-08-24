import Link from 'next/link'
import { redirect } from 'next/navigation'
import { resolveViewer } from '@/lib/viewer'
import { isLive } from '@/lib/supabase/config'
import { getMatters, getS56Deadlines, getEnquiries,
         goingQuiet, expiringSoon, isOpen, outcomes, brisbaneToday } from '@/lib/data/matters'
import { Nav } from '@/components/nav'
import { ClientSearch } from '@/components/client-search'
import { StatTile, Card, CardHead, Empty } from '@/components/primitives'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ office: string }> },
) {
  const p = await params
  return { title: `${decodeURIComponent(p.office)} · Yale Migration` }
}

/**
 * One branch, on its own.
 *
 * 🔑 THIS IS THE ASK HE HAS MADE FIVE TIMES. CR-001 → 007 → 009 → 010 → 012,
 * one need in five shapes: he is opening branches and cannot see what his staff
 * are doing. A single combined board answers "how is the practice", never "how
 * is Townsville" — and Townsville is the question he keeps asking.
 *
 * ⚠️ A manager reaching another branch's URL directly gets nothing, because
 * getMatters returns only rows RLS allowed. The page then reads as an empty
 * branch rather than a refusal, which is correct: it never confirms whether
 * that office exists at all.
 */
export default async function BranchPage(
  { params, searchParams }:
  { params: Promise<{ office: string }>; searchParams: Promise<{ as?: string }> },
) {
  const { office: raw } = await params
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  if (!viewer) redirect('/dashboard')
  if (viewer.role === 'client') redirect(`/dashboard${sp.as ? `?as=${sp.as}` : ''}`)

  const office = decodeURIComponent(raw).toUpperCase()
  const today = brisbaneToday()   // ⛔ the practice's clock, not the server's (D-397)
  const [all, s56All, enqAll] = await Promise.all([
    getMatters(viewer), getS56Deadlines(viewer), getEnquiries(viewer),
  ])

  const matters = all.filter((m) => m.office === office)
  const s56 = s56All.filter((d) => d.office === office)
  /* 🔴 NOT filtered by office. The ENQUIRIES tab has no office column, so
     `e.office` is null on every live row and this filter returned ZERO for
     every branch, permanently — then printed "No enquiries recorded for this
     branch", stating a fact about the practice that was really a fact about a
     column nobody collects. The enquiries PAGE was fixed for this (D-389) and
     this filter was missed. Leads are not branch-attributed yet, so the honest
     move is to show the practice-wide figure and say so. (D-398) */
  const enq = enqAll
  const open = matters.filter(isOpen)
  const quiet = goingQuiet(matters, today)
  const expiring = expiringSoon(matters, today)
  const o = outcomes(matters)

  return (
    <>
      <Nav current="clients" as={sp.as} live={isLive()} />
    <main id="main" className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <header className="my-4">
        <Link href={`/dashboard${sp.as ? `?as=${sp.as}` : ''}`}
              className="text-[13px] font-medium text-accent hover:underline underline-offset-4">← Board</Link>
        <h1 className="text-[24px] mt-1.5">{office}</h1>
        <p className="text-[12.5px] text-ink-3 mt-1">
          {matters.length} {matters.length === 1 ? 'matter' : 'matters'} on file in this branch.
        </p>
      </header>

      {matters.length === 0 ? (
        <Card>
          <Empty>
            No matters here. Either this branch has none on file, or it is not one you have
            access to.
          </Empty>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 mb-4">
            <StatTile label="Open matters" value={open.length} sub="excludes decided" />
            <StatTile label="Section 56" value={s56.length} sub="legal deadlines"
                      tone={s56.length ? 'crit' : 'neutral'} />
            <StatTile label="Going quiet" value={quiet.length} sub="14 days+"
                      tone={quiet.length ? 'crit' : 'neutral'} />
            <StatTile label="Expiring" value={expiring.length} sub="next 60 days"
                      tone={expiring.length ? 'warn' : 'neutral'} />
            {/* null, not 0 — a branch that has decided nothing has no grant rate */}
            <StatTile label="Granted" value={o.rate === null ? '—' : `${o.rate}%`}
                      sub={o.decided ? `${o.decided} decided` : 'nothing decided yet'} />
          </div>

          <Card className="mb-4">
            <CardHead title="Live enquiries" tag={`${enq.length}`}
                      hint="Practice-wide. Leads are not attributed to a branch — the enquiry log has no branch column." />
            {enq.length === 0 ? <Empty>No enquiries in the log yet.</Empty> : (
              <p className="text-[13px] text-ink-2 py-1">
                {enq.length} in the log ·{' '}
                <Link href={`/dashboard/enquiries${sp.as ? `?as=${sp.as}` : ''}`}
                      className="font-medium">see all enquiries</Link>
              </p>
            )}
          </Card>

          <ClientSearch matters={matters} as={sp.as} today={today} />
        </>
      )}
    </main>
  </>
  )
}
