import { getUUID } from '@/src/lib/Shared/getUUID'
import { Course, instantiateCourse } from '@/src/schemas/CourseSchema'

describe('Verify the functionality and integrity of the insert/course api route ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  it('Verify insertion of an valid course instance', () => {
    const dummyCourse: Course = instantiateCourse()
    const course = Object.assign(dummyCourse, { id: getUUID() } as Partial<Course>)

    cy.request('POST', '/api/insert/course', course)
  })

  it('Verify error handling when inserting an invalid course instance', () => {
    const dummyCourse: Course = instantiateCourse()
    const invalidCourse: Partial<Course> = Object.assign(dummyCourse, { id: getUUID() } as Partial<Course>)

    invalidCourse.name = undefined
    invalidCourse.questionCategories = []

    cy.request({ url: '/api/insert/course', method: 'POST', body: invalidCourse, failOnStatusCode: false }).should('have.property', 'status').and('eq', 400)
  })

  it('Verify error handling when inserting with an empty request-body', () => {
    cy.request({ url: '/api/insert/course', method: 'POST', failOnStatusCode: false }).should('have.property', 'status').and('eq', 400)
  })
})
