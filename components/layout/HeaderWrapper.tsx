import { checkIsMasterUser, getCurrentUser } from '@/app/actions/user-actions'

import { HeaderServer } from './HeaderServer'

/**
 * HeaderWrapper Component
 *
 * Server Component that fetches user information and delegates rendering to HeaderServer.
 * Optimized to reduce client-side JavaScript by using Server Components.
 *
 * @returns The HeaderServer component with user data or null if not authenticated
 */
export async function HeaderWrapper(): Promise<React.ReactElement | null> {
  const user = await getCurrentUser()

  // Don't show header if user is not authenticated
  if (!user) {
    return null
  }

  const isMaster = await checkIsMasterUser()

  return (
    <HeaderServer
      isMaster={isMaster}
      user={{
        email: user.email,
        name: user.name,
      }}
    />
  )
}
