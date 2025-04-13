it("Verify that a dialog opens when the 'Add Question' button is clicked", () => {
  cy.visit('/checks/create')

  cy.get("[data-slot='dialog-trigger']").contains('Create Question').click()
  cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
  cy.get('#question-dialog').should('be.visible')
})
