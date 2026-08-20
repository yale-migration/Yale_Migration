import { NextResponse, type NextRequest } from 'next/server'

/**
 * The hourly refresh. It did not exist — `sync.ts` had no caller anywhere, so
 * "hourly refresh", one of his four non-functional asks, was unmet and the
 * board silently served whatever was last written by hand.
 *
 * 🔴 GUARDED BY A SECRET. This route runs with the service-role key, which
 * bypasses RLS entirely. An unguarded /api/sync is a public endpoint that can
 * rewrite the client register.
 *
 * ⚠️ Returns 503 rather than pretending, while the Sheets reader is still to be
 * written. A cron that silently succeeds without syncing is worse than one that
 * fails loudly — the board would age quietly and nobody would know when.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = process.env.SYNC_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '')
  // Vercel Cron sends its own header; accept either, refuse both missing.
  const cron = request.headers.get('x-vercel-cron')
  if (!secret || (!cron && given !== secret)) {
    return NextResponse.json({ error: 'not authorised' }, { status: 401 })
  }

  return NextResponse.json({
    status: 'not_configured',
    detail: 'Google Sheets credentials are not connected yet, so nothing was synced. '
          + 'The board is showing the last data written to Postgres.',
  }, { status: 503 })
}
