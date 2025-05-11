it("Verify that a dialog opens when the 'Add Question' button is clicked", () => {
  cy.loginTestUser()
  cy.visit('/checks/create')

  cy.get("[data-slot='dialog-trigger']").contains('Create Question').click()
  cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
})

describe('Check: Create Question Dialog Closure Checks -', () => {
  beforeEach(() => {
    cy.loginTestUser()
    cy.visit('/checks/create')

    cy.get("[data-slot='dialog-trigger']").contains('Create Question').click()
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
    cy.get('#question-dialog').should('be.visible')
  })

  it("Verify that the dialog closes when the 'Close' button is clicked", () => {
    cy.get('#question-dialog > button').click({ force: true })
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })

  it('Verify that the dialog closes when ESC key is pressed', () => {
    cy.get('#question-dialog').type('{esc}')
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })

  it('Verify that the dialog closes when the overlay (content outside of dialog) is clicked', () => {
    cy.get('div[data-slot="dialog-overlay"]').click({ force: true })
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })

  it("Verify that the dialog closes when the 'Cancel' button is clicked", () => {
    cy.get("#question-dialog * div[data-slot='dialog-footer'] > button[type='button']").contains('Cancel').click({ force: true })
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })
})
