import { generateToken } from '@/src/lib/Shared/generateToken'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

describe('Verify sharing of KnowledgeChecks', () => {
  it('Verify that notFound is displayed for invalid share-token', () => {
    cy.loginTestUser()
    cy.visit('/checks/some-share-token')

    cy.get('main').should('contain', 'This page could not be found')
  })

  it('Verify that using share-token starts / renders examination attempt properly', () => {
    cy.loginTestUser()
    const dummyShareToken: string = generateToken(8)

    //? Insert dummy knowledge check with share-token
    const dummyCheck: KnowledgeCheck = Object.assign(instantiateKnowledgeCheck(), { share_key: dummyShareToken } as Partial<KnowledgeCheck>)
    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', body: dummyCheck })

    cy.visit(`/checks/${dummyShareToken}`)
    cy.get('main > h1').should('contain', dummyCheck.name)
    cy.get('nav[id="exam-question-navigation"]').should('exist').children().should('have.length', dummyCheck.questions.length)
  })

  it('Verify that a share-token can be generated and used by the owner', () => {
    cy.loginTestUser()

    //? Insert dummy knowledge check with share-token
    const dummyCheck: KnowledgeCheck = Object.assign(instantiateKnowledgeCheck(), {
      share_key: null,
      questions: [instantiateDragDropQuestion(), instantiateSingleChoice(), instantiateMultipleChoice(), instantiateOpenQuestion()],
    } as Partial<KnowledgeCheck>)

    cy.request({ url: '/api/insert/knowledgeCheck', method: 'POST', body: dummyCheck })
    cy.visit('/checks', {
      onBeforeLoad: (win) => {
        cy.spy(win.navigator.clipboard, 'writeText').as('share-token-copied-to-clipboard')
      },
    })

    cy.get("a[href='/checks/edit/" + dummyCheck.id + "']").should('exist')
    cy.get("a[href='/checks/edit/" + dummyCheck.id + "'] button[aria-label='share KnowledgeCheck']")
      .should('exist')
      .click()

    cy.get('@share-token-copied-to-clipboard').should('have.been.calledOnce')
    cy.get('@share-token-copied-to-clipboard')
      .its('firstCall')
      .then((call) => {
        const shareLink = call.args[0] as string
        expect(shareLink).to.match(new RegExp(`${Cypress.config().baseUrl}/checks/[A-Z0-9]{8}/practice`))

        const token = shareLink.split('/').pop() as string
        expect(token).to.have.length(8)

        cy.visit(`/checks/${token}`)
      })

    cy.get('main > h1').should('contain', dummyCheck.name)
  })
})
