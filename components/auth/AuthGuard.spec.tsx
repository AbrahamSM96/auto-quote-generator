import { render, screen, waitFor } from '@testing-library/react'

import { AuthGuard } from './AuthGuard'

// Mock Next.js navigation hooks
const mockPush = jest.fn()
const mockPathname = jest.fn()

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => mockPathname()),
    useRouter: jest.fn(() => ({
        push: mockPush,
    })),
}))

// Mock auth-client
const mockUseSession = jest.fn()

jest.mock('@/lib/auth-client', () => ({
    useSession: jest.fn(() => mockUseSession()),
}))

describe('AuthGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Loading states', () => {
        it('shows loading spinner when session is pending', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: true,
            })
            mockPathname.mockReturnValue('/dashboard')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            // Should show loading spinner
            const loadingDots = document.querySelectorAll('.animate-pulse')
            expect(loadingDots.length).toBeGreaterThan(0)

            // Should not show children
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
        })

        it('shows loading spinner while redirecting to login', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: false,
            })
            mockPathname.mockReturnValue('/dashboard')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            // Should show loading spinner during redirect
            const loadingDots = document.querySelectorAll('.animate-pulse')
            expect(loadingDots.length).toBeGreaterThan(0)
        })

        it('shows loading spinner while redirecting to home', () => {
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })
            mockPathname.mockReturnValue('/login')

            render(
                <AuthGuard>
                    <div>Login Form</div>
                </AuthGuard>
            )

            // Should show loading spinner during redirect
            const loadingDots = document.querySelectorAll('.animate-pulse')
            expect(loadingDots.length).toBeGreaterThan(0)
        })
    })

    describe('Protected routes (not /login or /register)', () => {
        it('redirects to login when user is not authenticated', async () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: false,
            })
            mockPathname.mockReturnValue('/dashboard')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=%2Fdashboard')
            })

            // Should not render children
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
        })

        it('renders children when user is authenticated', () => {
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })
            mockPathname.mockReturnValue('/dashboard')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            expect(screen.getByText('Protected Content')).toBeInTheDocument()
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('encodes callback URL correctly for nested routes', async () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: false,
            })
            mockPathname.mockReturnValue('/quotations/123/edit')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=%2Fquotations%2F123%2Fedit')
            })
        })
    })

    describe('Public routes (/login, /register)', () => {
        it('renders children on /login when user is not authenticated', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: false,
            })
            mockPathname.mockReturnValue('/login')

            render(
                <AuthGuard>
                    <div>Login Form</div>
                </AuthGuard>
            )

            expect(screen.getByText('Login Form')).toBeInTheDocument()
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('renders children on /register when user is not authenticated', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: false,
            })
            mockPathname.mockReturnValue('/register')

            render(
                <AuthGuard>
                    <div>Register Form</div>
                </AuthGuard>
            )

            expect(screen.getByText('Register Form')).toBeInTheDocument()
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('redirects to home when authenticated user visits /login', async () => {
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })
            mockPathname.mockReturnValue('/login')

            render(
                <AuthGuard>
                    <div>Login Form</div>
                </AuthGuard>
            )

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/')
            })

            // Should not render children
            expect(screen.queryByText('Login Form')).not.toBeInTheDocument()
        })

        it('redirects to home when authenticated user visits /register', async () => {
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })
            mockPathname.mockReturnValue('/register')

            render(
                <AuthGuard>
                    <div>Register Form</div>
                </AuthGuard>
            )

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/')
            })

            // Should not render children
            expect(screen.queryByText('Register Form')).not.toBeInTheDocument()
        })
    })

    describe('Loading spinner structure', () => {
        it('renders loading spinner with correct classes', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: true,
            })
            mockPathname.mockReturnValue('/dashboard')

            const { container } = render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            // Check for container classes
            const loadingContainer = container.querySelector('.min-h-screen')
            expect(loadingContainer).toBeInTheDocument()
            expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center', 'bg-dark-bg')

            // Check for three animated dots
            const animatedDots = container.querySelectorAll('.animate-pulse')
            expect(animatedDots).toHaveLength(3)
        })
    })

    describe('Edge cases', () => {
        it('does not redirect when session is pending', () => {
            mockUseSession.mockReturnValue({
                data: null,
                isPending: true,
            })
            mockPathname.mockReturnValue('/dashboard')

            render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            // Should not redirect while pending
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('handles root path correctly', () => {
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })
            mockPathname.mockReturnValue('/')

            render(
                <AuthGuard>
                    <div>Home Content</div>
                </AuthGuard>
            )

            expect(screen.getByText('Home Content')).toBeInTheDocument()
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('handles session changing from pending to authenticated', async () => {
            const { rerender } = render(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            // Initially pending
            mockUseSession.mockReturnValue({
                data: null,
                isPending: true,
            })
            mockPathname.mockReturnValue('/dashboard')

            rerender(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()

            // Session loads successfully
            mockUseSession.mockReturnValue({
                data: { user: { id: '123', name: 'Test User' } },
                isPending: false,
            })

            rerender(
                <AuthGuard>
                    <div>Protected Content</div>
                </AuthGuard>
            )

            expect(screen.getByText('Protected Content')).toBeInTheDocument()
        })
    })
})
