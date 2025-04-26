import env from '@/src/lib/Shared/Env'
import ccTask from '@cypress/code-coverage/task'
import { defineConfig } from 'cypress'
import { GitHubSocialLogin, GoogleSocialLogin } from 'cypress-social-logins/src/Plugins'
import * as dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    codeCoverage: {
      url: `${env.NEXT_PUBLIC_BASE_URL}/api/coverage`,
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
      const connection = mysql.createConnection({
        host: env.DATABASE_HOST,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
      })

      // implement node event listeners here
      ccTask(on, config)

      on('task', {
        GoogleSocialLogin: GoogleSocialLogin,
        GitHubSocialLogin: GitHubSocialLogin,
        removeDBUser({ email, username }: { email: string; username: string }) {
          return new Promise(async (resolve, reject) => {
            connection.beginTransaction(console.error)

            connection.query(`DELETE s FROM Session s JOIN User u ON s.user_id = u.id WHERE u.name = '${username}' AND u.email = '${email}';`)
            connection.query(`DELETE a FROM Account a JOIN User u ON a.user_id = u.id WHERE u.name = '${username}' AND u.email = '${email}';`)
            const result = await connection.promise().query(`DELETE FROM User WHERE name = '${username}' AND email = '${email}';`)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            connection.commit((err) => (err ? reject(err) : resolve(`${(result.at(0) as any)?.affectedRows} rows deleted`)))
          })
        },
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
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
    chromeWebSecurity: false,
  },
})
