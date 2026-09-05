'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/brand'

/**
 * IDENTIFIER-FIRST SIGN-IN, WITH A 6-DIGIT CODE RATHER THAN A LINK.
 *
 * One field. The address decides the method: a Yale address continues with
 * Google, anything else gets a code by email. The visitor is never asked to
 * classify themselves (D-449).
 *
 * 🔴 WHY A CODE AND NOT A MAGIC LINK (D-452). A link must be *opened*, and the
 * thing that opens it is whatever the email client hands it to — frequently a
 * different browser from the one that asked, sometimes an in-app webview, and
 * on a shared office machine sometimes a different person's session entirely.
 * The link then lands in a browser with no pending sign-in and fails in a way
 * nobody can explain. A code travels in the person's eyes: they read it, they
 * type it **into the tab they already have open**, and the session is created
 * where they are standing.
 *
 * ⚠️ Clients here are visa applicants, often on a phone, often not confident
 * with computers, and the failure mode of a link is "nothing happened". That is
 * the worst possible experience to hand someone waiting on a visa.
 *
 * ⛔ REQUIRES A SUPABASE TEMPLATE CHANGE, or the email still contains a link:
 *    Authentication → Emails → Magic Link → use `{{ .Token }}`, not
 *    `{{ .ConfirmationURL }}`. Supabase's own wording: *"Modify the template to
 *    include the {{ .Token }} variable."* The code and the template are one
 *    change in two places; shipping either alone leaves sign-in broken.
 *
 * Passwords remain deliberately absent. Their estate already carries ~1,200
 * plaintext credentials including ImmiAccount logins (A-18); a password never
 * set cannot be leaked, reused or forgotten.
 */

const STAFF_DOMAIN = 'yalemigration.com.au'
const isStaff = (email: string) =>
  email.trim().toLowerCase().endsWith(`@${STAFF_DOMAIN}`)

const CODE_LENGTH = 6

