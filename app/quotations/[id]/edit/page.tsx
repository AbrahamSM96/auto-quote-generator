import { notFound } from 'next/navigation'

import { QuotationForm } from '@/components/quotation/QuotationForm'

import { getQuotation } from '../../actions'

// Force dynamic rendering because this page uses authentication
export const dynamic = 'force-dynamic'

/**
 * EditQuotationPage
 *
 * @param props - Component props
 * @param props.params - Route parameters containing the quotation ID
 */
export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.ReactElement> {
  const { id } = await params
  const quotation = await getQuotation(id)

  if (!quotation) {
    notFound()
  }
  // Transform Prisma Decimal to number for form
  const initialData = {
    ...quotation,
    downPayment:
      quotation.downPayment,
    remainingBalance:
      quotation.remainingBalance,
    totalAmount:
      quotation.totalAmount
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <QuotationForm initialData={initialData} mode="edit" />
      </div>
    </div>
  )
}
