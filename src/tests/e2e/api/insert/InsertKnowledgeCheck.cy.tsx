import { getUUID } from '@/src/lib/Shared/getUUID'
import { Course,instantiateCourse } from '@/src/schemas/KnowledgeCheck'

describe('Verify the functionality and integrity of the insert/knowledgeCheck api route ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  it('Verify insertion of an valid knowledgeCheck instance', () => {
    const dummyCheck: Course = instantiateCourse()
    const check = Object.assign(dummyCheck, { id: getUUID() } as Partial<Course>)

    cy.request('POST', '/api/insert/knowledgeCheck', check)
  })

  it('Verify error handling when inserting an invalid knowledgeCheck instance', () => {
    const dummyCheck: Course = instantiateCourse()
    const invalidCheck: Partial<Course> = Object.assign(dummyCheck, { id: getUUID() } as Partial<Course>)

    invalidCheck.name = undefined
    invalidCheck.questionCategories = []

    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', body: invalidCheck, failOnStatusCode: false }).should('have.property', 'status').and('eq', 400)
  })

  it('Verify error handling when inserting with an empty request-body', () => {
    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', failOnStatusCode: false }).should('have.property', 'status').and('eq', 400)
  })
})
