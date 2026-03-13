import { generateToken } from '@/src/lib/Shared/generateToken'
import { Course, instantiateCourse } from '@/src/schemas/CourseSchema'
import { instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

describe('Verify sharing of Courses', () => {
  it('Verify that notFound is displayed for invalid share-token', () => {
    cy.loginTestUser()
    cy.visit('/courses/some-share-token')

    cy.get('main').should('contain', 'This page could not be found')
  })

  it('Verify that using share-token starts / renders examination attempt properly', () => {
    cy.loginTestUser()
    const dummyShareToken: string = generateToken(8)

    //? Insert dummy knowledge course with share-token
    const dummmyCourse: Course = Object.assign(instantiateCourse(), { share_key: dummyShareToken } as Partial<Course>)
    cy.request({ url: '/api/insert/course', method: 'POST', body: dummmyCourse })

    cy.visit(`/courses/${dummyShareToken}`)
    cy.get('main #page-heading').should('contain', dummmyCourse.name)
    cy.get('nav[id="question-navigation"]').should('exist').children().should('have.length', dummmyCourse.questions.length)
  })

  it('Verify that a share-token can be generated and used by the owner', () => {
    cy.loginTestUser()

    //? Insert dummy knowledge course with share-token
    const dummyCourse: Course = Object.assign(instantiateCourse(), {
      share_key: null,
      questions: [instantiateDragDropQuestion(), instantiateSingleChoice(), instantiateMultipleChoice(), instantiateOpenQuestion()],
    } as Partial<Course>)

    cy.request({ url: '/api/insert/course', method: 'POST', body: dummyCourse })
    cy.visit('/courses', {
      onBeforeLoad: (win) => {
        cy.spy(win.navigator.clipboard, 'writeText').as('share-token-copied-to-clipboard')
      },
    })

    cy.get(`[data-slot="generic-card"][data-course-id="${dummyCourse.id}"]`).should('exist').and('be.visible').find('button[data-share-button]').should('exist').click()

    cy.get('@share-token-copied-to-clipboard').should('have.been.calledOnce')
    cy.get('@share-token-copied-to-clipboard')
      .its('firstCall')
      .then((call) => {
        const shareLink = call.args[0] as string
        expect(shareLink).to.match(new RegExp(`${Cypress.config().baseUrl}/courses/[A-Z0-9]{8}/practice`))

        const token = shareLink.split('/').at(-2) as string
        expect(token).to.have.length(8)

        cy.visit(`/courses/${token}`)
      })

    cy.get('main  #page-heading').should('contain', dummyCourse.name)
  })
})
