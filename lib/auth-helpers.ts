import { headers } from 'next/headers'

import { User } from '../generated/prisma'

import { auth } from './auth'
import { prisma } from './prisma'

// Type for Better Auth session response
type AuthSession = {
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    ipAddress?: string
    userAgent?: string
  }
  user: {
    id: string
    email: string
    name: string
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
  }
}

/**
 * getSession - Retrieves the current user's session from Better Auth. It checks the request headers for authentication information and returns the session data if the user is authenticated. If no session is found, it throws an error indicating that the user is not authorized.
 *
 * @returns The session object containing user information if authenticated
 * @throws An error if the user is not authenticated
 */
export async function getSession(): Promise<AuthSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('No autorizado')
  }

  return session as AuthSession
}

/**
 * getMasterUser - Retrieves the first user created in the system, typically considered the Master user.
 *
 * @returns The Master user object if found, otherwise null
 */
export async function getMasterUser(): Promise<User | null> {
  return await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * isMasterUser - Checks if the given user ID belongs to the Master user by comparing it with the ID of the first user created in the system.
 *
 * @param userId - The ID of the user to check
 */
export async function isMasterUser(userId: string): Promise<boolean> {
  const master = await getMasterUser()
  return master?.id === userId
}
