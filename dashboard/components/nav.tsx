import Link from 'next/link'
import { YaleMark } from './brand'

/** Top navigation. Staff only — a client has one page and needs no wayfinding. */
export function Nav({ current, as }: { current: 'board' | 'clients' | 'enquiries'; as?: string }) {
  const q = as ? `?as=${as}` : ''
  const items = [
    ['board', 'Board', `/dashboard${q}`],
    ['clients', 'Clients', `/dashboard/clients${q}`],
    ['enquiries', 'Enquiries', `/dashboard/enquiries${q}`],
  ] as const
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between
                    pb-3.5 mb-1 border-b border-rule">
      <YaleMark />
      <div className="flex gap-1">
        {items.map(([key, label, href]) => (
          <Link key={key} href={href} aria-current={current === key ? 'page' : undefined}
            className={`text-[13.5px] px-3.5 min-h-[40px] flex items-center rounded-lg transition-colors
              ${current === key
                ? 'bg-[var(--accent-soft)] text-accent font-semibold'
                : 'text-ink-2 hover:text-ink hover:bg-[var(--card-sunk)]'}`}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
