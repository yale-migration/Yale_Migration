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
  // Demo mode: nothing to refresh, and no login to enforce.
  if (!url || !anonKey) return response

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
  const isPublic = path.startsWith('/login') || path.startsWith('/auth')
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
