describe('Better Auth: Email Authentication - ', () => {
  it('verify that users can signup', () => {
    const random_email = `test${Math.floor(Math.random() * 10000)}@example.com`
    cy.visit('/account/login?type=signup')

    // cy.get('input[name="name"]').should('be.visible').type('Test User')
    cy.get('input[name="name"]').filter(':visible').type('Test User')
    cy.get('input[name="email"]').filter(':visible').type(random_email)
    cy.get('input[name="password"]').filter(':visible').type('1234567890')

    cy.get('button[type="submit"]').filter(':visible').click()

    // Verify redirect after signup
    cy.url().should('equal', `${Cypress.config('baseUrl')}/`)
  })
})
