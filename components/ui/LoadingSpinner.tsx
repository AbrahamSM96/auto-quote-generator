/**
 * LoadingSpinner - Full screen loading component for Suspense fallback
 *
 * Displays an animated spinner in the center of the screen with a dark background
 */
export function LoadingSpinner(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="relative">
        {/* Spinning ring */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dark-border border-t-primary" />

        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-lg" />
      </div>
    </div>
  )
}
