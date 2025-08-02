import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProgexAI - GenAI Project Collaboration Platform',
  description: 'AI-powered platform for student project collaboration and development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="matrix-bg cyber-grid">
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-accent">
          {children}
        </div>
      </body>
    </html>
  )
}
