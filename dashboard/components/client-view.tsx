import { Card, CardHead, Row, StatTile } from './primitives'
import { SignOut } from './sign-out'
import type { Matter } from '@/lib/data/types'
import { daysBetween } from '@/lib/data/matters'

/**
 * The client portal.
 *
 * 🔴 IT OPENS ON WHAT THE CLIENT OWES US, not on a tidy completed timeline.
 *
 * D-34 found the practice's real pain is dormancy — files sat 16 and 71 days
 * waiting on documents from the client. M5a, M8 and route C all exist to chase
 * for paperwork. A portal that opens on "here is what you have already done" is
 * decorative. One that opens on "here is what we are still waiting for, and by
 * when" is the same chase, delivered by the client's own curiosity instead of a
 * consultant's afternoon.
 *
 * ⛔ NO PREDICTED DECISION DATE, anywhere. On a registered agent's own portal a
 * processing-time estimate reads as a commitment, and nobody at Yale controls
 * Department timeframes.
 *
 * ⛔ NO SECTION 56 DEADLINE. It is a legal instrument the RMA explains with the
 * letter in hand. A date appearing unannounced on a portal is how a client
 * panics — or acts on it themselves.
 */
export function ClientView({ matter, today, live = false }: {
  matter: Matter | null; today: Date; live?: boolean
}) {
  // Reachable if staff link a login to a code that later closes. Say something
  // human, not "no rows".
  if (!matter) {
    return (
      <Card className="mt-4">
        <CardHead title="We could not find your file" />
        <p className="text-[13px] text-ink-2">
          Your login is not currently linked to an open application. Please contact your
          consultant and they will sort it out.
        </p>
      </Card>
    )
  }

  const owed = (matter.docs_outstanding ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)
  const expiryLeft = matter.visa_expiry ? -(daysBetween(matter.visa_expiry, today) ?? 0) : null

  return (
    <>
      {owed.length > 0 ? (
        <section className="mt-4 rounded-card overflow-hidden border"
                 style={{ background:'var(--warn-soft)',
                          borderColor:'color-mix(in srgb, var(--warn) 34%, transparent)' }}>
          <header className="px-4 pt-3.5 pb-3 border-b"
                  style={{ borderColor:'color-mix(in srgb, var(--warn) 24%, transparent)' }}>
            <h2 className="text-[15px]"
                style={{ color:'color-mix(in srgb, var(--warn) 80%, var(--ink))' }}>
              What we still need from you
            </h2>
            <p className="text-xs font-semibold mt-0.5"
               style={{ color:'color-mix(in srgb, var(--warn) 80%, var(--ink))' }}>
              {owed.length} {owed.length === 1 ? 'item' : 'items'} outstanding
            </p>
          </header>
          <ul className="px-4 py-1.5">
            {owed.map((doc) => (
              <li key={doc} className="flex gap-3 items-start py-2.5 min-h-[44px] border-b last:border-b-0"
                  style={{ borderColor:'color-mix(in srgb, var(--warn) 18%, transparent)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                     className="mt-px shrink-0">
                  <circle cx="10" cy="10" r="8" stroke="var(--warn)" strokeWidth="1.5" />
                  <path d="M10 6v4.5M10 13.6v.1" stroke="var(--warn)" strokeWidth="1.8"
                        strokeLinecap="round" />
                </svg>
                <span className="text-[14px] font-medium">{doc}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mt-4 rounded-card border border-rule bg-card p-4">
          <h2 className="text-[15px]">Nothing needed from you</h2>
          <p className="text-[13px] text-ink-2 mt-1">
            Everything we asked for has arrived. Your file is with your agent.
          </p>
        </section>
      )}

      {/* 🔑 The shared demo carries these two buttons and the app did not, so a
          client shown the demo would have found the real thing could do less.
          Both are mailto/tel — honest about what they are. ⛔ Deliberately NOT
          an upload button: the app does not write, and offering a control that
          silently does nothing is worse than not offering it. */}
      <div className="flex flex-wrap gap-2.5 mt-3.5">
        <a href={`mailto:info@yalemigration.com.au?subject=${encodeURIComponent(
              `Documents for ${matter.client_code}`)}`}
           className="flex-1 min-w-[170px] min-h-[48px] flex items-center justify-center
                      rounded-xl text-white font-semibold text-[14.5px]"
           style={{ background: 'var(--accent)' }}>
          Email my documents
        </a>
        <a href="tel:+61405268738"
           className="flex-1 min-w-[170px] min-h-[48px] flex items-center justify-center
                      rounded-xl border border-rule-strong bg-card text-accent
                      font-semibold text-[14.5px]">
          Call Yale
        </a>
      </div>

      <div className="rounded-card border border-rule bg-card p-4 mt-3.5">
        <h3 className="text-[14px]">What happens next</h3>
        <p className="text-[13px] text-ink-2 mt-1">
          {owed.length > 0
            ? 'As soon as those documents arrive, your agent reviews the file and lodges it with the Department. We will email you the moment it is lodged.'
            : 'Your agent is reviewing the file. Once that is done it is lodged with the Department, and we will email you the same day.'}
        </p>
        <p className="text-[11.5px] text-ink-3 mt-2">
          We do not control Department processing times, so we never quote a decision date.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 my-3.5">
        <StatTile label="Your visa" value={matter.visa_type ?? '—'} sub={matter.client_code} />
        <StatTile label="Stage" value={matter.processing_stage ?? '—'}
                  sub={owed.length ? 'waiting on you' : 'with your agent'}
                  tone={owed.length ? 'warn' : 'neutral'} />
        <StatTile label="Documents" value={owed.length ? `${owed.length} needed` : 'All received'}
                  sub={owed.length ? 'see the list above' : 'nothing outstanding'}
                  tone={owed.length ? 'warn' : 'good'} />
        {expiryLeft !== null && (
          <StatTile label="Current visa expires"
                    value={expiryLeft < 0 ? 'Expired' : `${expiryLeft} days`}
                    sub={expiryLeft < 0 ? 'contact us today' : 'renewal in progress'}
                    tone={expiryLeft <= 14 ? 'crit' : expiryLeft <= 30 ? 'warn' : 'neutral'} />
        )}
      </div>

      {/* A client may open this on a shared or borrowed machine. */}
      {live && (
        <div className="flex justify-end mb-2 -mt-1">
          <SignOut live={live} />
        </div>
      )}

      <Card>
        <CardHead title="Your consultant" tag={matter.office}
                  hint="Who to contact about this file." />
        <Row tone="accent" title={matter.consultant ?? 'Your Yale consultant'}
             meta="Assigned consultant" />
        {/* The MARN is not decoration — a client is entitled to know which
            registered agent is responsible for their matter. */}
        <Row tone="accent" title="Robinder Pal Singh"
             meta="Registered Migration Agent · MARN 1573959" />
        {/* ⚠️ Rows, not inline text. As links inside a paragraph these were 15px
            tall — a phone number you cannot reliably tap is decoration, and the
            client reading this is almost certainly on a phone. */}
        <div className="mt-3 pt-3 border-t border-rule flex flex-col">
          <a href="mailto:info@yalemigration.com.au"
             className="min-h-[44px] flex items-center gap-2.5 text-[13.5px] font-medium
                        -mx-1.5 px-1.5 rounded-md hover:bg-[var(--card-sunk)]">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                 className="text-ink-3 shrink-0">
              <rect x="2" y="4.5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2.8 5.8L10 11l7.2-5.2" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            info@yalemigration.com.au
          </a>
          <a href="tel:+61405268738"
             className="min-h-[44px] flex items-center gap-2.5 text-[13.5px] font-medium
                        -mx-1.5 px-1.5 rounded-md hover:bg-[var(--card-sunk)]">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                 className="text-ink-3 shrink-0">
              <path d="M4.5 3.5h3l1.2 3-1.8 1.3a10 10 0 004.3 4.3l1.3-1.8 3 1.2v3a1.5 1.5 0 01-1.7 1.5
                       A13 13 0 013 5.2 1.5 1.5 0 014.5 3.5z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            0405 268 738
          </a>
          <p className="text-[12px] text-ink-3 mt-1.5">Monday to Friday, 9am – 5:30pm</p>
        </div>
      </Card>
    </>
  )
}
