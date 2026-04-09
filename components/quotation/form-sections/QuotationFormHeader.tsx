import { formatDate, formatTime, padFolio } from '@/lib/utils'
import { workshopConfig } from '@/config/workshop'

interface QuotationFormHeaderProps {
  mode: 'create' | 'edit'
  folio?: number
  nextFolio: number | null
  createdAt?: Date
}

/**
 * QuotationFormHeader displays the workshop branding and folio information
 *
 * @param props - The props for the QuotationFormHeader component, including mode, folio, next folio, and creation date.
 * @param props.mode - The mode of the form, either 'create' or 'edit'.
 * @param props.folio - The current folio number, if available.
 * @param props.nextFolio - The next folio number, if available.
 * @param props.createdAt - The creation date of the quotation, if available.
 */
export function QuotationFormHeader({
  createdAt,
  folio,
  mode,
  nextFolio,
}: QuotationFormHeaderProps): React.ReactElement {
  const now = createdAt || new Date()

  return (
    <header className="glass-card rounded-2xl border border-dark-border/50 p-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30 bg-dark-elevated">
              <span className="text-4xl">🔧</span>
            </div>
          </div>
          <div>
            <h1 className="text-gradient text-4xl font-black tracking-tight">
              {workshopConfig.name}
            </h1>
            <p className="mt-1 flex items-center gap-2 font-semibold tracking-wider text-primary">
              <span className="h-px w-8 bg-primary" />
              {workshopConfig.subtitle}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-3 inline-flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated px-6 py-3">
            <span className="text-sm font-medium text-text-secondary">
              FOLIO
            </span>
            <span className="font-technical text-3xl font-black text-primary">
              {mode === 'edit'
                ? padFolio(folio || 0)
                : nextFolio
                  ? padFolio(nextFolio)
                  : '---'}
            </span>
          </div>
          <p className="font-technical text-xl font-bold text-text-primary">
            {formatTime(now)}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {formatDate(now)}
          </p>
        </div>
      </div>
    </header>
  )
}
