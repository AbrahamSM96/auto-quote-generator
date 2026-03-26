import clsx from 'clsx/lite'
import type { HTMLAttributes } from 'react'


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
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
    return (
        <div className={clsx('space-y-4', className)} {...props}>
            {children}
        </div>
    )
}
