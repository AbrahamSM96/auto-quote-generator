/* eslint-disable no-console */
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { User } from '../../generated/prisma'

/**
 * registerMasterUser
 *
 * @param data - The data required to create the Master user account
 * @param data.email - The email address of the Master user
 * @param data.password - The password for the Master user account
 * @param data.name - The name of the Master user
 * @returns An object indicating success or failure of the user creation process
 *
 * This function checks if a Master user already exists in the system. If not, it creates a new Master user using Better Auth's internal API. It returns an object with a success flag and either the created user or an error message.
 */
export async function registerMasterUser(data: {
  email: string
  password: string
  name: string
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count()

    if (userCount > 0) {
      return {
        error: 'Ya existe un usuario Master en el sistema',
        success: false,
      }
    }

    console.log('📝 Creando usuario con Better Auth...')

    // Use Better Auth's internal API to create user
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    })

    console.log('✅ Usuario Master creado:', data.email)

    return {
      success: true,
      user: result.user,
    }
  } catch (error: Error | unknown) {
    console.error('❌ Error al crear usuario Master:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Error al crear la cuenta. Intenta de nuevo.',
      success: false,
    }
  }
}
