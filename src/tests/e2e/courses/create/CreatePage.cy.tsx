import { Any } from '@/types'

it('Verify that the page is unaccessible for unauthenticated users', () => {
  cy.visit('/courses/create')

  cy.get('main').should('contain', "You're not authorized to access this page")
})

describe('/courses/create - Create Page ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  it('Verify that the page is accessible for authenticated users', () => {
    cy.intercept('GET', 'http://localhost:3000/courses/create').as('intercept-page-response')

    cy.visit('/courses/create')

    cy.wait('@intercept-page-response').its('response.statusCode').should('eq', 200)
  })

  it('Verify that save-course button calls save server-action', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    cy.visit('/courses/create')

    //* Switch to last stage to save course
    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).children().last().click()

    cy.intercept('POST', `${baseUrl}/courses/create`).as('intercept-create-response')
    cy.get("[aria-label='save course']").should('exist').click({ force: true })

    cy.wait('@intercept-create-response').then((interception) => {
      const request = interception.request
      const body: Array<Any> = JSON.parse(request.body)
      const response = interception.response

      expect(body.at(0)).to.have.property('course')
      expect(response?.statusCode).to.eq(303)
    })
  })
})
