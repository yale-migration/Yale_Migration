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
      <body>{children}</body>
    </html>
  )
}
