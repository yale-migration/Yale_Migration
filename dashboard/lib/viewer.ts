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
  if (!isLive()) return DEMO_VIEWERS[sp.as ?? 'director'] ?? DEMO_VIEWERS.director!

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
