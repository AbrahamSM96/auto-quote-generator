import { render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

import RegisterForm from './RegisterForm'

// Mock toast
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: mockPush,
    })),
}))

// Mock registerMasterUser
const mockRegisterMasterUser = jest.fn()
jest.mock('@/app/actions/auth-actions', () => ({
    registerMasterUser: jest.fn((...args) => mockRegisterMasterUser(...args)),
}))

// Mock signIn
const mockSignIn = jest.fn()
jest.mock('@/lib/auth-client', () => ({
    signIn: {
        email: jest.fn((...args) => mockSignIn(...args)),
    },
}))

// Mock Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

describe('RegisterForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
        // Suppress console.log and console.error in tests
        jest.spyOn(console, 'log').mockImplementation()
        jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('renders register form', () => {
        render(<RegisterForm />)

        expect(screen.getByRole('heading', { name: 'Crear Cuenta Master' })).toBeInTheDocument()
        expect(screen.getByText('Primera configuración del sistema')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument()
        expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2)
        expect(screen.getByRole('button', { name: 'Crear Cuenta Master' })).toBeInTheDocument()
    })

    it('shows link to login page', () => {
        render(<RegisterForm />)

        const loginLink = screen.getByText('¿Ya tienes cuenta? Inicia sesión')
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('shows validation errors for empty fields', async () => {
        const user = userEvent.setup({ delay: null })
        render(<RegisterForm />)

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
            expect(screen.getByText('Email inválido')).toBeInTheDocument()
            expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
        })
    })

    it('shows validation error for short password', async () => {
        const user = userEvent.setup({ delay: null })
        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], '12345')
        await user.type(passwordInputs[1], '12345')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
        })
    })

    it('shows validation error when passwords do not match', async () => {
        const user = userEvent.setup({ delay: null })
        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password456')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
        })
    })

    it('successfully registers and logs in user', async () => {
        const user = userEvent.setup({ delay: null })

        mockRegisterMasterUser.mockResolvedValueOnce({ success: true })
        mockSignIn.mockResolvedValueOnce({ error: null })

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockRegisterMasterUser).toHaveBeenCalledWith({
                email: 'user@example.com',
                name: 'Test User',
                password: 'password123',
            })
        })

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('✅ Cuenta Master creada correctamente')
        })

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                callbackURL: '/',
                email: 'user@example.com',
                password: 'password123',
            })
        })

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalled()
        })
    })

    it('shows error when registration fails', async () => {
        const user = userEvent.setup({ delay: null })

        mockRegisterMasterUser.mockResolvedValueOnce({
            error: 'Ya existe un usuario Master en el sistema',
            success: false,
        })

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Ya existe un usuario Master en el sistema')
            expect(mockSignIn).not.toHaveBeenCalled()
        })
    })

    it('redirects to login when auto-login fails', async () => {
        const user = userEvent.setup({ delay: null })

        mockRegisterMasterUser.mockResolvedValueOnce({ success: true })
        mockSignIn.mockResolvedValueOnce({ error: { message: 'Login failed' } })

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al iniciar sesión. Por favor inicia sesión manualmente.')
            expect(mockPush).toHaveBeenCalledWith('/login')
        })
    })

    it('handles exception during registration', async () => {
        const user = userEvent.setup({ delay: null })

        mockRegisterMasterUser.mockRejectedValueOnce(new Error('Network error'))

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Network error')
        })
    })

    it('disables button while loading', async () => {
        const user = userEvent.setup({ delay: null })

        // Make the promise hang so we can check loading state
        mockRegisterMasterUser.mockImplementationOnce(() => new Promise(() => {}))

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        // Check that button is disabled during loading
        await waitFor(() => {
            expect(submitButton).toBeDisabled()
        })
    })

    it('shows generic error when registration fails without error message', async () => {
        const user = userEvent.setup({ delay: null })

        mockRegisterMasterUser.mockResolvedValueOnce({
            success: false
        })

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al crear la cuenta')
        })
    })

    it('handles exception without error message', async () => {
        const user = userEvent.setup({ delay: null })

        // Reject with a non-Error object to test the fallback
        mockRegisterMasterUser.mockRejectedValueOnce('String error')

        render(<RegisterForm />)

        await user.type(screen.getByPlaceholderText('Juan Pérez'), 'Test User')
        await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')

        const passwordInputs = screen.getAllByPlaceholderText('••••••••')
        await user.type(passwordInputs[0], 'password123')
        await user.type(passwordInputs[1], 'password123')

        const submitButton = screen.getByRole('button', { name: 'Crear Cuenta Master' })
        await user.click(submitButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error al crear la cuenta')
        })
    })
})
