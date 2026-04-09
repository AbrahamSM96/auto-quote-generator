'use client'

import { toast } from 'sonner'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { CreateClientModal } from '@/components/modals/CreateClientModal'
import { signOut } from '@/lib/auth-client'

interface HeaderActionsProps {
  userName: string
  userEmail: string
  isMaster: boolean
}

/**
 * HeaderActions - Client Component for interactive header buttons
 * Handles logout and user creation modal
 *
 * @param props - The props for the HeaderActions component, including user information and permissions.
 * @param props.userName - The name of the user.
 * @param props.userEmail - The email of the user.
 * @param props.isMaster - Indicates if the user has master permissions.
 */
export function HeaderActions({
  isMaster,
  userEmail,
  userName,
}: HeaderActionsProps): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * Handles the logout process for the user.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut()
      toast.success('Sesión cerrada correctamente')
      // Force full page reload to clear all state
      window.location.href = '/login'
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-text-primary">
            {userName}
          </span>
          <span className="text-xs text-text-secondary">{userEmail}</span>
        </div>

        {isMaster && (
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            variant="secondary"
          >
            👤 Crear Usuario
          </Button>
        )}

        <Button onClick={handleLogout} size="sm" variant="outline">
          Cerrar Sesión
        </Button>
      </div>

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
