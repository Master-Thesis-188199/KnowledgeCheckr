jest.mock('./src/lib/auth/requireAuthentication', () => ({
  __esModule: true, // Indicates that the module uses ES modules
  default: jest.fn(), // Mock the default export as a Jest mock function
}))
