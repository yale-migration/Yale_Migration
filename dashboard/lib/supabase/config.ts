/**
 * Is a real Supabase project configured?
 *
 * With no URL the app serves synthetic fixtures instead of connecting. That is
 * deliberate and it is the ONLY supported way to run this on a laptop: this
 * schema holds visa applicant PII, and company policy keeps that inside
 * company-controlled systems. A developer machine is not one.
 *
 * ⚠️ It fails toward DEMO, never toward a broken live connection — a
 * half-configured app that silently returns empty tables looks exactly like a
 * practice with no clients.
 */
export const isLive = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const publicConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
})
