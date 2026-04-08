import { render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

import { CreateClientModal } from './CreateClientModal'

// Mock toast
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

// Mock createClientUser action
const mockCreateClientUser = jest.fn()
jest.mock('@/app/actions/user-actions', () => ({
    createClientUser: jest.fn((...args) => mockCreateClientUser(...args)),
}))

describe('CreateClientModal', () => {
    const mockOnClose = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('does not render when isOpen is false', () => {
        render(<CreateClientModal isOpen={false} onClose={mockOnClose} />)
        expect(screen.queryByText('Crear Usuario Client')).not.toBeInTheDocument()
    })

    it('renders when isOpen is true', () => {
        render(<CreateClientModal isOpen onClose={mockOnClose} />)
        expect(screen.getByText('Crear Usuario Client')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    })

    it('shows validation errors for empty fields', async () => {
        const user = userEvent.setup()
        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
            expect(screen.getByText('Email inválido')).toBeInTheDocument()
            expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
        })
    })

    it('shows validation error for short name', async () => {
        const user = userEvent.setup()
        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        const nameInput = screen.getByPlaceholderText('Juan Pérez')
        await user.type(nameInput, 'A')

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
        })
    })

    it('shows validation error for short password', async () => {
        const user = userEvent.setup()
        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        const passwordInput = screen.getByPlaceholderText('••••••••')
        await user.type(passwordInput, '12345')

        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
        })
    })

    it('successfully creates a client user', async () => {
        const user = userEvent.setup()

        mockCreateClientUser.mockResolvedValueOnce({ success: true })

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'juan@example.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockCreateClientUser).toHaveBeenCalledWith({
                email: 'juan@example.com',
                name: 'Juan Pérez',
                password: 'password123',
            })
            expect(toast.success).toHaveBeenCalledWith('Usuario Client creado correctamente')
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it('shows error message when server returns error', async () => {
        const user = userEvent.setup()

        mockCreateClientUser.mockResolvedValueOnce({
            error: 'El usuario ya existe',
            success: false,
        })

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'juan@example.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('El usuario ya existe')
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it('shows generic error message when server returns error without message', async () => {
        const user = userEvent.setup()

        mockCreateClientUser.mockResolvedValueOnce({
            success: false
        })

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'juan@example.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al crear usuario')
        })
    })

    it('handles exception during submit', async () => {
        const user = userEvent.setup()
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

        mockCreateClientUser.mockRejectedValueOnce(new Error('Network error'))

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'juan@example.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al crear usuario')
            expect(consoleLogSpy).toHaveBeenCalled()
            expect(mockOnClose).not.toHaveBeenCalled()
        })

        consoleLogSpy.mockRestore()
    })

    it('closes modal and resets form when cancel is clicked', async () => {
        const user = userEvent.setup()
        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in some data
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan')

        // Click cancel
        const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
        await user.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it('disables buttons while loading', async () => {
        const user = userEvent.setup()

        // Make the promise hang so we can check loading state
        mockCreateClientUser.mockImplementationOnce(() => new Promise(() => {}))

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        // Fill in the form
        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'juan@example.com')
        await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        // Check that buttons are disabled during loading
        await waitFor(() => {
            expect(submitButton).toBeDisabled()
            expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
        })
    })

    it('resets form after successful submission', async () => {
        const user = userEvent.setup()

        mockCreateClientUser.mockResolvedValueOnce({ success: true })

        render(<CreateClientModal isOpen onClose={mockOnClose} />)

        const nameInput = screen.getByPlaceholderText('Juan Pérez') as HTMLInputElement
        const emailInput = screen.getByPlaceholderText('correo@ejemplo.com') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement

        // Fill in the form
        await user.type(nameInput, 'Juan Pérez')
        await user.type(emailInput, 'juan@example.com')
        await user.type(passwordInput, 'password123')

        // Verify form is filled
        expect(nameInput.value).toBe('Juan Pérez')

        // Submit the form
        const submitButton = screen.getByRole('button', { name: 'Crear Usuario' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled()
        })
    })
})
