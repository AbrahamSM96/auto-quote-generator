// ✅ Server Component - Estado vacío cuando no hay cotizaciones

import Link from 'next/link'

import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  type: 'no-quotations' | 'no-results'
  searchTerm?: string
}

/**
 * EmptyState - Server Component for empty states
 *
 * @param props - Props for the empty state component
 * @param props.type - The type of empty state ('no-quotations' or 'no-results')
 * @param props.searchTerm - The search term used when no results are found
 */
export function EmptyState({
  searchTerm,
  type,
}: EmptyStateProps): React.ReactElement {
  if (type === 'no-quotations') {
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
    <div className="p-12 text-center">
      <p className="text-text-secondary">
        No se encontraron resultados para &quot;{searchTerm}&quot;
      </p>
    </div>
  )
}
