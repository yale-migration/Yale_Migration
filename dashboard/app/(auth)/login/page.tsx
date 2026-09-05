'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/brand'

/**
 * IDENTIFIER-FIRST SIGN-IN. One field. The address decides the method.
 *
 * 🔴 WHAT THIS REPLACED, AND WHY IT WAS WRONG (D-449). The page used to show a
 * Google button, then a divider reading **"or, if you are a client"**, then an
 * email field. That asked the visitor to classify themselves before signing in,
 * and it was wrong three times over:
 *
 *   1. It made the user do the routing. They know their email address; they do
 *      not necessarily think of themselves as "a client", and they should never
 *      have to read an org chart to log in.
 *   2. It published the role model on the front door. "Staff go here, clients
 *      go there" tells an unauthenticated visitor how the system is segmented.
 *   3. It punished the wrong guess. Someone picking the wrong branch gets an
 *      error, not a sign-in.
 *
 * The industry pattern for exactly this is **identifier-first**: collect the
 * identifier, then route. Auth0 describes matching the entered domain against a
 * registered connection and redirecting accordingly; login-UX guidance is
 * "one column, identifier-first (email → route)". Google, Slack and Microsoft
 * all work this way.
 *
 * ⛔ Every staff address is on `@yalemigration.com.au` — verified against the
 * real addresses in the docs, not assumed — so the domain is a reliable router.
 * Anyone else is a client and gets a magic link. No labels, no self-selection.
 *
 * Passwords are still deliberately absent. Their estate already carries ~1,200
 * plaintext credentials including ImmiAccount logins (A-18); a password never
 * set cannot be leaked, reused or forgotten.
 */

/** The one domain that means "staff". Lowercase; compared case-insensitively. */
const STAFF_DOMAIN = 'yalemigration.com.au'

const isStaff = (email: string) =>
  email.trim().toLowerCase().endsWith(`@${STAFF_DOMAIN}`)

type State = 'idle' | 'working' | 'sent' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'working') return
    setState('working')
    const supabase = createClient()
    const redirect = `${window.location.origin}/auth/callback`

    if (isStaff(email)) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirect,
          queryParams: {
            // Pre-selects the right account and hides everything else from the
            // chooser — staff are usually signed into a personal Google too.
            login_hint: email.trim(),
            hd: STAFF_DOMAIN,
          },
        },
      })
      // 🔴 On success the browser NAVIGATES AWAY, so nothing after this runs.
      // Reaching here at all means it failed — most commonly "provider is not
      // enabled" in Supabase. The old page ignored the return value entirely
      // and left the user staring at an unchanged screen.
      if (error) setState('error')
      return
    }

    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirect,
        // 🔴 Without this, ANY address that touched this form got a working
        // account. Signup is disabled in config.toml, but that governs the
        // dashboard's own signup flow — not signInWithOtp, which happily
        // creates a user. Staff invite people; the form does not.
        shouldCreateUser: false,
      },
    })
    // 🔴 ALWAYS reports "sent", even for an address we have never seen.
    // Distinguishing them turns this form into an oracle that confirms whether
    // a given person is a client of an immigration practice — which, for
    // someone with a protection or partner matter, can be genuinely unsafe
    // information in the wrong hands.
    setState('sent')
  }

  if (state === 'sent') {
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
        <h1 className="text-[26px] leading-tight">Check your email</h1>
        <p className="text-[14px] text-ink-2 mt-3 leading-relaxed">
          If <b className="text-ink">{email}</b> is on a Yale file, a sign-in link is on its way.
          It works once and expires shortly.
        </p>
        <div className="mt-6 p-4 rounded-card border border-rule bg-card">
          <p className="text-[13px] text-ink-2">
            Nothing arrived? Check your spam folder, then contact your consultant — some files
            do not have an email address recorded yet.
          </p>
        </div>
        <button onClick={() => { setEmail(''); setState('idle') }}
                className="mt-6 text-[13.5px] font-medium text-[var(--navy)] underline
                           underline-offset-4 min-h-[44px]">
          Use a different address
        </button>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="text-[26px] leading-tight">Sign in</h1>
      <p className="text-[14px] text-ink-2 mt-2">
        See where your application is up to.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-2.5 mt-7">
        <label htmlFor="email" className="text-[13px] font-medium text-ink-2">
          Email address
        </label>
        <input
          id="email" type="email" required autoComplete="email" inputMode="email"
          autoFocus value={email} onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
          placeholder="you@example.com"
          aria-describedby="signin-help"
          className="min-h-[50px] px-4 rounded-xl border border-rule-strong bg-card text-[15px]
                     transition-colors focus:outline-none focus:border-[var(--navy)]
                     focus:ring-4 focus:ring-[var(--navy)]/10"
        />
        <button type="submit" disabled={state === 'working' || !email}
          className="mt-1.5 min-h-[50px] rounded-xl text-white font-semibold text-[15px]
                     transition-opacity disabled:opacity-45 disabled:cursor-not-allowed
                     hover:opacity-95"
          style={{ background: 'var(--navy)' }}>
          {state === 'working'
            ? (isStaff(email) ? 'Taking you to Google…' : 'Sending…')
            : 'Continue'}
        </button>
      </form>

      {state === 'error' && (
        <div role="alert" className="mt-4 p-4 rounded-card border border-rule bg-card">
          <p className="text-[13px] text-ink-2">
            We could not start Google sign-in. Please try again, or contact the office if it
            keeps happening.
          </p>
        </div>
      )}

      {/* 🔑 Describes what will happen, rather than asking the visitor to choose.
          A Yale address goes to Google because it already has one; anyone else
          gets a link. Neither reader has to work out which one they are. */}
      <p id="signin-help" className="text-[12.5px] text-ink-3 mt-4 leading-relaxed">
        A <b className="text-ink-2">@{STAFF_DOMAIN}</b> address continues with your work Google
        account. Any other address gets a one-time sign-in link by email — no password to
        remember, and nothing to lose.
      </p>

      <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
        Yale Migration and Education Consultants · Robinder Pal Singh, MARN 1573959
      </p>
    </AuthShell>
  )
}
