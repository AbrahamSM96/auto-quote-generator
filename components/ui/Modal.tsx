'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'glass-card rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in border border-dark-border',
          className
        )}
        onClick={e => e.stopPropagation()}
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
  confirmVariant = 'danger'
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="border-red-500/30">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-secondary" dangerouslySetInnerHTML={{ __html: message }} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary font-medium hover:bg-dark-surface transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={cn(
            'flex-1 px-6 py-3 rounded-xl text-white font-bold transition-colors',
            confirmVariant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 shadow-glow-sm'
              : 'bg-primary hover:bg-primary-hover shadow-glow-sm'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
