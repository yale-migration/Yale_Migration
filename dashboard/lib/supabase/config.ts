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

/**
 * Does the sign-in email carry a 6-DIGIT CODE, or a LINK?
 *
 * 🔴 THIS IS NOT A PREFERENCE — IT IS A FACT ABOUT THE MAILBOX (D-455).
 * Supabase's built-in email service **locks the template**: *"Set up custom
 * SMTP to edit templates."* Until a custom SMTP provider is configured, the
 * Magic Link template cannot be changed to `{{ .Token }}` and every email
 * contains a LINK, whatever the app's UI happens to ask for.
 *
 * ⛔ Shipping the code screen against a link email is a UI that lies: it says
 * "a 6-digit code is on its way" when no code exists, and the person is stuck
 * looking for something that was never sent. **Believing our own intention over
 * the observable behaviour of the system is the pattern this project keeps
 * repeating.**
 *
 * So the UI follows the mailbox. Set `NEXT_PUBLIC_AUTH_OTP=1` at the SAME time
 * as configuring SMTP and switching the template — one flip, both true — and
 * the code screen appears. Default off: the honest state today.
 */
export const otpCodesEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_AUTH_OTP === '1'
