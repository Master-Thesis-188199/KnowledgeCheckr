describe('Verify sharing of KnowledgeChecks', () => {
  it('Verify that notFound is displayed for invalid share-token', () => {
    cy.visit('/checks/some-share-token')

    cy.get('main').should('contain', 'This page could not be found')
  })
})
