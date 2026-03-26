import clsx from 'clsx/lite'
import type { HTMLAttributes } from 'react'


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
}: HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
    return (
        <h2
            className={clsx('text-xl font-bold text-text-primary', className)}
            {...props}
        >
            {children}
        </h2>
    )
}
