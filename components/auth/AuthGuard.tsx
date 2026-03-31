'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useSession } from '@/lib/auth-client'

/**
 * AuthGuard Component
 *
 * This component protects routes that require authentication. It checks the user's session status and redirects accordingly:
 *
 * @param props - The children components that require authentication
 * @param props.children - The components to render if the user is authenticated
 */
export function AuthGuard({ children }: { children: React.ReactElement }): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (isPending) return

    if (!session && !isPublicRoute) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }

    if (session && isPublicRoute) {
      router.push('/')
    }
  }, [session, isPending, isPublicRoute, pathname, router])

  if (isPending || (!session && !isPublicRoute) || (session && isPublicRoute)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return children
}
