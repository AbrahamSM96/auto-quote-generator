/* eslint-disable no-console */
'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { signIn } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

/**
 * LoginForm Component
 *
 * This component renders a login form for users to enter their email and password.
 * It handles form validation using Zod and react-hook-form, and upon submission, it attempts to log the user in via the signIn function from the auth client.
 * If the login is successful, it redirects the user to the specified callback URL or the home page. If there is an error, it displays an appropriate message.
 */
export default function LoginForm(): React.ReactElement {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [isLoading, setIsLoading] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  /**
   * onSubmit Handler
   *
   * @param data - The form data containing email and password
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true)

    try {
      const result = await signIn.email({
        callbackURL: callbackUrl,
        email: data.email,
        password: data.password,
      })

      if (result.error) {
        toast.error('Email o contraseña incorrectos')
        setIsLoading(false)
        return
      }

      toast.success('Sesión iniciada correctamente')
      /* istanbul ignore next */
      window.location.href = callbackUrl
    } catch (error) {
      /* istanbul ignore next */
      toast.error('Email o contraseña incorrectos')
      /* istanbul ignore next */
      console.log(error, 'Error during login') // Log the error for debugging
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
            Iniciar Sesión
          </h1>
          <p className="text-text-secondary">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

          <Button
            className="w-full"
            disabled={isLoading}
            loading={isLoading}
            size="lg"
            type="submit"
            variant="primary"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            className="text-sm text-text-secondary hover:text-primary transition-colors"
            href="/register"
          >
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}
