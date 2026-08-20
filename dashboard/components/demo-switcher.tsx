'use client'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * ⚠️ DEMO ONLY. Rendered when no Supabase project is configured.
 *
 * In live mode a person's role comes from their `profiles` row and RLS enforces
 * it — there is no switcher, because a control the viewer can toggle is not a
 * control. This exists so the design can be walked through without provisioning
 * four logins, and it disappears the moment a real project is connected.
 */
const ROLES = [
  ['director', 'Director'], ['brisbane', 'Brisbane manager'],
  ['townsville', 'Townsville manager'], ['client', 'Client'],
] as const

export function DemoSwitcher({ current }: { current: string }) {
  const router = useRouter()
  const params = useSearchParams()

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[.09em] uppercase text-ink-3 font-semibold">
        Signed in as
      </span>
      <div className="flex bg-card-sunk border border-rule rounded-lg p-[3px] gap-0.5"
           role="group" aria-label="Preview a role">
        {ROLES.map(([key, label]) => {
          const on = current === key
          return (
            <button key={key} type="button" aria-pressed={on}
              onClick={() => {
                const next = new URLSearchParams(params.toString())
                next.set('as', key)
                router.push(`?${next.toString()}`)
              }}
              className={`text-[12.5px] px-3 py-1.5 rounded-md whitespace-nowrap min-h-[34px] transition-colors
                ${on ? 'bg-card text-accent font-semibold shadow-card' : 'text-ink-2 hover:text-ink font-medium'}`}>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
