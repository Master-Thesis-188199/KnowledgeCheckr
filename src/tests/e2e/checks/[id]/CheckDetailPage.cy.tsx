it('Verify that the page is unaccessible for unauthenticated users', () => {
  const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
  cy.intercept('GET', `${baseUrl}/checks/some-check-id`).as('intercept-page-response')

  cy.visit('/checks/some-check-id', { failOnStatusCode: false })

  cy.wait('@intercept-page-response').its('response.statusCode').should('eq', 401)
})

it('Verify that authenticated users cannot access non-existing check', () => {
  const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
  cy.intercept('GET', `${baseUrl}/checks/some-check-id`).as('intercept-page-response')

  cy.loginTestUser()
  cy.visit('/checks/some-check-id', { failOnStatusCode: false })

  cy.wait('@intercept-page-response').its('response.statusCode').should('eq', 404)
})
