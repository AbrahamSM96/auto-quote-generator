import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuotationView } from '@/components/quotation/QuotationView'
import { Button } from '@/components/ui/Button'
import { getQuotation } from '../actions'

export default async function QuotationViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quotation = await getQuotation(id)

  if (!quotation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-4">
          <Link href="/">
            <Button variant="secondary">← Volver</Button>
          </Link>
          <Link href={`/quotations/${quotation.id}/edit`}>
            <Button variant="outline">✏️ Editar</Button>
          </Link>
          <button
            onClick={() =>
              window.open(`/api/quotations/${quotation.id}/pdf`, '_blank')
            }
            className="rounded-xl bg-gradient-to-r from-primary to-red-600 px-6 py-3 font-bold text-white shadow-glow transition-all hover:shadow-glow-lg"
          >
            📄 Generar PDF
          </button>
        </div>

        <QuotationView quotation={quotation} />
      </div>
    </div>
  )
}
