'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/brand'

/**
 * Magic-link sign-in. No passwords, deliberately.
 *
 * Their estate already carries ~1,200 plaintext credentials including
 * ImmiAccount logins (A-18). Adding ~150 client passwords to that would be
 * actively irresponsible — and a password never set cannot be leaked, reused
 * or forgotten.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function signInWithGoogle() {
    await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
        <button onClick={() => setState('idle')}
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

      {/* 🔑 "No new login if avoidable" (his non-functional ask). Staff already
          have a Google account on the Yale domain — for them there is no new
          login at all. Clients have none, which is exactly why Looker could not
          serve them, so they keep the magic link. Honouring the ask for the half
          where it is possible beats treating the other half as an excuse. */}
      <button type="button" onClick={signInWithGoogle}
        className="mt-7 w-full min-h-[50px] rounded-xl border border-rule-strong bg-card
                   font-semibold text-[15px] flex items-center justify-center gap-2.5
                   transition-colors hover:bg-[var(--card-sunk)]">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.5h4.8a4.1 4.1 0 01-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.6z"/>
          <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 009 18z"/>
          <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 010-3.4V5H.9a9 9 0 000 8l3-2.3z"/>
          <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 00.9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <span className="h-px flex-1 bg-rule" />
        <span className="text-[12px] text-ink-3">or, if you are a client</span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      <form onSubmit={send} className="flex flex-col gap-2.5">
        <label htmlFor="email" className="text-[13px] font-medium text-accent hover:underline underline-offset-4">Email address</label>
        <input
          id="email" type="email" required autoComplete="email" inputMode="email"
          autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-h-[50px] px-4 rounded-xl border border-rule-strong bg-card text-[15px]
                     transition-colors focus:outline-none focus:border-[var(--navy)]
                     focus:ring-4 focus:ring-[var(--navy)]/10"
        />
        <button type="submit" disabled={state === 'sending' || !email}
          className="mt-1.5 min-h-[50px] rounded-xl text-white font-semibold text-[15px]
                     transition-opacity disabled:opacity-45 disabled:cursor-not-allowed
                     hover:opacity-95"
          style={{ background: 'var(--navy)' }}>
          {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
        </button>
      </form>

      <p className="text-[12.5px] text-ink-3 mt-4 leading-relaxed">
        Yale staff sign in with their work Google account. Clients get a one-time link instead of
        a password — nothing to remember, and nothing to lose.
      </p>

      <p className="text-[12px] text-ink-3 mt-8 pt-5 border-t border-rule">
        Yale Migration and Education Consultants · Robinder Pal Singh, MARN 1573959
      </p>
    </AuthShell>
  )
}
