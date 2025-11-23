describe('Better Auth: Social Provider Authentication - ', () => {
  it('verify that users can signin using GitHub', () => {
    cy.visit('/account/login?type=signin')

    cy.intercept('POST', '/api/auth/sign-in/social', cy.spy()).as('github-signin')
    cy.get('[aria-label="SignIn using GitHub"]').filter(':visible').click()

    cy.wait('@github-signin').its('response.statusCode').should('eq', 200)
  })

  it('verify that users can signin using Google', () => {
    cy.visit('/account/login?type=signin')

    cy.intercept('POST', '/api/auth/sign-in/social', cy.spy()).as('google-signin')
    cy.get('[aria-label="SignIn using Google"]').filter(':visible').click()

    cy.wait('@google-signin').its('response.statusCode').should('eq', 200)
  })
})
