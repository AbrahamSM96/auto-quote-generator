'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteQuotation } from '@/app/quotations/actions'
import { formatCurrency, formatDate, padFolio } from '@/lib/utils'
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

export function QuotationList({ quotations }: QuotationListProps) {
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

  const handleDelete = async () => {
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
          <Button size="lg" className="shadow-glow">
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
              type="text"
              placeholder="Buscar por cliente, vehículo o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-elevated py-3.5 pr-4 pl-12 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
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
                    key={quotation.id}
                    className="cursor-pointer transition-colors hover:bg-dark-elevated/50"
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
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}`)
                          }
                          title="Ver"
                        >
                          👁️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}/edit`)
                          }
                          title="Editar"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/api/quotations/${quotation.id}/pdf`,
                              '_blank'
                            )
                          }
                          title="PDF"
                        >
                          📄
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteModal({ isOpen: true, quotation })
                          }
                          title="Eliminar"
                          className="hover:text-red-400"
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
              No se encontraron resultados para "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quotation: null })}
        onConfirm={handleDelete}
        title="¿Eliminar Cotización?"
        message={`Se eliminará la cotización #${deleteModal.quotation ? padFolio(deleteModal.quotation.folio) : ''} de <span class="text-text-primary font-semibold">${deleteModal.quotation?.clientName}</span>. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </>
  )
}
