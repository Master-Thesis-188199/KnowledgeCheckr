it('Verify that the page is unaccessible for unauthenticated users', () => {
  cy.visit('/checks/some-check-id', { failOnStatusCode: false })
  cy.get('main').should('contain', "You're not authorized to access this page")
})

it('Verify that authenticated users cannot access non-existing check', () => {
  const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
  cy.intercept('GET', `${baseUrl}/checks/some-check-id`).as('intercept-page-response')

  cy.loginTestUser()
  cy.visit('/checks/some-check-id', { failOnStatusCode: false })

  cy.get('main').should('contain', 'This page could not be found')
})
