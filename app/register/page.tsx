import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import RegisterForm from './RegisterForm'

/**
 * RegisterPage Component
 *
 * This page component renders the registration form for creating the Master user account.
 * It checks if any users already exist in the database, and if so, it redirects to the login page to prevent multiple registrations.
 * If no users exist, it renders the RegisterForm component to allow the creation of the Master user.
 *
 * @returns The RegisterForm component or a redirect to the login page if users already exist
 */
export default async function RegisterPage(): Promise<React.ReactElement> {
  // Check if any users exist
  const userCount = await prisma.user.count()

  // Block registration if users already exist
  if (userCount > 0) {
    redirect('/login')
  }

  return <RegisterForm />
}
