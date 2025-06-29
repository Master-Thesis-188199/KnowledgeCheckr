it('Verify cannot access non-existing check', () => {
  cy.visit('/checks/some-check-id')

  cy.get('main').should('contain', 'This page could not be found')
})
