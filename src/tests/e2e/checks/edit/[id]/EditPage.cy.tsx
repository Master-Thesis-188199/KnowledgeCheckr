describe('Edit KnowledgeCheck page: ', () => {
  it('Verify that users must be logged in to access the edit page', () => {
    cy.visit('/checks/edit/12931293')
    cy.get('main').should('contain', "You're not authorized to access this page")
  })

  it('Verify that users can access the edit page when logged in', () => {
    cy.loginTestUser()
    cy.visit('/checks/edit/1239')

    cy.get('main').should('contain', 'This page could not be found')
  })

  it('Verify that users can edit an existing knowledge check that they own', () => {
    cy.loginTestUser()

    cy.visit('/checks/create')
    cy.get('input[name="name"]').type('Test Check Title')

    //* Switch to last stage to save check
    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).children().last().click()
    cy.get('button').contains('Save').should('exist').scrollIntoView().should('be.visible').click()

    //? Ensure that the check was created and the user is redirected
    cy.wait(750)
    cy.visit('/checks')

    cy.get("main * a[href^='/checks/edit/']").first().click()
  })
})
