import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main" className="max-w-[560px] mx-auto px-5 py-20">
      <h1 className="text-[24px]">Page not found</h1>
      <p className="text-[14px] text-ink-2 mt-2.5">
        That address does not exist. It may have been mistyped, or the link may be out of date.
      </p>
      <Link href="/dashboard"
        className="inline-flex items-center min-h-[46px] px-5 mt-6 rounded-xl text-white
                   font-semibold text-[14.5px]" style={{ background: 'var(--accent)' }}>
        Back to the board
      </Link>
    </main>
  )
}
