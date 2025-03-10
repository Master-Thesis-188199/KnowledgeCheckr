describe('Page Load Tests - ', () => {
  it('ensure page is accessible', () => {
    const baseUrl = Cypress.env('BASE_URL')
    cy.visit(baseUrl)
  })
})
