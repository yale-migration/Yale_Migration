import { Suspense } from 'react'
import { isLive } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getMatters, getS56Deadlines } from '@/lib/data/matters'
import { DEMO_VIEWERS } from '@/lib/data/fixtures'
import { StaffView } from '@/components/staff-view'
import { ClientView } from '@/components/client-view'
import { DemoSwitcher } from '@/components/demo-switcher'
import { YaleMark } from '@/components/brand'
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

  // ⚠️ A REAL CLIENT CAN LAND HERE — invited, signed in, not yet linked. The
  // first version was one line of grey text on an empty page, which reads as a
  // broken app. It is not broken: it is the system correctly refusing to show
  // anything until a human decides what this person may see. Say that, warmly,
  // and give them the next move rather than a dead end.
  if (!viewer) {
    return (
      <main className="min-h-dvh grid place-items-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <YaleMark className="mb-9" />
          <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
               style={{ background: 'var(--gold-soft)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3.5l7.5 3.2v5c0 4.4-3.1 7.6-7.5 8.8-4.4-1.2-7.5-4.4-7.5-8.8v-5L12 3.5z"
                    stroke="var(--gold)" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M12 10.5v3.2M12 16.4v.1" stroke="var(--gold)" strokeWidth="1.8"
                    strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-[26px] leading-tight">You are signed in</h1>
          <p className="text-[14.5px] text-ink-2 mt-3 leading-relaxed">
            Your account is not connected to a file yet. Nothing is shown until one of our
            consultants links it — that is deliberate, so nobody ever sees a matter that is
            not theirs.
          </p>
          <div className="mt-6 rounded-card border border-rule bg-card p-4">
            <h2 className="text-[14px]">What to do</h2>
            <p className="text-[13px] text-ink-2 mt-1.5">
              Reply to the email that invited you, or call us on
              {' '}<a href="tel:+61405268738" className="font-medium">0405 268 738</a>. Mention
              the address you signed in with and we will connect it straight away.
            </p>
          </div>
          <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
            Yale Migration and Education Consultants · Robinder Pal Singh, MARN 1573959
          </p>
        </div>
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
