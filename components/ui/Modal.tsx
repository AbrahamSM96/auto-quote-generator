'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
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

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  confirmVariant = 'danger',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="border-red-500/30">
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
          onClick={onClose}
          className="flex-1 rounded-xl border border-dark-border bg-dark-elevated px-6 py-3 font-medium text-text-primary transition-colors hover:bg-dark-surface"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={cn(
            'flex-1 rounded-xl px-6 py-3 font-bold text-white transition-colors',
            confirmVariant === 'danger'
              ? 'bg-red-600 shadow-glow-sm hover:bg-red-700'
              : 'bg-primary shadow-glow-sm hover:bg-primary-hover'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
