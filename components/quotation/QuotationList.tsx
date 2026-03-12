'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency, formatDate, padFolio } from '@/lib/utils'
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

export function QuotationList({ quotations }: QuotationListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; quotation: QuotationListItem | null }>({
    isOpen: false,
    quotation: null
  })

  const filtered = quotations.filter(q =>
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
        <div className="w-24 h-24 rounded-full bg-dark-elevated mx-auto mb-6 flex items-center justify-center">
          <span className="text-6xl opacity-50">📋</span>
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          No hay cotizaciones
        </h3>
        <p className="text-text-secondary mb-6">
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
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Search */}
        <div className="p-6 border-b border-dark-border/50">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              🔍
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente, vehículo o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-elevated border-b border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Folio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filtered.map((quotation) => {
                const total = typeof quotation.totalAmount === 'object'
                  ? quotation.totalAmount.toNumber()
                  : quotation.totalAmount

                return (
                  <tr
                    key={quotation.id}
                    className="hover:bg-dark-elevated/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/quotations/${quotation.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm font-technical">
                        #{padFolio(quotation.folio)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-primary font-medium">
                      {quotation.clientName}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {quotation.vehicleBrand} {quotation.vehicleModel}
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-bold font-technical">
                      {formatCurrency(total)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {new Date(quotation.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/quotations/${quotation.id}`)}
                          title="Ver"
                        >
                          👁️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/quotations/${quotation.id}/edit`)}
                          title="Editar"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/api/quotations/${quotation.id}/pdf`, '_blank')}
                          title="PDF"
                        >
                          📄
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, quotation })}
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
            <p className="text-text-secondary">No se encontraron resultados para "{searchTerm}"</p>
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
