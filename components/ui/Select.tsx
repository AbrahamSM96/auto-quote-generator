import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium tracking-wide text-text-secondary uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-dark-border bg-dark-elevated px-4 py-3.5',
              'cursor-pointer appearance-none text-text-primary',
              'focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none',
              'transition-all hover:border-dark-border/80',
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-muted">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="flex animate-fade-in items-center gap-2 text-sm text-red-400">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
