import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win',
  description: 'Mobile-first Scratch & Win web application with beautiful animations and fair gameplay.',
  keywords: ['scratch', 'win', 'game', 'mobile', 'prize'],
  authors: [{ name: 'Scratch & Win Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#0ea5e9',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              borderRadius: '1rem',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
