import { KnowledgeCheck, safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

describe('SessionStorageCache', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.loginTestUser()
    cy.visit('/checks/create')
  })

  it('Verify that create-store-state is stored in sessionStorage', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    const DUMMY_NAME = 'Test Check'

    cy.getAllSessionStorage().should('deep.equal', {}, 'Verify that sessionStorage is empty at the beginning')

    cy.get("input[name='check-name']").type(DUMMY_NAME)

    cy.wait(1000) // wait - debounce time before values are cached
    cy.getAllSessionStorage()
      .its(baseUrl)
      .should('have.property', 'create-check-store')
      .then((sessionCache) => {
        const cachedCheck: KnowledgeCheck = JSON.parse(sessionCache.toString())

        expect(cachedCheck, "Verify that the cached knowldgeCheck object has a 'name' property").to.have.property('name')
        expect(cachedCheck.name, 'Verify cached knowldgeCheck name to match the entered name').to.equal(DUMMY_NAME)
        expect(safeParseKnowledgeCheck(cachedCheck).success, 'Verify cached knowledeCheck to satisfy knowledgeCheck schema').to.be.equal(true)
      })

    cy.reload()
    cy.get("input[name='check-name']").should('have.value', DUMMY_NAME)
  })
})
