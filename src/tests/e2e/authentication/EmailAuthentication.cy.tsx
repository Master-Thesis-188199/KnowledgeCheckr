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

  it('verify that users can sign-in using email and password after having signed up', () => {
    const EMAIL = `test${Math.floor(Math.random() * 10000)}@example.com`
    const USERNAME = `Test User`

    cy.signUp(USERNAME, EMAIL, '1234567890')
    cy.signOut()

    cy.visit('/account')

    cy.login(EMAIL, '1234567890')
  })

  it('Verify that an user cannot signup with the same credentials twice', () => {
    const EMAIL = `test@email.com`
    const USERNAME = `Test User`

    cy.visit('/account/login?type=signup')

    cy.get('input[name="name"]').filter(':visible').type(USERNAME)
    cy.get('input[name="email"]').filter(':visible').type(EMAIL)
    cy.get('input[name="password"]').filter(':visible').type(Math.random().toString(36).slice(2, 10))

    cy.intercept('POST', '/account/login?type=signup').as('signup-request')
    cy.get('button[type="submit"]').filter(':visible').click()

    cy.wait('@signup-request').then((interception) => {
      const response = interception.response
      const responseBody = response?.body.toString().split('1:').at(-1)
      const body = JSON.parse(responseBody)

      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('success')
      expect(body.success).to.equal(false)
    })

    cy.get('main * #signup-form [aria-label="field-error-root"]').should('exist')
    cy.get('main * #signup-form [aria-label="field-error-root"]').contains('User already exists!')
  })

  it('Verify that sign-up client-side field errors are displayed on invalid input', () => {
    const EMAIL = `invalid-email`
    const PASSWORD = `123`

    cy.visit('/account/login?type=signup')

    cy.get('input[name="name"]').filter(':visible').type('Some username')
    cy.get('input[name="name"]').filter(':visible').clear()
    cy.get('input[name="email"]').filter(':visible').type(EMAIL)
    cy.get('input[name="password"]').filter(':visible').type(PASSWORD)

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('main * #signup-form [data-field-error="name"]').should('exist')
    cy.get('main * #signup-form [data-field-error="email"]').should('exist')
    cy.get('main * #signup-form [data-field-error="password"]').should('exist')
  })

  it('Verify that login client-side field errors are displayed on invalid input', () => {
    const EMAIL = `invalid-email`
    const PASSWORD = `123`

    cy.visit('/account/login?type=login')

    cy.get('input[name="email"]').filter(':visible').type(EMAIL)
    cy.get('input[name="password"]').filter(':visible').type(PASSWORD)

    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('button[type="submit"]').click({ force: true })

    cy.get('main * #login-form [data-field-error="email"]').should('exist')
    cy.get('main * #login-form [data-field-error="password"]').should('exist')
  })

  it('Verify that error is displayed when logging in with wrong credentials', () => {
    cy.visit('/account/login?type=signin')

    cy.get('input[name="email"]').filter(':visible').type('test@email.com')
    cy.get('input[name="password"]').filter(':visible').type('wrongpassword')

    cy.intercept('POST', '/account/login?type=signin').as('login-request')
    cy.get('button[type="submit"]').filter(':visible').click()
    cy.wait('@login-request').then((interception) => {
      const response = interception.response
      const responseBody = response?.body.toString().split('1:').at(-1)
      const body = JSON.parse(responseBody)

      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('success')
      expect(body.success).to.equal(false)
    })

    cy.get('main * #login-form [aria-label="field-error-root"]').should('exist')
    cy.get('main * #login-form [aria-label="field-error-root"]').contains('Wrong e-mail address or password.')
  })
})
