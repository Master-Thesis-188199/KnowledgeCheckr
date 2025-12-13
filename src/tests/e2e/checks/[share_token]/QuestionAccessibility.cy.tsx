import { generateToken } from '@/src/lib/Shared/generateToken'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

describe('Accessibility of questions: ', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })

  it('Verifies the accessibiltiy of "practice-only" and "all" questions', () => {
    const dummyCheck: KnowledgeCheck = {
      ...instantiateKnowledgeCheck(),
      share_key: 'question-accessibility' + generateToken(8),
      questions: [
        { ...instantiateSingleChoice(), question: 'First practice only question', accessibility: 'practice-only' },
        { ...instantiateSingleChoice(), question: 'Second practice only question', accessibility: 'practice-only' },
        { ...instantiateSingleChoice(), question: 'First globally accessible question', accessibility: 'all' },
        { ...instantiateSingleChoice(), question: 'Second globally accessible question', accessibility: 'all' },
      ],
    }

    cy.insertKnowledgeCheck(dummyCheck)

    cy.visit(`/checks/${dummyCheck.share_key}/practice`)

    cy.get('#practice-question-steps')
      .should('exist')
      .and('be.visible')
      .children()
      .should('have.length', dummyCheck.questions.filter((q) => q.accessibility === 'practice-only' || q.accessibility === 'all').length)
  })
})
