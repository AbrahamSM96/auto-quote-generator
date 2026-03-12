import { cn } from '@/lib/utils'
import { forwardRef, SelectHTMLAttributes } from 'react'

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
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl',
              'text-text-primary appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
              'hover:border-dark-border/80 transition-all',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
