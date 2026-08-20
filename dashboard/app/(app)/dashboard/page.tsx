import { Suspense } from 'react'
import { isLive } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getMatters, getS56Deadlines } from '@/lib/data/matters'
import { DEMO_VIEWERS } from '@/lib/data/fixtures'
import { StaffView } from '@/components/staff-view'
import { ClientView } from '@/components/client-view'
import { DemoSwitcher } from '@/components/demo-switcher'
import type { Viewer, Role, Office } from '@/lib/data/types'

export const dynamic = 'force-dynamic'   // per-user data; never statically cached

/**
 * Resolve who is asking.
 *
 * 🔴 In LIVE mode the role comes from the database, and the `?as=` parameter is
 * ignored completely. It would otherwise be a privilege-escalation query string
 * — and even though RLS would still refuse the rows, an app that *tries* to
 * honour it is one policy edit away from succeeding.
 */
async function resolveViewer(searchParams: { as?: string }): Promise<Viewer | null> {
  if (!isLive()) {
    return DEMO_VIEWERS[searchParams.as ?? 'director'] ?? DEMO_VIEWERS.director!
  }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub) return null

  const { data } = await supabase
    .from('profiles')
    .select('role, office, client_code, full_name')
    .single()

  if (!data) return null   // authenticated but unlinked — sees nothing, by design
  return {
    role: data.role as Role,
    office: (data.office ?? null) as Office | null,
    clientCode: data.client_code ?? null,
    displayName: data.full_name ?? 'Yale Migration',
  }
}

export default async function DashboardPage(
  { searchParams }: { searchParams: Promise<{ as?: string }> },
) {
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  const today = new Date()

  if (!viewer) {
    return (
      <main className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-xl">Your account is not linked yet</h1>
        <p className="text-[13px] text-ink-2 mt-2">
          You are signed in, but nobody has connected this login to a file or a branch yet.
          Your Yale consultant can do that. Nothing is shown until they do.
        </p>
      </main>
    )
  }

  const [matters, s56] = await Promise.all([getMatters(viewer), getS56Deadlines(viewer)])
  const stamp = today.toLocaleString('en-AU',
    { day:'numeric', month:'short', hour:'numeric', minute:'2-digit' })

  return (
    <main className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <header className="flex flex-wrap gap-4 items-end justify-between pb-4 border-b border-rule">
        <div>
          <h1 className="text-[21px]">Yale Migration — Practice Board</h1>
          <p className="text-[12.5px] text-ink-3 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--good)]
                             shadow-[0_0_0_3px_var(--good-soft)]" aria-hidden="true" />
            {isLive() ? 'Live from the client register' : 'Sample data — no real client shown'}
            {' · updated '}{stamp}
          </p>
        </div>
        {!isLive() && (
          <Suspense fallback={null}>
            <DemoSwitcher current={sp.as ?? 'director'} />
          </Suspense>
        )}
      </header>

      <p className="mt-3.5 px-3.5 py-2.5 rounded-lg text-[12.5px]
                    bg-[var(--accent-soft)] text-[var(--accent)]">
        <b className="font-semibold">{viewer.displayName}</b>
        {' · '}
        {viewer.role === 'director'
          ? 'You are seeing every branch. Managers see only their own.'
          : viewer.role === 'manager'
          ? `${viewer.office} only. Other branches are not returned to this view.`
          : 'You see your own matter and nothing else.'}
      </p>

      {viewer.role === 'client'
        ? <ClientView matter={matters[0] ?? null} today={today} />
        : <StaffView matters={matters} s56={s56} viewer={viewer} today={today} />}

      <footer className="mt-7 pt-4 border-t border-rule text-[11.5px] text-ink-3
                         flex flex-wrap gap-x-5 gap-y-1.5">
        <span>Open matters exclude Granted, Refused and Withdrawn.</span>
        <span>Yale Migration and Education Consultants · MARN 1573959</span>
      </footer>
    </main>
  )
}
