import { Any } from '@/types'

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

  it('Ensure anonymous users can create KnowledgeChecks', () => {
    cy.loginAnonymously()

    cy.visit('/checks/create')

    cy.get('input[name="check-name"]').type('Example Anonymous Check')

    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).children().last().click()
    cy.intercept('POST', `/checks/create`).as('create-server-action')
    cy.get("[aria-label='save knowledge check']").should('exist').click({ force: true })

    cy.wait('@create-server-action').then((interception) => {
      const request = interception.request
      const body: Array<Any> = JSON.parse(request.body)
      const response = interception.response

      expect(body.at(0)).to.have.property('check')
      expect(response?.statusCode).to.eq(303)
    })
  })
})
