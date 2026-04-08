'use client'

import clsx from 'clsx/lite'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Modal 
 *
 * @param props - The properties for the Modal component.
 * @param props.children - The content to be displayed inside the modal.
 * @param props.className - Additional CSS classes to apply to the modal content.
 * @param props.isOpen - Whether the modal is open or not.
 * @param props.onClose - Function to call when the modal is requested to be closed.
 */
export function Modal({
  children,
  className,
  isOpen,
  onClose,
}: ModalProps): React.ReactElement | null {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return (): void => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={clsx(
          'glass-card mx-4 w-full max-w-md animate-scale-in rounded-2xl border border-dark-border p-8',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}



