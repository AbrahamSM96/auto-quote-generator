import { formatCurrency, padFolio } from '@/lib/utils'

import { QuotationRowActions } from './QuotationRowActions'

export type QuotationListItem = {
  id: string
  folio: number
  clientName: string
  vehicleBrand: string
  vehicleModel: string
  totalAmount: number | { toNumber: () => number }
  createdAt: Date | string
}

interface QuotationRowProps {
  quotation: QuotationListItem
}

/**
 * QuotationRow - Server Component that renders a single quotation row
 * Delegates interactive actions to QuotationRowActions (Client Component)
 *
 * @param props - Props for the quotation row
 * @param props.quotation - The quotation data to display in the row
 */
export function QuotationRow({
  quotation,
}: QuotationRowProps): React.ReactElement {
  const total =
    typeof quotation.totalAmount === 'object'
      ? quotation.totalAmount.toNumber()
      : quotation.totalAmount

  return (
    <tr className="cursor-pointer transition-colors hover:bg-dark-elevated/50">
      <td className="px-6 py-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-technical text-sm font-bold text-primary">
          #{padFolio(quotation.folio)}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-text-primary">
        {quotation.clientName}
      </td>
      <td className="px-6 py-4 text-text-secondary">
        {quotation.vehicleBrand} {quotation.vehicleModel}
      </td>
      <td className="px-6 py-4 text-right font-technical font-bold text-text-primary">
        {formatCurrency(total)}
      </td>
      <td className="px-6 py-4 text-sm text-text-secondary">
        {new Date(quotation.createdAt).toLocaleDateString('es-MX')}
      </td>
      <td className="px-6 py-4 text-right">
        <QuotationRowActions quotationId={quotation.id} />
      </td>
    </tr>
  )
}
