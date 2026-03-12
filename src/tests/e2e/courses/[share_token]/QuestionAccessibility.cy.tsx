import { generateToken } from '@/src/lib/Shared/generateToken'
import { Course, instantiateCourse } from '@/src/schemas/CourseSchema'
import { instantiateSingleChoice, Question } from '@/src/schemas/QuestionSchema'
import { ParameterizedTest } from '@/src/tests/parameterizedTest'

describe('Accessibility of questions: ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })

  ParameterizedTest(
    [
      { page: 'practice', accessbilities: ['practice-only', 'all'] },
      { page: 'examination', accessbilities: ['exam-only', 'all'] },
    ] as const,
    ({ page, accessbilities }) =>
      it(`Verifies the accessibility of ${accessbilities.map((a) => `"${a}"`).join(' and ')} questions in ${page}`, () => {
        const questions: Array<Question> = []

        for (const accessibility of accessbilities) {
          questions.push(
            { ...instantiateSingleChoice(), question: `First ${accessibility} question`, accessibility: accessibility },
            { ...instantiateSingleChoice(), question: `Second ${accessibility} question`, accessibility: accessibility },
          )
        }

        const dummyCheck: Course = {
          ...instantiateCourse(),
          share_key: 'question-accessibility' + generateToken(8),
          questions,
        }

        cy.insertKnowledgeCheck(dummyCheck)

        const examUrl = `/courses/${dummyCheck.share_key}/`
        const practiceUrl = `/courses/${dummyCheck.share_key}/practice`

        const url = page === 'practice' ? practiceUrl : examUrl
        cy.visit(url)

        const navigationMenuId = '#question-navigation'
        cy.get(navigationMenuId)
          .should('exist')
          .and('be.visible')
          .children()
          .should('have.length', dummyCheck.questions.filter((q) => accessbilities.flat().includes(q.accessibility)).length)
      }),
  )
})
