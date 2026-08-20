'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Magic-link sign-in. No passwords, deliberately.
 *
 * Their estate already carries ~1,200 plaintext credentials including
 * ImmiAccount logins (A-18). Adding ~150 new client passwords to that would be
 * actively irresponsible — and a client who never sets a password cannot leak,
 * reuse or forget one.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    // 🔴 ALWAYS reports "sent", even when the address is unknown.
    // Distinguishing them turns this form into an oracle that confirms whether
    // a given person is a client of an immigration practice — which for people
    // with visa or protection matters can be genuinely unsafe information.
    setState('sent')
  }

  return (
    <main className="min-h-dvh grid place-items-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-[22px]">Yale Migration</h1>
        <p className="text-[13px] text-ink-3 mt-1">
          Sign in to see your application.
        </p>

        {state === 'sent' ? (
          <div className="mt-6 rounded-card border border-rule bg-card p-4">
            <h2 className="text-[15px]">Check your email</h2>
            <p className="text-[13px] text-ink-2 mt-1.5">
              If <b>{email}</b> is on a Yale file, a sign-in link is on its way. It works once
              and expires shortly.
            </p>
            <p className="text-[12px] text-ink-3 mt-2.5">
              Nothing arrived? Check spam, then contact your consultant — some files do not have
              an email address recorded yet.
            </p>
          </div>
        ) : (
          <form onSubmit={send} className="mt-6 flex flex-col gap-3">
            <label htmlFor="email" className="text-[13px] font-medium">Email address</label>
            <input
              id="email" type="email" required autoComplete="email" inputMode="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[48px] px-3.5 rounded-lg border border-rule-strong bg-card
                         text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button type="submit" disabled={state === 'sending'}
              className="min-h-[48px] rounded-lg bg-[var(--accent)] text-white font-semibold
                         text-[15px] disabled:opacity-60">
              {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
            </button>
            <p className="text-[12px] text-ink-3">
              We use a one-time link instead of a password, so there is no password to remember
              or lose.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
