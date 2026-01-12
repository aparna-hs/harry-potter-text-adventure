import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auror Examination - Harry Potter Text Adventure',
  description: 'Take the final Auror examination in this text-based adventure game. Use your knowledge of Harry Potter spells to navigate challenges and become an Auror!',
  keywords: ['Harry Potter', 'text adventure', 'game', 'Auror', 'magic', 'spells'],
  openGraph: {
    title: 'Auror Examination',
    description: 'Take the final Auror examination. Real magical threats. Real danger.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
