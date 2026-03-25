import { JSX } from 'react'

/**
 * Loading 
 */
export function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dark-border border-t-primary" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-lg" />
      </div>
    </div>
  )
}

/**
 * LoadingSkeleton
 */
export function LoadingSkeleton(): JSX.Element {
  return (
    <div className="glass-card animate-pulse space-y-4 rounded-2xl p-6">
      {[1, 2, 3].map((i) => (
        <div className="flex items-center gap-4" key={i}>
          <div className="h-10 w-16 rounded-lg bg-dark-elevated" />
          <div className="h-10 flex-1 rounded-lg bg-dark-elevated" />
          <div className="h-10 w-32 rounded-lg bg-dark-elevated" />
          <div className="h-10 w-24 rounded-lg bg-dark-elevated" />
        </div>
      ))}
    </div>
  )
}
