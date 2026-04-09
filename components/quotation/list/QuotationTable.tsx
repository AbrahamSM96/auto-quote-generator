import { type QuotationListItem, QuotationRow } from './QuotationRow'

interface QuotationTableProps {
  quotations: QuotationListItem[]
}

/**
 * QuotationTable - Server Component that renders the quotations table
 * Pre-rendered on server for better performance
 *
 * @param props - Props for the quotation table
 * @param props.quotations - The list of quotations to display in the table 
 */
export function QuotationTable({
  quotations,
}: QuotationTableProps): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-dark-border bg-dark-elevated">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Folio
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Cliente
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Vehículo
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Total
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Fecha
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {quotations.map((quotation) => (
            <QuotationRow key={quotation.id} quotation={quotation} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
