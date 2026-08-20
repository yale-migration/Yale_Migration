import { Card, CardHead } from './primitives'
import type { Matter } from '@/lib/data/types'
import { outcomes } from '@/lib/data/matters'

/** View 4 of the seven he named: granted vs refused. */
export function OutcomesCard({ matters }: { matters: Matter[] }) {
  const o = outcomes(matters)
  const colour: Record<string, string> = {
    Granted: 'var(--good)', Refused: 'var(--crit)', Withdrawn: 'var(--ink-3)',
  }
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHead title="Outcomes" tag="decided matters"
                hint="Pending matters are excluded — an undecided file is not a result." />
      {o.decided === 0 ? (
        // 🔴 null, never 0%. A practice that has decided nothing has no grant
        // rate; printing "0% granted" would be a libel on their own numbers.
        <p className="py-6 text-center text-[13px] text-ink-3">
          Nothing has been decided yet, so there is no grant rate to show.
        </p>
      ) : (
        <>
          <div className="flex items-baseline gap-2.5 mb-3.5">
            <b className="font-serif text-[34px] leading-none num">{o.rate}%</b>
            <span className="text-[12.5px] text-ink-3">
              granted · {o.decided} decided
            </span>
          </div>
          <div className="flex h-[26px] rounded-md overflow-hidden gap-0.5 bg-card-sunk">
            {o.rows.map(([name, n]) => (
              <div key={name} title={`${name} — ${n}`}
                   style={{ flexGrow: n, background: colour[name] ?? 'var(--rule-strong)' }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 mt-3">
            {o.rows.map(([name, n]) => (
              <span key={name} className="text-[12px] text-ink-2 inline-flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-sm inline-block"
                   style={{ background: colour[name] ?? 'var(--rule-strong)' }} />
                {name} {n}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
