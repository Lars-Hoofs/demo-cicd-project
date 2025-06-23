// Test setup voor Jest
const dotenv = require('dotenv');

// Laad test omgevingsvariabelen
dotenv.config({ path: '.env.test' });

// Set NODE_ENV voor tests
process.env.NODE_ENV = 'test';

// Verhoog timeout voor async tests
jest.setTimeout(10000);

// Global setup voor alle tests
beforeAll(() => {
  // Global setup code hier
  console.log('Starting test suite...');
});

afterAll(() => {
  // Global cleanup code hier
  console.log('Test suite completed.');
});

// Setup voor elke test
beforeEach(() => {
  // Reset modules en mocks voor elke test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup na elke test
  jest.restoreAllMocks();
});

// Global test helpers
global.testHelpers = {
  // Helper functions voor tests
  createMockUser: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    created: new Date('2024-01-01'),
    ...overrides,
  }),
  
  createMockRequest: (overrides = {}) => ({
    method: 'GET',
    path: '/',
    ip: '127.0.0.1',
    get: jest.fn(),
    ...overrides,
  }),
  
  createMockResponse: (overrides = {}) => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    ...overrides,
  }),
};
