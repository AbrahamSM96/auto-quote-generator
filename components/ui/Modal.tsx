'use client'

import type { JSX } from 'react'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'

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
}: ModalProps): JSX.Element | null {
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
        className={cn(
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

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmVariant?: 'danger' | 'primary'
}

/**
 * ConfirmModal 
 *
 * @param props - The properties for the ConfirmModal component.
 * @param props.confirmText - The text to display on the confirm button.
 * @param props.confirmVariant - The variant of the confirm button ('danger' or 'primary').
 * @param props.isOpen - Whether the modal is open or not.
 * @param props.message - The message to display inside the modal.
 * @param props.onClose - Function to call when the modal is requested to be closed.
 * @param props.onConfirm - Function to call when the confirm action is triggered.
 * @param props.title - The title to display at the top of the modal.
 */
export function ConfirmModal({
  confirmText = 'Confirmar',
  confirmVariant = 'danger',
  isOpen,
  message,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps): JSX.Element {
  return (
    <Modal className="border-red-500/30" isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-text-primary">{title}</h3>
        <p
          className="text-text-secondary"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 rounded-xl border border-dark-border bg-dark-elevated px-6 py-3 font-medium text-text-primary transition-colors hover:bg-dark-surface"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className={cn(
            'flex-1 rounded-xl px-6 py-3 font-bold text-white transition-colors',
            confirmVariant === 'danger'
              ? 'bg-red-600 shadow-glow-sm hover:bg-red-700'
              : 'bg-primary shadow-glow-sm hover:bg-primary-hover'
          )}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
