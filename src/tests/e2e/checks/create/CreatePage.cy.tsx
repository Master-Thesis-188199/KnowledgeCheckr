import { Any } from '@/types'

it('Verify that the page is unaccessible for unauthenticated users', () => {
  cy.visit('/checks/create')

  cy.get('main').should('contain', "You're not authorized to access this page")
})

describe('/checks/create - Create Page ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  it('Verify that the page is accessible for authenticated users', () => {
    cy.intercept('GET', 'http://localhost:3000/checks/create').as('intercept-page-response')

    cy.visit('/checks/create')

    cy.wait('@intercept-page-response').its('response.statusCode').should('eq', 200)
  })

  it('Verify that save-check button calls save server-action', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    cy.visit('/checks/create')

    //* Switch to last stage to save check
    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).children().last().click()

    cy.intercept('POST', `${baseUrl}/checks/create`).as('intercept-create-response')
    cy.get("[aria-label='save knowledge check']").should('exist').click({ force: true })

    cy.wait('@intercept-create-response').then((interception) => {
      const request = interception.request
      const body: Array<Any> = JSON.parse(request.body)
      const response = interception.response

      expect(body.at(0)).to.have.property('check')
      expect(response?.statusCode).to.eq(303)
    })
  })
})
