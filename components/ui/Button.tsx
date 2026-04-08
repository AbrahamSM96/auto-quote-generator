import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx/lite'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      loading,
      size = 'md',
      variant = 'primary',
      ...props
    },
    ref
  ): React.ReactElement => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
      ghost:
        'bg-transparent text-text-secondary hover:bg-dark-elevated hover:text-text-primary',
      outline:
        'bg-transparent text-text-primary border-2 border-dark-border hover:border-primary hover:bg-primary/5',
      primary:
        'bg-gradient-to-r from-primary to-red-600 text-white hover:shadow-glow-sm active:scale-[0.98]',
      secondary:
        'bg-dark-elevated text-text-primary border border-dark-border hover:bg-dark-surface hover:border-primary/30',
    }

    const sizes = {
      lg: 'px-6 py-3.5 text-lg',
      md: 'px-4 py-2.5 text-base',
      sm: 'px-3 py-1.5 text-sm',
    }

    return (
      <button
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        type="button"
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
