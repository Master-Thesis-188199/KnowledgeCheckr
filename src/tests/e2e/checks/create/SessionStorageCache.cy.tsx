import { addHours } from 'date-fns'
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

    cy.getAllSessionStorage().its(baseUrl).should('not.have.a.property', 'check-store', 'Verify that check-store is not cached at the beginning')

    cy.get("input[name='check-name']").type(DUMMY_NAME)

    cy.wait(1000) // wait - debounce time before values are cached
    cy.getAllSessionStorage()
      .its(baseUrl)
      .should('have.property', 'check-store')
      .then((sessionCache) => {
        const cachedCheck: KnowledgeCheck = JSON.parse(sessionCache.toString())

        expect(cachedCheck, "Verify that the cached knowldgeCheck object has a 'name' property").to.have.property('name')
        expect(cachedCheck.name, 'Verify cached knowldgeCheck name to match the entered name').to.equal(DUMMY_NAME)
        expect(safeParseKnowledgeCheck(cachedCheck).success, 'Verify cached knowledeCheck to satisfy knowledgeCheck schema').to.be.equal(true)
      })

    cy.reload()
    cy.get("input[name='check-name']").should('have.value', DUMMY_NAME)
  })

  it('Verify that create-store-sate session storage cache is invalidated after cacheDuration', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    const DUMMY_NAME = 'Test Check'
    const CACHE_EXPIRATION_HOURS = 5

    cy.getAllSessionStorage().its(baseUrl).should('not.have.a.property', 'check-store', 'Verify that check-store is not cached at the beginning')
    cy.get("input[name='check-name']").type(DUMMY_NAME)

    cy.wait(1000) // wait - debounce time before values are cached
    cy.getAllSessionStorage()
      .its(baseUrl)
      .should('have.property', 'check-store')
      .then((sessionCache) => {
        const cachedCheck: KnowledgeCheck = JSON.parse(sessionCache.toString())

        expect(cachedCheck, "Verify that the cached knowldgeCheck object has a 'name' property").to.have.property('name')
        expect(cachedCheck.name, 'Verify cached knowldgeCheck name to match the entered name').to.equal(DUMMY_NAME)
        expect(safeParseKnowledgeCheck(cachedCheck).success, 'Verify cached knowledeCheck to satisfy knowledgeCheck schema').to.be.equal(true)
      })

    cy.clock(addHours(Date.now(), CACHE_EXPIRATION_HOURS))

    //* Overrides the implementation of `performance.timeOrigin` (caused by `cy.clock`) from () => undefined to Date.now(); see https://github.com/Master-Thesis-188199/KnowledgeCheckr/issues/186 for more details.
    cy.visit('/checks/create', {
      onBeforeLoad(win) {
        // This runs before Sentry runs, thus ensuring that `createUnixTimestampInSecondsFunc` uses an actual implementation of `performance.timeOrigin` when `cy.clock` is used.
        if (win.performance) {
          const perf = win.performance
          const value = typeof perf.timeOrigin === 'number' ? perf.timeOrigin : Date.now() // or 0, doesn't matter much for tests

          try {
            Object.defineProperty(perf, 'timeOrigin', {
              configurable: true,
              writable: true,
              value,
            })
          } catch {
            console.error('Failed to override `performance.timeOrigin` to Date.now()')
          }
        }
      },
    })

    cy.getAllSessionStorage().its(baseUrl).should('not.have.property', 'check-store')
  })
})
