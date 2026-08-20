import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicConfig } from './config'

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * ⛔ CREATED PER REQUEST. Never hoist this to module scope and never share the
 * returned client between requests — it closes over ONE user's cookies, so a
 * cached instance would serve one visitor's session to the next.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = publicConfig()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components cannot set cookies. Middleware refreshes the
          // session, so swallowing this is correct rather than lossy.
        }
      },
    },
  })
}
