import Link from 'next/link'
import { YaleMark } from './brand'
import { SignOut } from './sign-out'

/** Top navigation. Staff only — a client has one page and needs no wayfinding. */
export function Nav({ current, as, live = false }: {
  current: 'board' | 'clients' | 'enquiries'; as?: string; live?: boolean
}) {
  const q = as ? `?as=${as}` : ''
  const items = [
    ['board', 'Board', `/dashboard${q}`],
    ['clients', 'Clients', `/dashboard/clients${q}`],
    ['enquiries', 'Enquiries', `/dashboard/enquiries${q}`],
  ] as const
  // Sticky: the board scrolls well past this, and losing the way back to
  // Clients halfway down a list is how people start using the back button as
  // navigation. print-hide because a printed page needs no nav.
  return (
    <div className="sticky top-0 z-30 -mx-5 mb-1 border-b border-rule
                    bg-[var(--paper)]/95 backdrop-blur print-hide
                    supports-[backdrop-filter]:bg-[var(--paper)]/80">
      {/* Full-bleed backdrop, capped inner row. The bar itself was 1240px wide,
          so on a wide monitor the page scrolled up its outside edges. */}
      <nav className="max-w-[1240px] mx-auto px-5 pt-4 pb-3.5 flex flex-wrap items-center
                      gap-x-6 gap-y-3 justify-between">
      <YaleMark />
      <div className="flex gap-1 items-center">
        {items.map(([key, label, href]) => (
          <Link key={key} href={href} aria-current={current === key ? 'page' : undefined}
            className={`text-[13.5px] px-3.5 min-h-[44px] flex items-center rounded-lg transition-colors
              ${current === key
                ? 'bg-[var(--accent-soft)] text-accent font-semibold'
                : 'text-ink-2 hover:text-ink hover:bg-[var(--card-sunk)]'}`}>
            {label}
          </Link>
        ))}
        <span className="w-px h-5 bg-rule mx-1.5" aria-hidden="true" />
        <SignOut live={live} />
      </div>
      </nav>
    </div>
  )
}
