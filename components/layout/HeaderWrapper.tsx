import { checkIsMasterUser, getCurrentUser } from '@/app/actions/user-actions'

import { Header } from './Header'

/**
 * HeaderWrapper Component
 *
 * This component is responsible for fetching the current user's information and determining if they are a Master user.
 * It then renders the Header component with the appropriate props based on the user's role.
 * If there is no authenticated user, it returns null, effectively hiding the header.
 *
 * @returns The Header component with the isMaster prop or null if no user is authenticated
 */
export async function HeaderWrapper(): Promise<React.ReactElement | null> {
  const user = await getCurrentUser()

  // Don't show header if user is not authenticated
  if (!user) {
    return null
  }

  const isMaster = await checkIsMasterUser()
  return <Header isMaster={isMaster} />
}
