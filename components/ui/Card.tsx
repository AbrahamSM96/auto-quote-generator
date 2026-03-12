import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        glass
          ? 'glass-card'
          : 'bg-dark-surface border border-dark-border',
        'hover:shadow-glow-sm transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mb-6 pb-4 border-b border-dark-border/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-xl font-bold text-text-primary', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}
