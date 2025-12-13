import { generateToken } from '@/src/lib/Shared/generateToken'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateSingleChoice, Question } from '@/src/schemas/QuestionSchema'

describe('Accessibility of questions: ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })
  ;(
    [
      { page: 'practice', accessbilities: ['practice-only', 'all'] },
      { page: 'examination', accessbilities: ['exam-only', 'all'] },
    ] as { page: 'examination' | 'practice'; accessbilities: Array<Question['accessibility']> }[]
  ).forEach(({ accessbilities, page }) =>
    it(`Verifies the accessibiltiy of ${accessbilities.map((a) => `"${a}"`).join(' and ')} questions in ${page}`, () => {
      const questions: Array<Question> = []

      for (const accessibility of accessbilities) {
        questions.push(
          { ...instantiateSingleChoice(), question: `First ${accessibility} question`, accessibility: accessibility },
          { ...instantiateSingleChoice(), question: `Second ${accessibility} question`, accessibility: accessibility },
        )
      }

      const dummyCheck: KnowledgeCheck = {
        ...instantiateKnowledgeCheck(),
        share_key: 'question-accessibility' + generateToken(8),
        questions,
      }

      cy.insertKnowledgeCheck(dummyCheck)

      const examUrl = `/checks/${dummyCheck.share_key}/`
      const practiceUrl = `/checks/${dummyCheck.share_key}/practice`

      const url = page === 'practice' ? practiceUrl : examUrl
      cy.visit(url)

      const navigationMenuId = page === 'examination' ? '#exam-question-navigation' : '#practice-question-steps'
      cy.get(navigationMenuId)
        .should('exist')
        .and('be.visible')
        .children()
        .should('have.length', dummyCheck.questions.filter((q) => accessbilities.includes(q.accessibility)).length)
    }),
  )
})
