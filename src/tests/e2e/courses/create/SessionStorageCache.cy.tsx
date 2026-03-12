import { addHours } from 'date-fns'
import { Course, safeParseCourse } from '@/src/schemas/CourseSchema'

describe('SessionStorageCache', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage()
    cy.loginTestUser()
    cy.visit('/courses/create')
  })

  it('Verify that create-store-state is stored in sessionStorage', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    const DUMMY_NAME = 'Test Course'

    cy.getAllSessionStorage().its(baseUrl).should('not.have.a.property', 'courses-store', 'Verify that courses-store is not cached at the beginning')

    cy.get("input[name='name']").type(DUMMY_NAME)

    cy.wait(1000) // wait - debounce time before values are cached
    cy.getAllSessionStorage()
      .its(baseUrl)
      .should('have.property', 'courses-store')
      .then((sessionCache) => {
        const cachedCourse: Course = JSON.parse(sessionCache.toString())

        expect(cachedCourse, "Verify that the cached course object has a 'name' property").to.have.property('name')
        expect(cachedCourse.name, 'Verify cached course name to match the entered name').to.equal(DUMMY_NAME)
        expect(safeParseCourse(cachedCourse).success, 'Verify cached course to satisfy course schema').to.be.equal(true)
      })

    cy.reload()
    cy.get("input[name='name']").should('have.value', DUMMY_NAME)
  })

  it('Verify that create-store-sate session storage cache is invalidated after cacheDuration', () => {
    const baseUrl = Cypress.env('NEXT_PUBLIC_BASE_URL')
    const DUMMY_NAME = 'Test Course'
    const CACHE_EXPIRATION_HOURS = 5

    cy.getAllSessionStorage().its(baseUrl).should('not.have.a.property', 'courses-store', 'Verify that courses-store is not cached at the beginning')
    cy.get("input[name='name']").type(DUMMY_NAME)

    cy.wait(1000) // wait - debounce time before values are cached
    cy.getAllSessionStorage()
      .its(baseUrl)
      .should('have.property', 'courses-store')
      .then((sessionCache) => {
        const cachedCourse: Course = JSON.parse(sessionCache.toString())

        expect(cachedCourse, "Verify that the cached course object has a 'name' property").to.have.property('name')
        expect(cachedCourse.name, 'Verify cached course name to match the entered name').to.equal(DUMMY_NAME)
        expect(safeParseCourse(cachedCourse).success, 'Verify cached course to satisfy course schema').to.be.equal(true)
      })

    cy.clock(addHours(Date.now(), CACHE_EXPIRATION_HOURS), ['Date'])
    cy.visit('/courses/create')

    // wait for deletion of session-item
    cy.wait(750)

    cy.getAllSessionStorage().then((storage) => {
      const sessionCache = storage[baseUrl] ?? {}
      expect(sessionCache, "Expect session-storage to not include 'courses-store' entry").not.haveOwnProperty('courses-store')
    })
  })
})
