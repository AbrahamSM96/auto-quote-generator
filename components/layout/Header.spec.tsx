import { render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

import { Header } from './Header'

// Mock toast
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

// Mock auth-client
const mockUseSession = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/lib/auth-client', () => ({
    signOut: jest.fn((...args) => mockSignOut(...args)),
    useSession: jest.fn(() => mockUseSession()),
}))

// Mock CreateClientModal
jest.mock('@/components/modals/CreateClientModal', () => ({
    CreateClientModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
        isOpen ? (
            <div data-testid="create-client-modal">
                <button onClick={onClose} type='button'>Close Modal</button>
            </div>
        ) : null
    ),
}))

describe('Header', () => {
    const mockSession = {
        user: {
            email: 'john@example.com',
            id: 'user-123',
            name: 'John Doe',
        },
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('does not render when there is no session', () => {
        mockUseSession.mockReturnValue({ data: null })

        const { container } = render(<Header isMaster={false} />)
        expect(container.firstChild).toBeNull()
    })

    it('renders when there is a session', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster={false} />)
        expect(screen.getByText('Sistema de Cotización')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('shows user information correctly', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster={false} />)
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('shows "Crear Usuario" button when isMaster is true', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster />)
        expect(screen.getByRole('button', { name: /Crear Usuario/i })).toBeInTheDocument()
    })

    it('does not show "Crear Usuario" button when isMaster is false', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster={false} />)
        expect(screen.queryByRole('button', { name: /Crear Usuario/i })).not.toBeInTheDocument()
    })

    it('always shows "Cerrar Sesión" button', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster={false} />)
        expect(screen.getByRole('button', { name: /Cerrar Sesión/i })).toBeInTheDocument()
    })

    it('opens CreateClientModal when "Crear Usuario" is clicked', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster />)

        // Modal should not be visible initially
        expect(screen.queryByTestId('create-client-modal')).not.toBeInTheDocument()

        // Click the "Crear Usuario" button
        const createUserButton = screen.getByRole('button', { name: /Crear Usuario/i })
        await user.click(createUserButton)

        // Modal should now be visible
        expect(screen.getByTestId('create-client-modal')).toBeInTheDocument()
    })

    it('closes CreateClientModal when onClose is called', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({ data: mockSession })

        render(<Header isMaster />)

        // Open the modal
        const createUserButton = screen.getByRole('button', { name: /Crear Usuario/i })
        await user.click(createUserButton)
        expect(screen.getByTestId('create-client-modal')).toBeInTheDocument()

        // Close the modal
        const closeButton = screen.getByRole('button', { name: 'Close Modal' })
        await user.click(closeButton)

        // Modal should be closed
        expect(screen.queryByTestId('create-client-modal')).not.toBeInTheDocument()
    })

    it('handles successful logout', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({ data: mockSession })
        mockSignOut.mockResolvedValueOnce(undefined)

        render(<Header isMaster={false} />)

        const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i })
        await user.click(logoutButton)

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled()
            expect(toast.success).toHaveBeenCalledWith('Sesión cerrada correctamente')
        })
    })

    it('handles logout error', async () => {
        const user = userEvent.setup()

        mockUseSession.mockReturnValue({ data: mockSession })
        mockSignOut.mockRejectedValueOnce(new Error('Logout failed'))

        render(<Header isMaster={false} />)

        const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i })
        await user.click(logoutButton)

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled()
        })
    })

    it('renders header with correct structure', () => {
        mockUseSession.mockReturnValue({ data: mockSession })

        const { container } = render(<Header isMaster={false} />)

        // Check for header element
        const header = container.querySelector('header')
        expect(header).toBeInTheDocument()
        expect(header).toHaveClass('glass-card', 'sticky', 'top-0')
    })

    it('handles session with missing user data gracefully', () => {
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    email: undefined,
                    name: undefined,
                }
            }
        })

        render(<Header isMaster={false} />)
        expect(screen.getByText('Sistema de Cotización')).toBeInTheDocument()
    })
})
