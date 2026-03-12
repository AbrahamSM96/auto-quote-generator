import type { Metadata } from 'next'
import { JetBrains_Mono, Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-technical',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sistema de Cotización - Taller Automotriz',
  description: 'Sistema profesional de cotización para talleres automotrices',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-MX">
      <body className={`${jetbrainsMono.variable} ${manrope.variable} font-ui antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#171717',
              color: '#FAFAFA',
              border: '1px solid #404040',
            }
          }}
        />
      </body>
    </html>
  )
}
