import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx/lite'


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, label, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium tracking-wide text-text-secondary uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            className={clsx(
              'w-full rounded-xl border border-dark-border bg-dark-elevated px-4 py-3.5 capitalize',
              'text-text-primary placeholder:text-text-muted',
              'focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none',
              'transition-all hover:border-dark-border/80',
              error &&
              'border-red-500 focus:border-red-500 focus:ring-red-500/50',
              icon && 'pl-12',
              className
            )}
            ref={ref}
            type={type}
            {...props}
          />
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

Input.displayName = 'Input'
