describe('Mobile-Sidebar TestSuite: ', () => {
  it('Verify that the mobile sidebar can be opened and closed via buttons', () => {
    cy.viewport('iphone-x')
    cy.visit('/')

    cy.get("button[aria-label='open mobile sidebar']").should('be.visible').click()

    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('be.visible')

    cy.get('#mobile-sidebar-dialog * button[aria-label="close mobile sidebar"]').should('be.visible').click()
    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('not.be.visible')
  })

  it('Verify that mobile sidebar can be closed by clicking on blurred overlay', () => {
    cy.viewport('iphone-x')
    cy.visit('/')

    cy.get("button[aria-label='open mobile sidebar']").should('be.visible').click()

    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('be.visible')

    cy.get('#mobile-sidebar-dialog').parent().children().filter(':not(#mobile-sidebar-dialog)').click()
    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('not.be.visible')
  })

  it('Verify that the sidebar is closed when item is clicked (onNavigate)', () => {
    cy.viewport('iphone-x')
    cy.visit('/')

    cy.get("button[aria-label='open mobile sidebar']").should('be.visible').click()

    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('be.visible')

    cy.get('#mobile-sidebar-dialog * a[aria-label="sidebar item"]').should('be.visible').filter(':not(a[href="/"])').filter(":not(a[href*='login'])").first().click()
    cy.wait(500)
    cy.get('#mobile-sidebar-dialog').should('not.be.visible')
  })
})
