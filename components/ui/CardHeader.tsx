import clsx from 'clsx/lite'
import type { HTMLAttributes } from 'react'


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
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
    return (
        <div
            className={clsx(
                'mb-6 flex items-center gap-3 border-b border-dark-border/50 pb-4',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
