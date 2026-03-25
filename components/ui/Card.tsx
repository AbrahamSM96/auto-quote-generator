import type { HTMLAttributes, JSX } from 'react'

import { cn } from '@/lib/utils'

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
      className={cn(
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

/**
 * CardHeader component for displaying the header section of a card, typically containing the title and optional actions.
 *
 * @param props - The properties for the CardHeader component.
 * @param props.children - The content to be displayed inside the card header.
 * @param props.className - Additional CSS classes to apply to the card header.
 */
export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'mb-6 flex items-center gap-3 border-b border-dark-border/50 pb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardTitle component for displaying the title of a card.
 *
 * @param props - The properties for the CardTitle component.
 * @param props.children - The content to be displayed inside the card title.
 * @param props.className - Additional CSS classes to apply to the card title.
 */
export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return (
    <h2
      className={cn('text-xl font-bold text-text-primary', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * CardContent component for displaying the main content of a card.
 *
 * @param props - The properties for the CardContent component.
 * @param props.children - The content to be displayed inside the card content.
 * @param props.className - Additional CSS classes to apply to the card content.
 */
export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}
