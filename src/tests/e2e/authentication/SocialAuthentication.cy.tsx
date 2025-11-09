describe('Better Auth: Social Provider Authentication - ', () => {
  it('verify that users can signin using GitHub', () => {
    cy.visit('/account/login?type=signin')

    cy.get('[aria-label="SignIn using GitHub"]').filter(':visible').click()

    cy.url().should('include', 'github.com/login?client_id=')
  })

  it('verify that users can signin using Google', () => {
    cy.visit('/account/login?type=signin')

    cy.get('[aria-label="SignIn using Google"]').filter(':visible').click()

    cy.wait(3000)
    cy.origin('https://accounts.google.com', () => {
      cy.url().should('include', 'accounts.google.com')
    })
  })
})
