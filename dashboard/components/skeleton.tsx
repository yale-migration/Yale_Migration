/**
 * Loading placeholders.
 *
 * ⚠️ These mirror the SHAPE of what is coming — a stat row, then cards of the
 * right height. A generic spinner tells you to wait; a skeleton tells you what
 * you are waiting for, and the page does not jump when the content lands.
 *
 * ⛔ No shimmer animation. This is a screen someone opens to find out whether a
 * legal deadline has passed; movement on it reads as something happening.
 * `prefers-reduced-motion` is honoured globally, but the better answer here is
 * to not animate at all.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[var(--card-sunk)] rounded ${className}`} aria-hidden="true" />
}

export function BoardSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-5 pb-16" role="status" aria-busy="true">
      <span className="sr-only">Loading the practice board</span>
      <Skeleton className="h-8 w-64 mb-3" />
      <Skeleton className="h-4 w-80 mb-6" />
      <Skeleton className="h-[104px] w-full rounded-card mb-3.5" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2.5 mb-3.5">
        {[0,1,2,3].map((i) => <Skeleton key={i} className="h-[92px] rounded-card" />)}
      </div>
      <div className="grid grid-cols-12 gap-3.5">
        <Skeleton className="col-span-12 h-[200px] rounded-card" />
        <Skeleton className="col-span-12 lg:col-span-6 h-[220px] rounded-card" />
        <Skeleton className="col-span-12 lg:col-span-6 h-[220px] rounded-card" />
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-5 pb-16" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-40 mb-3" />
      <Skeleton className="h-11 w-full rounded-xl mb-3.5" />
      <div className="bg-card border border-rule rounded-card overflow-hidden">
        {[0,1,2,3,4,5].map((i) => (
          <div key={i} className="px-4 py-4 border-b border-rule last:border-b-0">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
