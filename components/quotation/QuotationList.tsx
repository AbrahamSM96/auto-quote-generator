'use client'

import { JSX, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { formatCurrency, padFolio } from '@/lib/utils'
import { deleteQuotation } from '@/app/quotations/actions'

import { Button } from '../ui/Button'
import { ConfirmModal } from '../ui/Modal'

type QuotationListItem = {
  id: string
  folio: number
  clientName: string
  vehicleBrand: string
  vehicleModel: string
  totalAmount: number | { toNumber: () => number }
  createdAt: Date | string
}

interface QuotationListProps {
  quotations: QuotationListItem[]
}

/**
 * QuotationList  renders a searchable and interactive list of quotations. It allows users to view, edit, generate PDFs, and delete quotations. The component also handles empty states and displays a confirmation modal before deletion.
 *
 * @param props - The component props
 * @param props.quotations - An array of quotation items to display in the list
 */
export function QuotationList({ quotations }: QuotationListProps): JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    quotation: QuotationListItem | null
  }>({
    isOpen: false,
    quotation: null,
  })

  const filtered = quotations.filter(
    (q) =>
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      padFolio(q.folio).includes(searchTerm)
  )

  /**
   * handleDelete is an asynchronous function that deletes a quotation when the user confirms the deletion in the modal. It calls the deleteQuotation action with the quotation ID, shows a success or error toast based on the result, and refreshes the page to update the list of quotations.
   */
  const handleDelete = async (): Promise<void> => {
    if (!deleteModal.quotation) return

    const result = await deleteQuotation(deleteModal.quotation.id)

    if (result.success) {
      toast.success('Cotización eliminada exitosamente')
      router.refresh()
    } else {
      toast.error(result.error || 'Error al eliminar cotización')
    }
  }

  if (quotations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-dark-elevated">
          <span className="text-6xl opacity-50">📋</span>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-text-primary">
          No hay cotizaciones
        </h3>
        <p className="mb-6 text-text-secondary">
          Comienza creando tu primera cotización profesional
        </p>
        <Link href="/quotations/new">
          <Button className="shadow-glow" size="lg">
            <span className="text-xl">+</span>
            Nueva Cotización
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="glass-card overflow-hidden rounded-2xl">
        {/* Search */}
        <div className="border-b border-dark-border/50 p-6">
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-text-muted">
              🔍
            </div>
            <input
              className="w-full rounded-xl border border-dark-border bg-dark-elevated py-3.5 pr-4 pl-12 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, vehículo o folio..."
              type="text"
              value={searchTerm}
            />
          </div>
        </div>

        {/* Table */}
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
              {filtered.map((quotation) => {
                const total =
                  typeof quotation.totalAmount === 'object'
                    ? quotation.totalAmount.toNumber()
                    : quotation.totalAmount

                return (
                  <tr
                    className="cursor-pointer transition-colors hover:bg-dark-elevated/50"
                    key={quotation.id}
                    onClick={() => router.push(`/quotations/${quotation.id}`)}
                  >
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
                      {new Date(quotation.createdAt).toLocaleDateString(
                        'es-MX'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}`)
                          }
                          size="sm"
                          title="Ver"
                          variant="ghost"
                        >
                          👁️
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}/edit`)
                          }
                          size="sm"
                          title="Editar"
                          variant="ghost"
                        >
                          ✏️
                        </Button>
                        <Button
                          onClick={() =>
                            window.open(
                              `/api/quotations/${quotation.id}/pdf`,
                              '_blank'
                            )
                          }
                          size="sm"
                          title="PDF"
                          variant="ghost"
                        >
                          📄
                        </Button>
                        <Button
                          className="hover:text-red-400"
                          onClick={() =>
                            setDeleteModal({ isOpen: true, quotation })
                          }
                          size="sm"
                          title="Eliminar"
                          variant="ghost"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && searchTerm && (
          <div className="p-12 text-center">
            <p className="text-text-secondary">
              No se encontraron resultados para {searchTerm}
            </p>
          </div>
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
