/* eslint-disable @typescript-eslint/ban-ts-comment */
describe('NextAuth Authenthication - ', () => {
  it('Examplary e2e Test', () => {
    cy.visit('/')
    cy.contains('Please Sign In')
  })

  it('Login using Google', () => {
    const username = Cypress.env('GOOGLE_USERNAME')
    const password = Cypress.env('GOOGLE_PASSWORD')
    const cookieName = 'next-auth.session-token'
    const baseUrl = Cypress.env('BASE_URL')

    cy.task('GoogleSocialLogin', {
      username,
      password,
      // loginUrl: 'http://localhost:3000/api/auth/signin',
      loginUrl: baseUrl + '/api/auth/signin',
      cookieName,
      headless: true,
      loginSelector: `form[action='http://localhost:3000/api/auth/signin/google']`,
      postLoginSelector: '#yDmH0d > c-wiz > div > div.JYXaTc.F8PBrb > div > div > div:nth-child(2) > div > div > button > span',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
      // @ts-ignore
      .then(({ cookies }) => {
        cy.clearCookies()

        const cookie = cookies
          // @ts-ignore
          .filter((cookie) => cookie.name === cookieName)
          .pop()

        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          })

          // @ts-ignore
          Cypress.Cookies.defaults({
            preserve: cookieName,
          })
        }
      })

    cy.log('Finished login using Google')
  })
})
