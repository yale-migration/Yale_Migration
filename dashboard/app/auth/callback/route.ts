import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** Exchanges the magic-link code for a session, then sends them to the board. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    // ⛔ Only ever redirect to a path on this origin. Taking `next` from the
    // query without this check is an open redirect — and on a sign-in route it
    // is a phishing primitive: a link that really does log you in, then lands
    // you on somebody else's page.
    if (!error) {
      const safe = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
      return NextResponse.redirect(`${origin}${safe}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=link`)
}
