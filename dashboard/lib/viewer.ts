import { isLive } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { DEMO_VIEWERS } from '@/lib/data/fixtures'
import type { Viewer, Role, Office } from '@/lib/data/types'

/**
 * Who is asking. Hoisted out of the page because three pages now need it, and
 * three copies of an authorisation lookup is three chances for one to drift.
 *
 * 🔴 In LIVE mode `?as=` is ignored entirely. It is a demo device; honouring it
 * against a real project would be a privilege-escalation query string. RLS
 * would still refuse the rows, but an app that TRIES to honour it is one policy
 * edit away from succeeding.
 */
export async function resolveViewer(sp: { as?: string }): Promise<Viewer | null> {
  if (!isLive()) {
    // 🔴 `?as=unlinked` makes the "signed in, not connected to a file" state
    // REACHABLE (D-454). It was previously impossible to reach in demo mode —
    // every key fell back to `director` — so no test could touch it, and the
    // screen shipped as a dead end with no sign-out and no address shown.
    // **An unreachable state is an untested state.**
    // It is also the screen every new client sees first, so being able to show
    // Robinder what it looks like is worth the one extra key.
    if (sp.as === 'unlinked') return null
    return DEMO_VIEWERS[sp.as ?? 'director'] ?? DEMO_VIEWERS.director!
  }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub) return null

  const { data } = await supabase.from('profiles')
    .select('role, office, client_code, full_name').single()
  if (!data) return null      // authenticated but unlinked — sees nothing, by design

  return {
    role: data.role as Role,
    office: (data.office ?? null) as Office | null,
    clientCode: data.client_code ?? null,
    displayName: data.full_name ?? 'Yale Migration',
  }
}

/**
 * The signed-in address, for the one screen that needs it: an authenticated
 * user with no profile row.
 *
 * 🔴 That screen told people to "mention the address you signed in with" and
 * then did not show it (D-454). On a shared machine, or for anyone with two
 * Google accounts, that is an unanswerable instruction — and it is the ONE
 * fact the consultant needs in order to link them.
 *
 * Returns null in demo mode and when signed out; both callers already handle it.
 */
export async function viewerEmail(): Promise<string | null> {
  if (!isLive()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const email = data?.claims?.email
    return typeof email === 'string' ? email : null
  } catch {
    // ⛔ Never let a missing address break the page it appears on — the page
    // exists precisely because something is already incomplete.
    return null
  }
}
