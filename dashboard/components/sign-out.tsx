'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * 🔴 There was no way to sign out. At all, for any role.
 *
 * That is not a missing nicety. Staff share machines between consultations, and
 * a client may open their file on a friend's laptop or in a library. Without
 * this, the only way out is clearing cookies — so in practice nobody logs out,
 * and the next person at that keyboard is holding somebody's visa file.
 *
 * ⚠️ Hidden in demo mode: there is no session to end, and a button that does
 * nothing teaches people the button does not work.
 */
export function SignOut({ live }: { live: boolean }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  if (!live) return null

  return (
    <button type="button" disabled={busy}
      onClick={async () => {
        setBusy(true)
        await createClient().auth.signOut()
        // refresh() as well as push() — otherwise the server components keep
        // rendering the previous user's rows from cache.
        router.push('/login')
        router.refresh()
      }}
      className="text-[13px] px-3 min-h-[44px] rounded-lg text-ink-2 hover:text-ink
                 hover:bg-[var(--card-sunk)] transition-colors disabled:opacity-50">
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
