'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { deleteQuotation } from '@/app/quotations/actions'
import { padFolio } from '@/lib/utils'

import { EmptyState } from './EmptyState'
import { Pagination } from './Pagination'
import type { QuotationListItem } from './QuotationRow'
import { QuotationTable } from './QuotationTable'
import { SearchBar } from './SearchBar'

interface QuotationListClientProps {
  quotations: QuotationListItem[]
}

/**
 * QuotationListClient - Client Component wrapper
 * Manages search, pagination, and delete modal state
 * Renders Server Components for the actual table
 *
 * @param props - Props for the quotation list client
 * @param props.quotations - The list of quotations
 */
export function QuotationListClient({
  quotations,
}: QuotationListClientProps): React.ReactElement {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    quotation: QuotationListItem | null
  }>({
    isOpen: false,
    quotation: null,
  })

  const itemsPerPage = 10

  // Filter quotations based on search term
  const filtered = useMemo(
    () =>
      quotations.filter(
        (q) =>
          q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          padFolio(q.folio).includes(searchTerm)
      ),
    [quotations, searchTerm]
  )

  /**
   * handleSearch - Updates search term and resets pagination
   *
   * @param value - The new search term entered by the user
   */
  const handleSearch = (value: string): void => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedQuotations = filtered.slice(startIndex, endIndex)

  /**
   * handleDelete - Deletes the selected quotation
   *
   */
  const handleDelete = async (): Promise<void> => {
    if (!deleteModal.quotation) return

    const result = await deleteQuotation(deleteModal.quotation.id)

    if (result.success) {
      toast.success('Cotización eliminada exitosamente')
      setDeleteModal({ isOpen: false, quotation: null })
      router.refresh()
    } else {
      toast.error(result.error || 'Error al eliminar cotización')
    }
  }

  // Show empty state if no quotations
  if (quotations.length === 0) {
    return <EmptyState type="no-quotations" />
  }

  return (
    <>
      <div className="glass-card overflow-hidden rounded-2xl">
        <SearchBar onChange={handleSearch} value={searchTerm} />

        {filtered.length > 0 ? (
          <>
            <QuotationTable quotations={paginatedQuotations} />
            <Pagination
              currentPage={currentPage}
              endIndex={endIndex}
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              totalItems={filtered.length}
              totalPages={totalPages}
            />
          </>
        ) : (
          <EmptyState searchTerm={searchTerm} type="no-results" />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        confirmText="Eliminar"
        isOpen={deleteModal.isOpen}
        message={`Se eliminará la cotización #${deleteModal.quotation ? padFolio(deleteModal.quotation.folio) : ''} de <span class="text-text-primary font-semibold">${deleteModal.quotation?.clientName}</span>. Esta acción no se puede deshacer.`}
        onClose={() => setDeleteModal({ isOpen: false, quotation: null })}
        onConfirm={handleDelete}
        title="¿Eliminar Cotización?"
      />
    </>
  )
}
