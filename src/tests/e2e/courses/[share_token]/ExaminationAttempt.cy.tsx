import { addSeconds } from 'date-fns'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { instantiateCourse } from '@/src/schemas/CourseSchema'

describe('ExaminationAttempt Suite: ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })

  it('Verify that attempt is automatically closed when time-frame is reached', () => {
    const course = instantiateCourse()
    course.settings.examination.examTimeFrameSeconds = 60
    course.share_key = generateToken(8) + '-time-frame'

    cy.request('POST', '/api/insert/course', course).should('have.property', 'status').and('eq', 200)

    cy.visit(`/courses/${course.share_key}`)
    cy.get('h1').contains(course.name).should('exist').and('be.visible')

    cy.intercept('POST', `/courses/${course.share_key}`).as('finishAttemptAction')

    cy.wait(2000)
    cy.clock(addSeconds(new Date(Date.now()), course.settings.examination.examTimeFrameSeconds * 2), ['Date'])

    cy.wait('@finishAttemptAction', { timeout: course.settings.examination.examTimeFrameSeconds * 1000 })
      .its('response.statusCode')
      .should('eq', 200)
    cy.url().should('eq', `${Cypress.env('NEXT_PUBLIC_BASE_URL')}/courses`)
  })
})
