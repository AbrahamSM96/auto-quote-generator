
/**
 * Loading 
 */
export function Loading(): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dark-border border-t-primary" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-lg" />
      </div>
    </div>
  )
}


