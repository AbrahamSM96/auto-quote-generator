'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

/**
 * SearchBar - Client Component for search input
 *
 * @param props - Props for the search bar component
 * @param props.value - The current search term
 * @param props.onChange - Callback function to handle search term changes
 */
export function SearchBar({
  onChange,
  value,
}: SearchBarProps): React.ReactElement {
  return (
    <div className="border-b border-dark-border/50 p-6">
      <div className="relative">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-text-muted">
          🔍
        </div>
        <input
          className="w-full rounded-xl border border-dark-border bg-dark-elevated py-3.5 pr-4 pl-12 text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por cliente, vehículo o folio..."
          type="text"
          value={value}
        />
      </div>
    </div>
  )
}
