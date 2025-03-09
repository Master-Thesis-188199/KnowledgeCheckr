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

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      ccTask(on, config)

      on('before:browser:launch', (browser, launchOptions) => {
        const removeFlags = ['--enable-automation']
        launchOptions.args = launchOptions.args.filter((value) => !removeFlags.includes(value))
        return launchOptions
      })

      return config
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
  },
})
