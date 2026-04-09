// ✅ Server Component - Static header structure

import { HeaderActions } from './HeaderActions'

interface User {
  name: string
  email: string
}

interface HeaderServerProps {
  user: User | null
  isMaster: boolean
}

/**
 * HeaderServer - Server Component for header layout
 * Renders static structure and delegates interactivity to HeaderActions
 *
 * @param props - The props for the HeaderServer component, including user information and permissions.
 * @param props.user - The user information, including name and email.
 * @param props.isMaster - Indicates if the user has master permissions.
 */
export function HeaderServer({
  isMaster,
  user,
}: HeaderServerProps): React.ReactElement | null {
  // Don't render header if no user
  if (!user) {
    return null
  }

  return (
    <header className="glass-card sticky top-0 z-40 border-b border-dark-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-text-primary">
            Sistema de Cotización
          </h1>
        </div>

        <HeaderActions
          isMaster={isMaster}
          userEmail={user.email}
          userName={user.name}
        />
      </div>
    </header>
  )
}
