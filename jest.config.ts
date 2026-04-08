import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'babel',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'lib/utils.ts',
    // Excluir archivos que no necesitan tests unitarios
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.ts',
    '!app/**/page.tsx', // Páginas de Next.js (difíciles de testear con unit tests)
    '!app/**/layout.tsx', // Layouts de Next.js
    '!app/api/**/*', // API routes
    '!app/actions/**/*', // Server Actions (mejor testear con E2E)
    '!app/**/actions.ts', // Server Actions en rutas
    '!components/providers/**/*', // Providers (AuthProvider, etc.)
    '!components/layout/HeaderWrapper.tsx', // Server Component wrapper
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 91,
      functions: 99,
      lines: 100,
      statements: 100,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
