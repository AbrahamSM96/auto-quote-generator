'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'

interface QuotationRowActionsProps {
  quotationId: string
}

/**
 * QuotationRowActions - Client Component for interactive row actions
 * Handles navigation to view, edit, PDF, and delete
 *
 * @param props - Props for the quotation row actions
 * @param props.quotationId - The ID of the quotation
 */
export function QuotationRowActions({
  quotationId,
}: QuotationRowActionsProps): React.ReactElement {
  const router = useRouter()

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        onClick={() => router.push(`/quotations/${quotationId}`)}
        size="sm"
        title="Ver"
        variant="ghost"
      >
        👁️
      </Button>
      <Button
        onClick={() => router.push(`/quotations/${quotationId}/edit`)}
        size="sm"
        title="Editar"
        variant="ghost"
      >
        ✏️
      </Button>
      <Button
        onClick={() =>
          window.open(`/api/quotations/${quotationId}/pdf`, '_blank')
        }
        size="sm"
        title="PDF"
        variant="ghost"
      >
        📄
      </Button>
    </div>
  )
}
