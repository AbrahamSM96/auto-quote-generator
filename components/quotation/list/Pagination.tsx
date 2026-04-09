'use client'

import { Button } from '@/components/ui/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

/**
 * Pagination - Client Component for pagination controls
 *
 * @param props - Props for the pagination component
 * @param props.currentPage - The current page number
 * @param props.totalPages - The total number of pages
 * @param props.startIndex - The index of the first item on the current page
 * @param props.endIndex - The index of the last item on the current page
 * @param props.totalItems - The total number of items
 * @param props.onPageChange - Callback function to handle page changes
 */
export function Pagination({
  currentPage,
  endIndex,
  onPageChange,
  startIndex,
  totalItems,
  totalPages,
}: PaginationProps): React.ReactElement {

  /**
   * goToPage - Handles page navigation
   *
   * @param page - The page number to navigate to
   */
  const goToPage = (page: number): void => {
    onPageChange(Math.max(1, Math.min(page, totalPages)))
  }

  if (totalItems === 0) {
    return undefined as unknown as React.ReactElement
  }

  return (
    <div className="flex items-center justify-between border-t border-dark-border/50 px-6 py-4">
      {/* Results info */}
      <div className="text-sm text-text-secondary">
        Mostrando{' '}
        <span className="font-semibold text-text-primary">
          {startIndex + 1}
        </span>{' '}
        -{' '}
        <span className="font-semibold text-text-primary">
          {Math.min(endIndex, totalItems)}
        </span>{' '}
        de{' '}
        <span className="font-semibold text-text-primary">{totalItems}</span>{' '}
        cotizaciones
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
            size="sm"
            variant="ghost"
          >
            ««
          </Button>
          <Button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            size="sm"
            variant="ghost"
          >
            ‹
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and 1 page before/after current
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                )
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsisBefore =
                  index > 0 && page - array[index - 1] > 1

                return (
                  <div className="flex items-center gap-1" key={page}>
                    {showEllipsisBefore && (
                      <span className="px-2 text-text-muted">...</span>
                    )}
                    <button
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-dark-elevated hover:text-text-primary'
                        }`}
                      onClick={() => goToPage(page)}
                      type="button"
                    >
                      {page}
                    </button>
                  </div>
                )
              })}
          </div>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            size="sm"
            variant="ghost"
          >
            ›
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
            size="sm"
            variant="ghost"
          >
            »»
          </Button>
        </div>
      )}
    </div>
  )
}
