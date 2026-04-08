import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { PDFButton } from '@/components/quotation/PDFButton'
import { QuotationView } from '@/components/quotation/QuotationView'

import { getQuotation } from '../actions'

/**
 * QuotationViewPage
 *
 * @param props - Component props
 * @param props.params - Route parameters containing the quotation ID
 */
export default async function QuotationViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.ReactElement> {
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
          <PDFButton quotationId={quotation.id} />
        </div>

        <QuotationView quotation={quotation} />
      </div>
    </div>
  )
}
