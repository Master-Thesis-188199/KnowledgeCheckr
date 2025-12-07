import { generateToken } from '@/src/lib/Shared/generateToken'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

describe('ExaminationAttempt Suite: ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })

  it('Verify that attempt is automatically closed when time-frame is reached', () => {
    const check = instantiateKnowledgeCheck()
    check.settings.examTimeFrameSeconds = 60
    check.share_key = generateToken(8) + '-time-frame'

    cy.request('POST', '/api/insert/knowledgeCheck', check).should('have.property', 'status').and('eq', 200)

    cy.visit(`/checks/${check.share_key}`)
    cy.get('h1').contains(check.name).should('exist').and('be.visible')

    cy.intercept('POST', `/checks/${check.share_key}`).as('finishAttemptAction')

    cy.wait('@finishAttemptAction', { timeout: check.settings.examTimeFrameSeconds * 1000 })
      .its('response.statusCode')
      .should('eq', 200)
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_BASE_URL')}/checks`)
  })
})
