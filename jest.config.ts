import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  verbose: true,
  testMatch: ['<rootDir>/src/tests/unit/**/*.test.tsx', '<rootDir>/src/tests/unit/**/*.test.ts', '<rootDir>/src/tests/integration/**/*.test.tsx', '<rootDir>/src/tests/integration/**/*.test.ts'],
  testEnvironment: 'node',
  maxWorkers: '50%',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
  // Add more setup options before each test is run
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
