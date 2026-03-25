import console from 'console'
import { createTranslator } from '@/cypress/support/i18n'

jest.mock('./src/lib/auth/requireAuthentication', () => ({
  __esModule: true, // Indicates that the module uses ES modules
  default: jest.fn(), // Mock the default export as a Jest mock function
}))

//* Removes jest test console.log annotations
global.console = console

jest.mock('./src/i18n/server-localization', () => ({
  __esModule: true, // Indicates that the module uses ES modules
  getI18n: createTranslator,
  getScopedI18n: createTranslator,
}))
