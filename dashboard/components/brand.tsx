/**
 * The brand surfaces — what a CLIENT sees before they are inside the product.
 *
 * These pages had no brand on them at all: bare text, left-aligned, on flat
 * grey. For a staff tool that is merely plain. For the first screen a visa
 * applicant sees from their migration agent it is worse than plain — people
 * hand these firms their passport and their future, and a sign-in page that
 * looks unfinished reads as a firm that is unfinished.
 *
 * ⚠️ Navy and gold are matched by eye from yalemigration.com.au, which does not
 * publish its hex values. Replace them from Robinder's logo file before this
 * reaches a real client — a brand colour that is nearly right looks careless in
 * a way an obviously different one does not.
 */

/** The wordmark. Drawn, not an image file — we do not hold their logo asset. */
export function YaleMark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="7" fill="var(--navy)" />
        {/* a path opening outward — their line is "limitless opportunities" */}
        <path d="M10 23V15.5L17 11l7 4.5V23" stroke="var(--gold)" strokeWidth="1.9"
              strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 23v-5" stroke="var(--gold)" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        {/* ⛔ --brand-ink, NOT --navy. This sits on the themed surface, so it has
            to invert; --navy does not and rendered at 1.2:1 in dark mode (D-390). */}
        <div className="font-serif text-[17px] font-semibold text-[var(--brand-ink)]">Yale Migration</div>
        <div className="text-[11px] tracking-[.08em] uppercase text-ink-3">
          Education Consultants
        </div>
      </div>
    </div>
  )
}

/**
 * Two-column shell: brand on the left, the actual task on the right.
 *
 * ⚠️ The left panel is decoration and collapses below `lg`. The task column is
 * never the one that disappears — a client opening a sign-in link on a phone
 * gets the form, immediately, not a hero they have to scroll past.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="hidden lg:flex flex-col justify-between p-12 text-white
                        bg-[var(--navy)] relative overflow-hidden">
        {/* soft depth, no gradient wash */}
        <div aria-hidden="true"
             className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full opacity-[.07]"
             style={{ background: 'var(--gold)' }} />
        <div aria-hidden="true"
             className="absolute -left-32 bottom-[-140px] w-[380px] h-[380px] rounded-full opacity-[.05]"
             style={{ background: '#fff' }} />

        <div className="relative flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <rect width="34" height="34" rx="7" fill="rgba(255,255,255,.1)" />
            <path d="M10 23V15.5L17 11l7 4.5V23" stroke="var(--gold)" strokeWidth="1.9"
                  strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 23v-5" stroke="var(--gold)" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
          <div className="leading-tight">
            <div className="font-serif text-[17px] font-semibold">Yale Migration</div>
            <div className="text-[11px] tracking-[.08em] uppercase text-white/55">
              Education Consultants
            </div>
          </div>
        </div>

        <div className="relative max-w-[420px]">
          {/* their own line, from their site — not copy we invented for them */}
          <h2 className="font-serif text-[34px] leading-[1.15] text-white">
            Your future.<br />Our expertise.<br />
            <span className="text-[var(--gold)]">Limitless opportunities.</span>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-white/70">
            Track your application, see exactly what we still need from you, and know who is
            handling your file — without waiting on a phone call.
          </p>
        </div>

        <div className="relative text-[11.5px] text-white/45">
          Robinder Pal Singh · Registered Migration Agent, MARN 1573959
        </div>
      </aside>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[400px] mx-auto">
          <YaleMark className="lg:hidden mb-9" />
          {children}
        </div>
      </section>
    </main>
  )
}
