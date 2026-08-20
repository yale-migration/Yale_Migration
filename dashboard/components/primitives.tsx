import type { ReactNode } from 'react'
import Link from 'next/link'

/** Severity, named once. Every status colour in the app resolves through here. */
export type Tone = 'good' | 'warn' | 'crit' | 'neutral' | 'accent'

const TONE_BG: Record<Tone, string> = {
  good: 'bg-[var(--good-soft)]', warn: 'bg-[var(--warn-soft)]',
  crit: 'bg-[var(--crit-soft)]', neutral: 'bg-[var(--card-sunk)]',
  accent: 'bg-[var(--accent-soft)]',
}
const TONE_FG: Record<Tone, string> = {
  good: 'text-[var(--good)]', warn: 'text-[color-mix(in_srgb,var(--warn)_78%,var(--ink))]',
  crit: 'text-[var(--crit)]', neutral: 'text-[var(--ink-3)]', accent: 'text-[var(--accent)]',
}
const TONE_RAIL: Record<Tone, string> = {
  good: 'bg-[var(--good)]', warn: 'bg-[var(--warn)]', crit: 'bg-[var(--crit)]',
  neutral: 'bg-[var(--rule-strong)]', accent: 'bg-[var(--accent)]',
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-rule rounded-card p-4 min-w-0 ${className}`}>
      {children}
    </section>
  )
}

export function CardHead({ title, tag, hint }: { title: string; tag?: string; hint?: string }) {
  return (
    <>
      <div className="flex justify-between items-baseline gap-3">
        <h2 className="text-[15px]">{title}</h2>
        {tag && (
          <span className="text-[10.5px] tracking-[.06em] uppercase text-ink-3 font-semibold">
            {tag}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-ink-3 mt-1 mb-4">{hint}</p>}
    </>
  )
}

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`text-[11.5px] font-semibold px-2.5 py-[3px] rounded-full whitespace-nowrap ${TONE_BG[tone]} ${TONE_FG[tone]}`}>
      {children}
    </span>
  )
}

/**
 * A row in an attention list.
 *
 * The coloured rail carries severity, but it is NEVER the only carrier — the
 * chip repeats it in words. About 1 in 12 men has a colour vision deficiency,
 * and this is a screen someone triages a legal deadline from.
 */
export function Row({ tone, title, meta, chip, href }: {
  tone: Tone; title: ReactNode; meta?: ReactNode; chip?: ReactNode; href?: string
}) {
  const inner = (
    <>
      <span className={`w-[3px] h-[26px] rounded-sm ${TONE_RAIL[tone]}`} aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium truncate">{title}</div>
        {meta && <div className="text-[11.5px] text-ink-3 mt-px truncate">{meta}</div>}
      </div>
      {chip}
      {href && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"
             className="text-ink-3 shrink-0">
          <path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )
  // A row that is not a link keeps its old shape exactly — no chevron column,
  // no hover state promising something that will not happen.
  const cols = href ? 'grid-cols-[3px_1fr_auto_15px]' : 'grid-cols-[3px_1fr_auto]'
  const base = `grid ${cols} gap-3 items-center py-2.5 border-b border-rule last:border-b-0`

  if (!href) return <div className={base}>{inner}</div>
  return (
    // ⚠️ min-h-[44px]: this is now a tap target, and staff use this on phones.
    <Link href={href}
          className={`${base} min-h-[44px] -mx-2 px-2 rounded-md transition-colors
                      hover:bg-[var(--card-sunk)] focus-visible:bg-[var(--card-sunk)]`}>
      {inner}
    </Link>
  )
}

/**
 * 🔴 An empty state must SAY WHAT EMPTY MEANS.
 *
 * A blank box is a bug the user has to diagnose: is nothing overdue, or did the
 * thing fail to load? On a dashboard a practice owner uses to decide nobody
 * needs chasing, those two are worlds apart — and this project has already
 * shipped a report that rendered a broken formula and a correct empty result
 * identically (D-292..296).
 */
export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-ink-3 text-[13px]">{children}</p>
}

export function StatTile({ label, value, sub, tone = 'neutral' }: {
  label: string; value: ReactNode; sub?: string; tone?: Tone
}) {
  const alert = tone === 'crit' || tone === 'warn'
  return (
    <div className={`rounded-card border p-3.5 ${alert ? `${TONE_BG[tone]} border-transparent` : 'bg-card border-rule'}`}>
      <div className={`text-[10.5px] tracking-[.07em] uppercase font-semibold ${alert ? TONE_FG[tone] : 'text-ink-3'}`}>
        {label}
      </div>
      <div className={`font-serif text-[30px] leading-tight mt-1.5 num ${alert ? TONE_FG[tone] : ''}`}>
        {value}
      </div>
      {sub && <div className="text-[11.5px] text-ink-3 mt-0.5">{sub}</div>}
    </div>
  )
}
