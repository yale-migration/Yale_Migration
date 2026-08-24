import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the auth token on every request and hands it forward.
 *
 * 🔴 getClaims(), NOT getSession(). getSession() reads the cookie without
 * revalidating it, so a server-side authorisation decision made on its result
 * can be made on a token that is no longer valid. getClaims() validates —
 * directly, or by calling getUser(). This is current Supabase guidance and it
 * is the difference between a check and the appearance of one.
 *
 * ⚠️ The refreshed token is written back onto BOTH request and response
 * cookies, so Server Components downstream read the new one instead of each
 * trying to refresh the same token and racing each other.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  /* 🔴 THIS EARLY RETURN USED TO BE THE AUTH GATE'S OWN BYPASS (D-394).
   *
   * It read: `if (!url || !anonKey) return response` — no login enforced, on
   * every route. Locally that is correct: demo mode has no session to refresh.
   * On a DEPLOYED host it meant one missing or misspelled environment variable
   * produced a **public dashboard with a working ?as= role switcher**, because
   * the same absence that disables auth also flips `isLive()` to false and
   * makes `resolveViewer` start honouring `?as=`.
   *
   * The blast radius was bounded — the same condition serves fixtures, so the
   * data exposed would be invented people — but a gate whose failure mode is
   * "open" is not a gate, and the comment below it claimed "deny by default".
   *
   * ⛔ So: demo mode is allowed ONLY where a developer actually runs it.
   * Anywhere else, missing configuration is a 500, not an open door.
   */
  if (!url || !anonKey) {
    const isLocalDev = process.env.NODE_ENV !== 'production'
    if (isLocalDev) return response
    return new NextResponse(
      'This deployment is not configured. It is refusing to serve rather than '
      + 'serve without authentication.',
      { status: 500, headers: { 'content-type': 'text/plain' } })
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet: { name: string; value: string; options?: CookieOptions }[]) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()

  // ⛔ Deny by default. Anything not explicitly public requires a session —
  // an allowlist, so a new route is private until someone decides otherwise.
  const path = request.nextUrl.pathname
  // ⛔ /api/sync is public TO THE MIDDLEWARE and guarded by its own secret
  // instead. It is called by a cron with no session cookie, so leaving it here
  // meant every scheduled run was 307'd to /login and the hourly refresh was
  // silently dead — while the route's own hardened guard (D-391) never ran
  // once. The control on that route is `app/api/sync/guard.ts`, not a session.
  const isPublic = path.startsWith('/login') || path.startsWith('/auth')
                || path === '/api/sync'
  if (!data?.claims && !isPublic) {
    const to = request.nextUrl.clone()
    to.pathname = '/login'
    to.searchParams.set('next', path)
    return NextResponse.redirect(to)
  }

  return response
}

export const config = {
  // Everything except static assets. Auth that skips a route is not auth.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
