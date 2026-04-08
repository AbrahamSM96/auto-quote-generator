// Mock for better-auth
export const betterAuth = jest.fn(() => ({
  api: {
    getSession: jest.fn(),
  },
}))

export const prismaAdapter = jest.fn()
