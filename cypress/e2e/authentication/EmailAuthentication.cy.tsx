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

    cy.signUp(USERNAME, EMAIL, '1234567890')

    cy.removeDBUser(EMAIL, USERNAME)
  })

  it('verify that users can logout again after signup', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signUp(USERNAME, EMAIL, '1234567890')

    cy.visit('/account')
    cy.get('main * span').filter(':visible').contains(EMAIL).should('be.visible')
    cy.get('main * span').filter(':visible').contains(USERNAME).should('be.visible')
    cy.signOut()

    cy.url().should('equal', `${Cypress.config('baseUrl')}/account/login`)

    cy.removeDBUser(EMAIL, USERNAME)
  })

  it("verify that users that are not logged in can't access the account page", () => {
    cy.visit('/account')
    cy.url().should('equal', `${Cypress.config('baseUrl')}/account/login`)
  })

  it('verify that users that are logged in cannot access sign- in/up page', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signUp(USERNAME, EMAIL, '1234567890')

    cy.visit('/account/login?type=signin')
    cy.url().should('equal', `${Cypress.config('baseUrl')}/account`)

    cy.visit('/account/login?type=signup')
    cy.url().should('equal', `${Cypress.config('baseUrl')}/account`)

    cy.removeDBUser(EMAIL, USERNAME)
  })

  it.only('verify that users can sign-in using email and password after having signed up', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signUp(USERNAME, EMAIL, '1234567890')
    cy.signOut()

    cy.login(EMAIL, '1234567890')
  })
})
