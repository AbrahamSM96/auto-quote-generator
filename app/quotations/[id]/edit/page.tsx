import { notFound } from 'next/navigation'
import { QuotationForm } from '@/components/quotation/QuotationForm'
import { getQuotation } from '../../actions'

export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quotation = await getQuotation(id)

  if (!quotation) {
    notFound()
  }

  // Transform Prisma Decimal to number for form
  const initialData = {
    ...quotation,
    totalAmount:
      typeof quotation.totalAmount === 'object'
        ? quotation.totalAmount.toNumber()
        : quotation.totalAmount,
    downPayment:
      typeof quotation.downPayment === 'object'
        ? quotation.downPayment.toNumber()
        : quotation.downPayment,
    remainingBalance:
      typeof quotation.remainingBalance === 'object'
        ? quotation.remainingBalance.toNumber()
        : quotation.remainingBalance,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <QuotationForm mode="edit" initialData={initialData} />
      </div>
    </div>
  )
}
