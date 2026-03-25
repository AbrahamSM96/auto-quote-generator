import { JSX } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { QuotationList } from '@/components/quotation/QuotationList'

import { getQuotations } from './quotations/actions'

/**
 * HomePage
 */
export default async function HomePage(): Promise<JSX.Element> {
  const quotations = await getQuotations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="glass-card mb-8 rounded-2xl border border-dark-border/50 p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-gradient mb-2 text-4xl font-black tracking-tight">
                Sistema de Cotización
              </h1>
              <p className="flex items-center gap-2 font-medium text-text-secondary">
                <span className="h-px w-8 bg-primary" />
                Taller Automotriz
              </p>
            </div>
            <Link href="/quotations/new">
              <Button className="shadow-glow" size="lg">
                <span className="text-xl">+</span>
                Nueva Cotización
              </Button>
            </Link>
          </div>
        </header>

        {/* Quotation List */}
        <QuotationList quotations={quotations} />
      </div>
    </div>
  )
}
