import { defineConfig } from 'cypress'
import ccTask from '@cypress/code-coverage/task'
import { GitHubSocialLogin, GoogleSocialLogin } from 'cypress-social-logins/src/Plugins'

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    codeCoverage: {
      url: 'http://localhost:3000/api/coverage',
    },
  },
  component: {
    defaultBrowser: 'chrome',
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
    defaultBrowser: 'chrome',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      ccTask(on, config)

      on('task', {
        GoogleSocialLogin: GoogleSocialLogin,
        GitHubSocialLogin: GitHubSocialLogin,
      })

      on('before:browser:launch', (browser, launchOptions) => {
        const removeFlags = ['--enable-automation']
        launchOptions.args = launchOptions.args.filter((value) => !removeFlags.includes(value))

        launchOptions.args.push('--no-sandbox')
        launchOptions.args.push('--disable-setuid-sandbox')

        return launchOptions
      })

      return config
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
  },
})
