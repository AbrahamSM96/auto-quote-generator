/* eslint-disable no-console */
'use server'

import { User } from 'better-auth'

import { getSession, isMasterUser } from '@/lib/auth-helpers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * createClientUser - Server Action
 *
 * @param data - The data required to create a new Client user
 * @param data.email - The email address of the Client user
 * @param data.password - The password for the Client user account
 * @param data.name - The name of the Client user
 */
export async function createClientUser(data: {
  email: string
  password: string
  name: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()

    // Verify Master privilege
    if (!(await isMasterUser(session?.user?.id))) {
      return {
        error: 'Solo el usuario Master puede crear usuarios',
        success: false,
      }
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return {
        error: 'Ya existe un usuario con ese email',
        success: false,
      }
    }

    console.log('📝 Creando usuario Client con Better Auth...')

    // Use Better Auth's internal API to create user
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    })

    console.log('✅ Usuario Client creado:', data.email)

    return { success: true }
  } catch (error: Error | unknown) {
    console.log('❌ Error al crear usuario Client:', error)
    return {
      error: error instanceof Error ? error.message : 'Error al crear usuario',
      success: false,
    }
  }
}

/**
 * getCurrentUser - Server Action
 *
 * @returns The current authenticated user or null if not authenticated
 *
 * This function retrieves the current session and returns the user object. If there is no valid session, it returns null.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession()
    return session.user
  } catch {
    return null
  }
}

/**
 * checkIsMasterUser - Server Action
 *
 * @returns A boolean indicating whether the current authenticated user is a Master user
 *
 * This function checks if the currently authenticated user has Master privileges by retrieving the session and verifying the user's role. If there is no valid session or the user is not a Master, it returns false.
 */
export async function checkIsMasterUser(): Promise<boolean> {
  try {
    const session = await getSession()
    return await isMasterUser(session.user.id)
  } catch {
    return false
  }
}
