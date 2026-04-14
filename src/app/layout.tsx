import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Stockholmsbytarn – Byt hyresrätt i Stockholm',
    template: '%s | Stockholmsbytarn',
  },
  description: 'Byt hyresrätt i Stockholm — tryggt och gratis. Hitta din nästa lägenhet genom direktbyte med andra stockholmare.',
  keywords: ['hyresrätt', 'byte', 'Stockholm', 'bostadsbyte', 'lägenhetsyte'],
  openGraph: {
    title: 'Stockholmsbytarn',
    description: 'Byt hyresrätt i Stockholm — tryggt och gratis',
    locale: 'sv_SE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '14px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
