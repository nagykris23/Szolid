module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { strict: false, noImplicitReturns: false } }],
  },
};