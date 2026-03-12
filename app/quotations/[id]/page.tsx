import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getQuotation } from '../actions'
import { QuotationView } from '@/components/quotation/QuotationView'
import { Button } from '@/components/ui/Button'

export default async function QuotationViewPage({
  params
}: {
  params: Promise<{ id: string }>
})  {
  const { id } = await params
  const quotation = await getQuotation(id)

  if (!quotation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-4 mb-6">
          <Link href="/">
            <Button variant="secondary">
              ← Volver
            </Button>
          </Link>
          <Link href={`/quotations/${quotation.id}/edit`}>
            <Button variant="outline">
              ✏️ Editar
            </Button>
          </Link>
          <button
            onClick={() => window.open(`/api/quotations/${quotation.id}/pdf`, '_blank')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-red-600 text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all"
          >
            📄 Generar PDF
          </button>
        </div>

        <QuotationView quotation={quotation} />
      </div>
    </div>
  )
}
