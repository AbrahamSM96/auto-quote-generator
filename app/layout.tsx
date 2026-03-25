import './globals.css'
import { JetBrains_Mono, Manrope } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'

const jetbrainsMono = JetBrains_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-technical',
  weight: ['400', '500', '600', '700', '800'],
})

const manrope = Manrope({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  description: 'Sistema profesional de cotización para talleres automotrices',
  title: 'Sistema de Cotización - Taller Automotriz',
}

/**
 * RootLayout - Layout component that wraps all pages and provides global styles and context
 *
 * @param props - Component props
 * @param props.children - Child components
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="es-MX">
      <body
        className={`${jetbrainsMono.variable} ${manrope.variable} font-ui antialiased`}
      >
        {children}
        <Toaster
          closeButton
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: '#171717',
              border: '1px solid #404040',
              color: '#FAFAFA',
            },
          }}
        />
      </body>
    </html>
  )
}
