import { timingSafeEqual } from 'node:crypto'

/**
 * 🔴 THE ONLY THING BETWEEN THE PUBLIC INTERNET AND THE SERVICE-ROLE KEY.
 *
 * /api/sync runs with `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS
 * completely. Every access-control guarantee in this app — clients see only
 * their own matter, managers only their branch — is irrelevant on this route.
 * An unguarded /api/sync is a public endpoint that can rewrite the client
 * register.
 *
 * ⛔ THE BUG THIS REPLACES (D-391). The guard was:
 *
 *     if (!secret || (!cron && given !== secret)) return 401
 *
 * `cron` was `request.headers.get('x-vercel-cron')` — so the presence of ANY
 * value in that header short-circuited the secret check entirely.
 * `curl -H 'x-vercel-cron: 1' https://…/api/sync` was authorised. Two ways in,
 * proven by probe before this was written.
 *
 * 🔑 A header supplied by the caller is NOT an authentication factor. Vercel's
 * own documented method for securing a cron route is `CRON_SECRET` in the
 * Authorization header — the header is a hint about origin, never a credential.
 * It is still read here, but only as an extra signal, never as a substitute.
 *
 * The route was returning 503 and doing nothing when this was found, so nothing
 * was ever exposed. It would have become live the moment the Sheets reader
 * landed — which is exactly when nobody would have been re-reading the guard.
 */

/** Constant-time compare. A `!==` on a secret leaks its length and prefix. */
function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a, 'utf8')
  const y = Buffer.from(b, 'utf8')
  // timingSafeEqual throws on length mismatch, which would itself be a signal.
  if (x.length !== y.length) {
    timingSafeEqual(x, x)
    return false
  }
  return timingSafeEqual(x, y)
}

export interface GuardInput {
  secret: string | undefined
  authorization: string | null | undefined
  xVercelCron?: string | null
}

export interface GuardResult {
  ok: boolean
  status: 200 | 401 | 503
  reason: string
}

export function checkSyncAuth({ secret, authorization }: GuardInput): GuardResult {
  // ⛔ Fail CLOSED when unconfigured. An empty SYNC_SECRET must never mean
  // "no authentication required" — that is how a misconfigured deploy becomes
  // an open endpoint, and it reads as working because the cron still succeeds.
  if (!secret) {
    return { ok: false, status: 503, reason: 'SYNC_SECRET is not configured — refusing to run' }
  }
  const given = authorization?.replace(/^Bearer\s+/i, '') ?? ''
  if (!given || !sameSecret(given, secret)) {
    return { ok: false, status: 401, reason: 'not authorised' }
  }
  return { ok: true, status: 200, reason: 'ok' }
}
