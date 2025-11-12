describe('Anonymous User Authentication: ', () => {
  it('Ensure users can signin anonymously and signout', () => {
    cy.visit('/account/login')

    cy.intercept('POST', '/api/auth/sign-in/anonymous').as('signin')
    cy.get("button[data-auth-provider~='anonymous']").should('exist').and('be.visible').click()
    cy.wait('@signin')

    cy.getCookie('better-auth.session_token').should('exist')
    cy.get("img[aria-label='user avatar']").should('exist').should('be.visible')

    cy.visit('/account')
    cy.intercept('POST', '/account').as('signout')
    cy.get('button[type="submit"]').contains('Signout').click()

    cy.wait('@signout')
    cy.getCookie('better-auth.session_token').should('not.exist')
  })
})
