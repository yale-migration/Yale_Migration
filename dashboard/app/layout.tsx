import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yale Migration — Practice Board',
  description: 'Client and staff dashboard for Yale Migration and Education Consultants.',
  // ⛔ This renders client PII. Keep it out of every index.
  robots: { index: false, follow: false, nocache: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        {/* Keyboard users otherwise tab through the whole nav on every page
            before reaching the content. Visible only when focused. */}
        <a href="#main"
           className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3
                      focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[var(--accent)]
                      focus:text-white focus:text-[14px] focus:font-semibold">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
