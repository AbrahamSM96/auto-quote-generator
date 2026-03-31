/* eslint-disable no-console */
'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { createClientUser } from '@/app/actions/user-actions'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

const clientUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type ClientUserFormData = z.infer<typeof clientUserSchema>

interface CreateClientModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * CreateClientModal Component
 *
 * @param props - The props for the CreateClientModal component
 * @param props.isOpen - Indicates if the modal is open
 * @param props.onClose - Function to close the modal
 */
export function CreateClientModal({ isOpen, onClose }: CreateClientModalProps): React.ReactElement | null {
  const [isLoading, setIsLoading] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ClientUserFormData>({
    resolver: zodResolver(clientUserSchema),
  })

  /**
   * Handles the form submission for creating a new client user.
   *
   * @param data - The form data for the new client user
   */
  const onSubmit = async (data: ClientUserFormData): Promise<void> => {
    setIsLoading(true)

    try {
      const result = await createClientUser(data)

      if (result.success) {
        toast.success('Usuario Client creado correctamente')
        reset()
        onClose()
      } else {
        toast.error(result.error || 'Error al crear usuario')
      }
    } catch (error) {
      toast.error('Error al crear usuario')
      console.log(error, 'Error during client user creation') // Log the error for debugging
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles the closing of the modal.
   */
  const handleClose = (): void => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div>
        <h2 className="mb-6 text-2xl font-bold text-text-primary">
          Crear Usuario Client
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            error={errors.name?.message}
            label="Nombre"
            placeholder="Juan Pérez"
            type="text"
            {...register('name')}
          />

          <Input
            error={errors.email?.message}
            label="Email"
            placeholder="correo@ejemplo.com"
            type="email"
            {...register('email')}
          />

          <Input
            error={errors.password?.message}
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            {...register('password')}
          />

          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              disabled={isLoading}
              onClick={handleClose}
              type="button"
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={isLoading}
              loading={isLoading}
              type="submit"
              variant="primary"
            >
              Crear Usuario
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
