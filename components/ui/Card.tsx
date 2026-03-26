import type { HTMLAttributes, JSX } from 'react'
import clsx from 'clsx/lite'


interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

/**
 * Card component with optional glass effect. Use CardHeader, CardTitle, and CardContent for structured content.
 *
 * @param props   - The properties for the Card component.
 * @param props.children - The content to be displayed inside the card.
 * @param props.className - Additional CSS classes to apply to the card.
 * @param props.glass - Whether to apply the glass effect to the card.
 */
export function Card({
  children,
  className,
  glass = true,
  ...props
}: CardProps): JSX.Element {
  return (
    <div
      className={clsx(
        'rounded-2xl p-6',
        glass ? 'glass-card' : 'border border-dark-border bg-dark-surface',
        'transition-all duration-300 hover:shadow-glow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}




