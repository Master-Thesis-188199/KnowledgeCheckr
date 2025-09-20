import { getUUID } from '@/src/lib/Shared/getUUID'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

describe('Verify the functionality and integrity of the insert/knowledgeCheck api route ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  it('Verify insertion of an valid knowledgeCheck instance', () => {
    const dummyCheck: KnowledgeCheck = instantiateKnowledgeCheck()
    const check = Object.assign(dummyCheck, { id: getUUID(), questions: [] } as Partial<KnowledgeCheck>)

    cy.request('POST', '/api/insert/knowledgeCheck', check)
  })

  it('Verify error handling when inserting an invalid knowledgeCheck instance', () => {
    const dummyCheck: KnowledgeCheck = instantiateKnowledgeCheck()
    const invalidCheck: Partial<KnowledgeCheck> = Object.assign(dummyCheck, { id: getUUID(), questions: [] } as Partial<KnowledgeCheck>)

    invalidCheck.name = undefined
    invalidCheck.questionCategories = []

    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', body: invalidCheck, failOnStatusCode: false }).should('have.property', 'status').and('eq', 500)
  })

  it('Verify error handling when inserting with an empty request-body', () => {
    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', failOnStatusCode: false }).should('have.property', 'status').and('eq', 500)
  })
})
