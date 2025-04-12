import cypress from 'cypress'

describe('Better Auth: Email Authentication - ', () => {
  it('verify that users can switch between login and signup', () => {
    cy.visit('/account/login?type=signin')
    cy.get('main * a[href*="/account/login"]').filter(':visible').click()

    cy.url().should('include', '/account/login?type=signup')
    cy.get('main * a[href*="/account/login"]').filter(':visible').click()

    cy.url().should('include', '/account/login?type=signin')
  })

  it('verify that users can signup', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signup(USERNAME, EMAIL, '1234567890')

    // Verify redirect after signup
    cy.url().should('equal', `${Cypress.config('baseUrl')}/`)

    cy.task('removeDBUser', {
      email: EMAIL,
      username: USERNAME,
    })
  })

  it('verify that users can logout again after signup', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signup(USERNAME, EMAIL, '1234567890')

    // Verify redirect after signup
    cy.url().should('equal', `${Cypress.config('baseUrl')}/`)

    cy.visit('/account')
    cy.get('main * span').filter(':visible').contains(EMAIL).should('be.visible')
    cy.get('main * span').filter(':visible').contains(USERNAME).should('be.visible')
    cy.get('main * button').contains('Signout').filter(':visible').click()

    cy.url().should('equal', `${Cypress.config('baseUrl')}/account/login`)

    cy.task('removeDBUser', {
      email: EMAIL,
      username: USERNAME,
    })
  })

  it("verify that users that are not logged in can't access the account page", () => {
    cy.visit('/account')
    cy.url().should('equal', `${Cypress.config('baseUrl')}/account/login`)
  })
})