type Step = 'email' | 'code'
type Busy = 'no' | 'sending' | 'verifying'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep]   = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode]   = useState('')
  const [busy, setBusy]   = useState<Busy>('no')
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  async function requestCode(address: string) {
    // 🔴 try/catch, not just an ignored error object. `signInWithOtp` REJECTS on
    // a network failure or a missing Supabase config — it does not return
    // `{ error }` — and an unhandled rejection here took the whole submit
    // handler down: `setStep('code')` never ran and the button span "Sending
    // your code…" forever, with no message and no way back. Caught by the e2e
    // suite, which has no Supabase to talk to and so hit the failure path on
    // every run — the one environment guaranteed to reproduce it.
    try {
      const supabase = createClient()
      await supabase.auth.signInWithOtp({
        email: address,
        options: {
        // 🔴 Without this, ANY address that touched this form got a working
        // account. Signup is disabled in config.toml, but that governs the
        // dashboard's own signup flow — not signInWithOtp, which happily
        // creates a user. Staff invite people; the form does not.
          shouldCreateUser: false,
        },
      })
    } catch {
      // Deliberately swallowed, for the same reason the result is ignored
      // below: the caller always advances to the code screen.
    }
    // 🔴 The result is deliberately NOT inspected. Reporting "no such account"
    // would turn this form into an oracle confirming whether a given person is
    // a client of an immigration practice — which, for someone with a
    // protection or partner matter, can be genuinely unsafe information in the
    // wrong hands. Everyone is shown the code screen.
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy !== 'no') return
    setError(null)
    setBusy('sending')

    if (isStaff(email)) {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { login_hint: email.trim(), hd: STAFF_DOMAIN },
        },
      })
      // 🔴 On success the browser NAVIGATES AWAY, so nothing below runs.
      // Reaching here means it failed — most often "provider is not enabled".
      if (error) { setError('We could not start Google sign-in. Please try again.'); setBusy('no') }
      return
    }

    await requestCode(email.trim())
    setBusy('no')
    setStep('code')
  }

  async function onCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy !== 'no') return
    setError(null)
    setBusy('verifying')

    const { error } = await createClient().auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })

    if (error) {
      // ⚠️ One message for every failure — wrong code, expired code, and an
      // address with no account are indistinguishable here ON PURPOSE, for the
      // same oracle reason as above.
      setError('That code did not work. It may have expired — request a new one below.')
      setBusy('no')
      setCode('')
      return
    }

    // 🔑 refresh() before push(): the server components read the session from
    // cookies, and without it the dashboard renders once as a signed-out user.
    router.refresh()
    router.push('/dashboard')
  }

  if (step === 'code') {
    return (
      <AuthShell>
        <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
             style={{ background: 'var(--gold-soft)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="5" width="19" height="14" rx="2.5"
                  stroke="var(--gold)" strokeWidth="1.7" />
            <path d="M3.5 7l8.5 6 8.5-6" stroke="var(--gold)" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-[26px] leading-tight">Enter your code</h1>
        <p className="text-[14px] text-ink-2 mt-3 leading-relaxed">
          If <b className="text-ink">{email}</b> is on a Yale file, a {CODE_LENGTH}-digit code is on
          its way. It works once and expires shortly.
        </p>

        <form onSubmit={onCodeSubmit} className="flex flex-col gap-2.5 mt-6">
          <label htmlFor="code" className="text-[13px] font-medium text-ink-2">
            {CODE_LENGTH}-digit code
          </label>
          <input
            id="code" name="code" required autoFocus
            inputMode="numeric" pattern="[0-9]*" maxLength={CODE_LENGTH}
            // 🔑 Lets the phone offer the code straight from the notification,
            // which is most of the reason a code beats a link on mobile.
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); if (error) setError(null) }}
            placeholder="123456"
            className="min-h-[54px] px-4 rounded-xl border border-rule-strong bg-card
                       text-[22px] tracking-[.4em] font-semibold text-center
                       transition-colors focus:outline-none focus:border-[var(--navy)]
                       focus:ring-4 focus:ring-[var(--navy)]/10"
          />
          <button type="submit" disabled={busy !== 'no' || code.length < CODE_LENGTH}
            className="mt-1.5 min-h-[50px] rounded-xl text-white font-semibold text-[15px]
                       transition-opacity disabled:opacity-45 disabled:cursor-not-allowed
                       hover:opacity-95"
            style={{ background: 'var(--navy)' }}>
            {busy === 'verifying' ? 'Checking…' : 'Sign in'}
          </button>
        </form>

        {error && (
          <div role="alert" className="mt-4 p-4 rounded-card border border-rule bg-card">
            <p className="text-[13px] text-ink-2">{error}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button type="button" disabled={busy !== 'no'}
            onClick={async () => { setBusy('sending'); await requestCode(email.trim()); setBusy('no'); setResent(true) }}
            className="text-[13.5px] font-medium text-[var(--navy)] underline underline-offset-4
                       min-h-[44px] text-left disabled:opacity-45">
            {resent ? 'Code sent again' : 'Send a new code'}
          </button>
          <button type="button"
            onClick={() => { setStep('email'); setCode(''); setError(null); setResent(false) }}
            className="text-[13.5px] font-medium text-ink-2 underline underline-offset-4
                       min-h-[44px] text-left">
            Use a different address
          </button>
        </div>

        <p className="text-[12.5px] text-ink-3 mt-6 leading-relaxed">
          Nothing arrived? Check your spam folder, then contact your consultant — some files do not
          have an email address recorded yet.
        </p>

        <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
          Yale Migration and Education Consultants · Robinder Pal Singh, MARN 1573959
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="text-[26px] leading-tight">Sign in</h1>
      <p className="text-[14px] text-ink-2 mt-2">
        See where your application is up to.
      </p>

      <form onSubmit={onEmailSubmit} className="flex flex-col gap-2.5 mt-7">
        <label htmlFor="email" className="text-[13px] font-medium text-ink-2">
          Email address
        </label>
        <input
          id="email" type="email" required autoComplete="email" inputMode="email"
          autoFocus value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(null) }}
          placeholder="you@example.com"
          aria-describedby="signin-help"
          className="min-h-[50px] px-4 rounded-xl border border-rule-strong bg-card text-[15px]
                     transition-colors focus:outline-none focus:border-[var(--navy)]
                     focus:ring-4 focus:ring-[var(--navy)]/10"
        />
        <button type="submit" disabled={busy !== 'no' || !email}
          className="mt-1.5 min-h-[50px] rounded-xl text-white font-semibold text-[15px]
                     transition-opacity disabled:opacity-45 disabled:cursor-not-allowed
                     hover:opacity-95"
          style={{ background: 'var(--navy)' }}>
          {busy === 'sending'
            ? (isStaff(email) ? 'Taking you to Google…' : 'Sending your code…')
            : 'Continue'}
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-4 p-4 rounded-card border border-rule bg-card">
          <p className="text-[13px] text-ink-2">{error}</p>
        </div>
      )}

      {/* 🔑 Describes what will happen rather than asking the visitor to choose. */}
      <p id="signin-help" className="text-[12.5px] text-ink-3 mt-4 leading-relaxed">
        A <b className="text-ink-2">@{STAFF_DOMAIN}</b> address continues with your work Google
        account. Any other address gets a {CODE_LENGTH}-digit code by email — no password to
        remember, and nothing to lose.
      </p>

      <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
        Yale Migration and Education Consultants · Robinder Pal Singh, MARN 1573959
      </p>
    </AuthShell>
  )
}
