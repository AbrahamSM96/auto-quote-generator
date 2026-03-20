import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export function Card({
  className,
  glass = true,
  children,
  ...props
}: CardProps) {
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

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
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

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-xl font-bold text-text-primary', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}
