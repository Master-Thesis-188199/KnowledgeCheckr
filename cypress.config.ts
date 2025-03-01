import { defineConfig } from 'cypress'
import ccTask from '@cypress/code-coverage/task'

export default defineConfig({
  env: {
    codeCoverage: {
      url: 'http://localhost:3000/api/coverage',
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      ccTask(on, config)

      return config
    },
  },
})
