import { generateToken } from '@/src/lib/Shared/generateToken'
import { KnowledgeCheck, instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

describe('Verify sharing of KnowledgeChecks', () => {
  it('Verify that notFound is displayed for invalid share-token', () => {
    cy.visit('/checks/some-share-token')

    cy.get('main').should('contain', 'This page could not be found')
  })

  it('Verify that using share-token starts / renders examination attempt properly', () => {
    cy.loginTestUser()
    const dummyShareToken: string = generateToken(8)

    //? Insert dummy knowledge check with share-token
    const dummyCheck: KnowledgeCheck = Object.assign(instantiateKnowledgeCheck(), { share_key: dummyShareToken } as Partial<KnowledgeCheck>)
    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', body: dummyCheck })

    cy.visit(`/checks/${dummyShareToken}`)
    cy.get('main > h1').should('contain', dummyCheck.name)
    cy.get('nav[id="exam-question-navigation"]').should('exist').children().should('have.length', dummyCheck.questions.length)
  })
})
