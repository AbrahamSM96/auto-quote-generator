// Learn more: https://github.com/testing-library/jest-dom
import { TextDecoder, TextEncoder } from 'util'
import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for Jest environment
Object.assign(global, {
  TextDecoder,
  TextEncoder,
})

// Polyfill Fetch API for Jest environment
/**
 *
 */
global.Request = class Request {} as any
/**
 *
 */
global.Response = class Response {} as any
/**
 *
 */
global.Headers = class Headers {} as any

// Mock Next.js modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
}))

// Mock auth modules to avoid Better Auth ESM issues
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth-helpers', () => ({
  getSession: jest.fn(),
  getMasterUser: jest.fn(),
  isMasterUser: jest.fn(),
}))

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  /**
   *
   * @param {...any} args
   */
  console.error = (...args: any[]) => {
    // Suppress jsdom navigation errors
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: navigation')
    ) {
      return
    }
    // Suppress act() warnings - we handle them properly in tests
    if (
      typeof args[0] === 'string' &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
