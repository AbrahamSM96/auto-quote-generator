import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import LoginForm from './LoginForm'

/**
 * LoginPage Component
 *
 * This page component renders the login form for users to authenticate. It checks if any users exist in the database, and if not, it redirects to the registration page to create the Master user account. If users do exist, it renders the LoginForm component to allow users to log in.
 *
 * @returns The LoginForm component or a redirect to the registration page if no users exist
 */
export default async function LoginPage(): Promise<React.ReactElement> {
  // Check if any users exist
  const userCount = await prisma.user.count()

  // If no users exist, redirect to register to create Master user
  if (userCount === 0) {
    redirect('/register')
  }

  return <LoginForm />
}
