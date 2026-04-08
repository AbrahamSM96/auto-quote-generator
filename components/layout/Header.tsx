/* eslint-disable no-console */
'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import { signOut, useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/Button'
import { CreateClientModal } from '@/components/modals/CreateClientModal'

interface HeaderProps {
  isMaster: boolean
}

/**
 * Header Component
 *
 * @param props - The props for the Header component
 * @param props.isMaster - Indicates if the user is a Master user
 */
export function Header({ isMaster }: HeaderProps): React.ReactElement | null {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * Handles the logout process for the user.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut()
      toast.success('Sesión cerrada correctamente')
      // Force full page reload to clear all state
      /* istanbul ignore next */
      window.location.href = '/login'
    } catch (error) {
      /* istanbul ignore next */
      toast.error('Error al cerrar sesión')
      /* istanbul ignore next */
      console.log(error, 'Error during logout') // Log the error for debugging
    }
  }

  // Don't render header if no session
  if (!session) {
    return null
  }

  return (
    <>
      <header className="glass-card sticky top-0 z-40 border-b border-dark-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-text-primary">
              Sistema de Cotización
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-text-primary">
                {session?.user?.name}
              </span>
              <span className="text-xs text-text-secondary">
                {session?.user?.email}
              </span>
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
        </div>
      </header>

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
