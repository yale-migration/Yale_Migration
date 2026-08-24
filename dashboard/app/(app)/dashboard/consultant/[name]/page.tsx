import Link from 'next/link'
import { redirect } from 'next/navigation'
import { resolveViewer } from '@/lib/viewer'
import { isLive } from '@/lib/supabase/config'
import { getMatters, goingQuiet, expiringSoon, isOpen, brisbaneToday } from '@/lib/data/matters'
import { Nav } from '@/components/nav'
import { ClientSearch } from '@/components/client-search'
import { StatTile, Card, Empty } from '@/components/primitives'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> },
) {
  const p = await params
  return { title: `${decodeURIComponent(p.name)} · Yale Migration` }
}

/**
 * One consultant's caseload.
 *
 * The workload bar answers "who is carrying the most". This answers the
 * question that immediately follows it — "carrying WHAT" — which is the one a
 * manager actually needs before reassigning anything.
 *
 * ⚠️ 'Unassigned' is a first-class destination here, not an edge case. The
 * files nobody owns are the ones that go quiet, so they need somewhere to be
 * looked at together rather than being scattered.
 */
export default async function ConsultantPage(
  { params, searchParams }:
  { params: Promise<{ name: string }>; searchParams: Promise<{ as?: string }> },
) {
  const { name: raw } = await params
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  if (!viewer) redirect('/dashboard')
  if (viewer.role === 'client') redirect(`/dashboard${sp.as ? `?as=${sp.as}` : ''}`)

  const name = decodeURIComponent(raw)
  const unassigned = name.toLowerCase() === 'unassigned'
  const today = brisbaneToday()   // ⛔ the practice's clock, not the server's (D-397)
  const all = await getMatters(viewer)
  const matters = all.filter((m) => unassigned ? !m.consultant : m.consultant === name)
  const open = matters.filter(isOpen)
  const quiet = goingQuiet(matters, today)
  const expiring = expiringSoon(matters, today)

  return (
    <>
      <Nav current="clients" as={sp.as} live={isLive()} />
    <main id="main" className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <header className="my-4">
        <Link href={`/dashboard${sp.as ? `?as=${sp.as}` : ''}`}
              className="text-[13px] font-medium text-accent hover:underline underline-offset-4">← Board</Link>
        <h1 className={`text-[24px] mt-1.5 ${unassigned ? 'text-[var(--crit)]' : ''}`}>
          {unassigned ? 'Unassigned files' : name}
        </h1>
        <p className="text-[12.5px] text-ink-3 mt-1">
          {unassigned
            ? 'Nobody owns these. They are the files most likely to go quiet.'
            : `${matters.length} ${matters.length === 1 ? 'matter' : 'matters'} on file.`}
        </p>
      </header>

      {matters.length === 0 ? (
        <Card><Empty>
          {unassigned ? 'Every matter has a consultant. Nothing is unowned.'
                      : `No matters are assigned to ${name} in the records you can see.`}
        </Empty></Card>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 mb-4">
            <StatTile label="Open matters" value={open.length} sub="excludes decided" />
            <StatTile label="Going quiet" value={quiet.length} sub="14 days+"
                      tone={quiet.length ? 'crit' : 'neutral'} />
            <StatTile label="Expiring" value={expiring.length} sub="next 60 days"
                      tone={expiring.length ? 'warn' : 'neutral'} />
            <StatTile label="Owing documents"
                      value={open.filter((m) => m.docs_outstanding).length}
                      sub="waiting on the client" tone="warn" />
          </div>
          <ClientSearch matters={matters} as={sp.as} today={today} />
        </>
      )}
    </main>
  </>
  )
}
