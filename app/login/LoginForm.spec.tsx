import { render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'

import LoginForm from './LoginForm'

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

// Mock useSearchParams
const mockGet = jest.fn()
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: mockGet,
  })),
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

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockReturnValue(null) // Default: no callbackUrl
    // Suppress console.log in tests
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders login form', () => {
    render(<LoginForm />)

    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByText('Ingresa tus credenciales para acceder')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument()
  })

  it('shows link to register page', () => {
    render(<LoginForm />)

    const registerLink = screen.getByText('¿No tienes cuenta? Regístrate')
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), '12345')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })
  })

  it('successfully logs in and redirects to home', async () => {
    const user = userEvent.setup()

    mockSignIn.mockResolvedValueOnce({ error: null })
    mockGet.mockReturnValue(null) // No callbackUrl, should redirect to '/'

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        callbackURL: '/',
        email: 'user@example.com',
        password: 'password123',
      })
      expect(toast.success).toHaveBeenCalledWith('Sesión iniciada correctamente')
    })
  })

  it('successfully logs in and redirects to callbackUrl', async () => {
    const user = userEvent.setup()

    mockSignIn.mockResolvedValueOnce({ error: null })
    mockGet.mockReturnValue('/dashboard')

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        callbackURL: '/dashboard',
        email: 'user@example.com',
        password: 'password123',
      })
      expect(toast.success).toHaveBeenCalledWith('Sesión iniciada correctamente')
    })
  })

  it('shows error message when signIn returns error', async () => {
    const user = userEvent.setup()

    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } })

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email o contraseña incorrectos')
    })
  })

  it('disables button while loading', async () => {
    const user = userEvent.setup()

    // Make the promise hang so we can check loading state
    mockSignIn.mockImplementationOnce(() => new Promise(() => {}))

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    // Check that button is disabled during loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('re-enables button after error', async () => {
    const user = userEvent.setup()

    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid credentials' } })

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword')

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' })
    await user.click(submitButton)

    // Wait for error to be shown
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).not.toBeDisabled()
    })
  })
})
