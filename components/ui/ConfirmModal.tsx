/* eslint-disable react/no-danger */

import clsx from 'clsx/lite'

import { Modal } from './Modal'


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
}: ConfirmModalProps): React.ReactElement {
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
                    type='button'
                >
                    Cancelar
                </button>
                <button
                    className={clsx(
                        'flex-1 rounded-xl px-6 py-3 font-bold text-white transition-colors',
                        confirmVariant === 'danger'
                            ? 'bg-red-600 shadow-glow-sm hover:bg-red-700'
                            : 'bg-primary shadow-glow-sm hover:bg-primary-hover'
                    )}
                    onClick={() => {
                        onConfirm()
                        onClose()
                    }}
                    type='button'
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    )
}
