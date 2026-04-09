import { QuotationListClient } from './list/QuotationListClient'
import type { QuotationListItem } from './list/QuotationRow'

interface QuotationListProps {
  quotations: QuotationListItem[]
}

/**
 * QuotationList - Wrapper component for backward compatibility
 * Delegates rendering to QuotationListClient which uses Server Components internally
 *
 * @param props - Component props
 * @param props.quotations - Array of quotation items to display
 */
export function QuotationList({
  quotations,
}: QuotationListProps): React.ReactElement {
  return <QuotationListClient quotations={quotations} />
}
