/* eslint-disable no-console */
'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerMasterUser } from '@/app/actions/auth-actions'
import { signIn } from '@/lib/auth-client'

const registerSchema = z.object({
  confirmPassword: z.string(),
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

/**
 * RegisterForm Component
 *
 * This component renders a registration form for creating the Master user account.
 * It includes fields for name, email, password, and password confirmation.
 * Upon submission, it creates the user via a server action and then automatically logs them in.
 */
export default function RegisterForm(): React.ReactElement {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  /**
   * onSubmit Handler
   *
   * This function is called when the registration form is submitted.
   * It creates the Master user account and then attempts to log in automatically.
   *
   * @param data - The form data containing name, email, password, and confirmPassword
   */
  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true)

    try {
      console.log('📝 Creando usuario Master:', data.email)

      // Create user via server action
      const result = await registerMasterUser({
        email: data.email,
        name: data.name,
        password: data.password,
      })

      console.log('📋 Resultado del registro:', result)

      if (!result.success) {
        toast.error(result.error || 'Error al crear la cuenta')
        setIsLoading(false)
        return
      }

      toast.success('✅ Cuenta Master creada correctamente')

      // Now sign in with Better Auth
      console.log('🔐 Iniciando sesión automáticamente...')

      const signInResult = await signIn.email({
        callbackURL: '/',
        email: data.email,
        password: data.password,
      })

      console.log('📋 Resultado del login:', signInResult)

      if (signInResult.error) {
        toast.error('Error al iniciar sesión. Por favor inicia sesión manualmente.')
        setIsLoading(false)
        router.push('/login')
        return
      }

      // Success!
      /* istanbul ignore next */
      toast.success('🎉 ¡Bienvenido al sistema!')

      // Wait a moment for the session to be fully set
      /* istanbul ignore next */
      await new Promise(resolve => setTimeout(resolve, 500))

      // Redirect to home
      /* istanbul ignore next */
      window.location.href = '/'
    } catch (error: Error | unknown) {
      /* istanbul ignore next */
      console.error('❌ Error:', error)
      /* istanbul ignore next */
      toast.error((error as Error)?.message || 'Error al crear la cuenta')
      /* istanbul ignore next */
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="glass-card relative w-full max-w-md rounded-2xl p-8 shadow-glow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">
            Crear Cuenta Master
          </h1>
          <p className="text-text-secondary">
            Primera configuración del sistema
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

          <Input
            error={errors.confirmPassword?.message}
            label="Confirmar Contraseña"
            placeholder="••••••••"
            type="password"
            {...register('confirmPassword')}
          />

          <Button
            className="w-full"
            disabled={isLoading}
            loading={isLoading}
            size="lg"
            type="submit"
            variant="primary"
          >
            Crear Cuenta Master
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            className="text-sm text-text-secondary hover:text-primary transition-colors"
            href="/login"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
