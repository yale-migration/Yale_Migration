import { NextResponse, type NextRequest } from 'next/server'
import { checkSyncAuth } from './guard'
import { readTab } from '@/sync/sheets'
import { syncMatters, syncS56, syncEnquiries, type SyncResult } from '@/sync/sync'

/**
 * The hourly refresh: Google Sheets → Postgres, one way. (D-401)
 *
 * 🔴 GUARDED BY A SECRET. This route runs with the service-role key, which
 * bypasses RLS entirely. An unguarded /api/sync is a public endpoint that can
 * rewrite the client register. The guard lives in ./guard.ts so it can be
 * tested; it used to accept ANY request carrying an `x-vercel-cron` header,
 * secret or not — two ways past the key (D-391).
 *
 * ⛔ SHEETS REMAINS THE SYSTEM OF RECORD. Nothing here writes to it: the token
 * is minted with `spreadsheets.readonly`, only GET is called, and the service
 * account should hold **Viewer**. Postgres is a disposable copy — if it is ever
 * wrong, delete it and re-sync.
 *
 * 🔑 PARTIAL SUCCESS IS REPORTED, NOT SWALLOWED. Each tab is synced
 * independently and one failure does not abort the others, because "the s56 tab
 * was renamed" should not also stop the client register refreshing. The response
 * names exactly what succeeded and what did not, and the HTTP status reflects
 * it — a cron that returns 200 after doing nothing is the failure shape this
 * project has hit most often (D-292…D-296).
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** The one workbook all three tabs live in. Overridable per environment. */
const SHEET_ID = process.env.YALE_SHEET_ID
  ?? '1ZE1OoTjgO5UyZI4dDxfGoGLy5ojHQibqHpMb3RTQc6k'

/**
 * ⚠️ Ranges include the HEADER ROW — `buildRecords` needs it for the credential
 * guard, and the mapping is by column letter, so the range must start at A.
 */
const TABS = [
  { name: 'matters',   range: 'MASTER!A1:AE',      run: syncMatters },
  { name: 's56',       range: 'S56 TRACKER!A1:S',  run: syncS56 },
  { name: 'enquiries', range: 'ENQUIRIES!A1:L',    run: syncEnquiries },
] as const

export async function GET(request: NextRequest) {
  const auth = checkSyncAuth({
    secret: process.env.SYNC_SECRET,
    authorization: request.headers.get('authorization'),
    xVercelCron: request.headers.get('x-vercel-cron'),
  })
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status })

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    // ⛔ 503, never 200. A cron that silently succeeds without syncing is worse
    // than one that fails loudly — the board would age quietly and the first
    // person to notice would be a consultant acting on a stale deadline.
    return NextResponse.json({
      status: 'not_configured',
      detail: 'No Google service-account credentials, so nothing was synced. The board is '
            + 'showing the last data written to Postgres.',
    }, { status: 503 })
  }

  const results: Record<string, SyncResult | { error: string }> = {}
  let ok = 0, failed = 0

  for (const tab of TABS) {
    try {
      const { headers, rows } = await readTab(SHEET_ID, tab.range)
      results[tab.name] = await tab.run(rows, headers)
      ok++
    } catch (e) {
      // ⛔ The message is ours, not the upstream body — Google's errors can echo
      // the assertion back, and a Postgres error carries column and policy names.
      results[tab.name] = { error: e instanceof Error ? e.message : 'unknown failure' }
      failed++
    }
  }

  return NextResponse.json(
    { status: failed === 0 ? 'ok' : ok === 0 ? 'all_failed' : 'partial', synced: ok, failed, results },
    { status: failed === 0 ? 200 : 500 },
  )
}
