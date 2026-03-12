import Link from 'next/link'
import { getQuotations } from './quotations/actions'
import { QuotationList } from '@/components/quotation/QuotationList'
import { Button } from '@/components/ui/Button'

export default async function HomePage() {
  const quotations = await getQuotations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="glass-card rounded-2xl p-8 mb-8 shadow-2xl border border-dark-border/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gradient mb-2">
                Sistema de Cotización
              </h1>
              <p className="text-text-secondary font-medium flex items-center gap-2">
                <span className="w-8 h-px bg-primary"></span>
                Taller Automotriz
              </p>
            </div>
            <Link href="/quotations/new">
              <Button size="lg" className="shadow-glow">
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
