module.exports = {
  // Test omgeving
  testEnvironment: 'node',
  
  // Test bestanden
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js',
  ],
  
  // Coverage configuratie
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js', // Exclusief main app file vanwege server start
    '!**/node_modules/**',
    '!**/tests/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],
  
  // Setup en teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout voor tests
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks tussen tests
  clearMocks: true,
  
  // Restore mocks na elke test
  restoreMocks: true,
};
