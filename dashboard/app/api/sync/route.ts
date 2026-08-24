import { NextResponse, type NextRequest } from 'next/server'
import { checkSyncAuth } from './guard'

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
  // ⛔ The guard lives in ./guard.ts so it can be tested directly. It used to
  // accept ANY request carrying an `x-vercel-cron` header, secret or not —
  // two ways past the service-role key. See that file. (D-391)
  const auth = checkSyncAuth({
    secret: process.env.SYNC_SECRET,
    authorization: request.headers.get('authorization'),
    xVercelCron: request.headers.get('x-vercel-cron'),
  })
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }

  return NextResponse.json({
    status: 'not_configured',
    detail: 'Google Sheets credentials are not connected yet, so nothing was synced. '
          + 'The board is showing the last data written to Postgres.',
  }, { status: 503 })
}
