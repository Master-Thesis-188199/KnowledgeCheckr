describe('Page Load Tests - ', () => {
  it('ensure page is accessible', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    cy.visit(baseUrl)
  })
})
