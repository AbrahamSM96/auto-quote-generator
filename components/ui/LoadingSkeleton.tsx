/**
 * LoadingSkeleton
 */
export function LoadingSkeleton(): React.ReactElement {
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
