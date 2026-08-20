import { redirect } from 'next/navigation'
import { resolveViewer } from '@/lib/viewer'
import { getMatters } from '@/lib/data/matters'
import { ClientSearch, type ClientFilter } from '@/components/client-search'
import { Nav } from '@/components/nav'

export const metadata = { title: 'Clients · Yale Migration' }
export const dynamic = 'force-dynamic'

export default async function ClientsPage(
  { searchParams }: { searchParams: Promise<{ as?: string; filter?: string }> },
) {
  const sp = await searchParams
  const viewer = await resolveViewer(sp)
  if (!viewer) redirect('/dashboard')
  // A client has exactly one matter and no list to browse. Sending them here
  // would show them a search box over a single row — confusing, and it implies
  // there is something else to find.
  if (viewer.role === 'client') redirect(`/dashboard${sp.as ? `?as=${sp.as}` : ''}`)

  const matters = await getMatters(viewer)
  const allowed: ClientFilter[] = ['all','open','owing','quiet','expiring']
  // ⚠️ Validated against a list, not cast. A junk ?filter= should land on "all"
  // rather than silently matching nothing and reading as an empty practice.
  const filter = (allowed as string[]).includes(sp.filter ?? '')
    ? (sp.filter as ClientFilter) : 'all'

  return (
    <main id="main" className="max-w-[1240px] mx-auto px-5 pt-5 pb-16">
      <Nav current="clients" as={sp.as} />
      <header className="my-4">
        <h1 className="text-[21px]">Clients</h1>
        <p className="text-[12.5px] text-ink-3 mt-1">
          {viewer.role === 'director'
            ? 'Every branch.'
            : `${viewer.office} only — other branches are not returned to this view.`}
          {' '}Search by name, code, visa type or consultant.
        </p>
      </header>
      <ClientSearch matters={matters} as={sp.as} initial={filter} today={new Date()} />
    </main>
  )
}
