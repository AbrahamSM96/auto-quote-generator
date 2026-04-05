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
export function AuthGuard({ children }: { children: React.ReactNode }): React.ReactNode {
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
    // Show minimal loading state to avoid flash
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary delay-75" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary delay-150" />
        </div>
      </div>
    )
  }

  return children
}
