export function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-dark-border animate-spin border-t-primary" />
        <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-16 h-10 bg-dark-elevated rounded-lg" />
          <div className="flex-1 h-10 bg-dark-elevated rounded-lg" />
          <div className="w-32 h-10 bg-dark-elevated rounded-lg" />
          <div className="w-24 h-10 bg-dark-elevated rounded-lg" />
        </div>
      ))}
    </div>
  )
}
