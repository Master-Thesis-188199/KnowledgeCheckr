import CreateQuestionDialog from '@/src/components/check/create/(create-question)/CreateQuestionDialog'
import { CreateCheckStoreProvider } from '@/src/components/check/create/CreateCheckProvider'
import RootProviders from '@/src/components/root/RootProviders'

describe('<CreateQuestionDialog />', () => {
  it('Verify that create-question-dialog opens and closes correctly', () => {
    cy.viewport(800, 980)
    cy.mount(
      <RootProviders>
        <CreateCheckStoreProvider>
          <CreateQuestionDialog>
            <div className='trigger'>Trigger</div>
          </CreateQuestionDialog>
        </CreateCheckStoreProvider>
      </RootProviders>,
    )

    cy.get('#question-dialog').should('not.exist')
    cy.get('.trigger').click()
    cy.get('#question-dialog').should('be.visible')

    cy.get('#question-dialog button[aria-label="close"]').click()
    cy.get('#question-dialog').should('not.exist')
  })

  it('Verify that create-question-dialog resets all inuts when the user presses Escape', () => {
    cy.viewport(800, 980)
    cy.mount(
      <RootProviders>
        <CreateCheckStoreProvider>
          <CreateQuestionDialog>
            <div className='trigger'>Trigger</div>
          </CreateQuestionDialog>
        </CreateCheckStoreProvider>
      </RootProviders>,
    )

    cy.get('#question-dialog').should('not.exist')
    cy.get('.trigger').click()
    cy.get('#question-dialog').should('be.visible')

    cy.get('#question-dialog input[name="question"]').type('Example Question')

    cy.get('#question-dialog ').realPress('Escape')
    cy.get('#question-dialog').should('not.exist')

    cy.get('.trigger').click()
    cy.get('#question-dialog').should('be.visible')
    cy.get('#question-dialog input[name="question"]').should('have.value', '')
  })

  it("Verify that create-question-dialog closes when the user clicks outside the dialog's content area", () => {
    cy.viewport(800, 980)
    cy.mount(
      <RootProviders>
        <CreateCheckStoreProvider>
          <CreateQuestionDialog>
            <div className='trigger'>Trigger</div>
          </CreateQuestionDialog>
        </CreateCheckStoreProvider>
      </RootProviders>,
    )

    cy.get('#question-dialog').should('not.exist')
    cy.get('.trigger').click()
    cy.get('#question-dialog').should('be.visible')

    cy.get('#question-dialog input[name="question"]').type('Example Question')

    cy.get('[data-slot="dialog-overlay"]').click({ force: true })
    cy.get('#question-dialog').should('not.exist')
  })

  it('Verify that users can switch between question types in the create-question-dialog', () => {
    cy.viewport(800, 980)
    cy.mount(
      <RootProviders>
        <CreateCheckStoreProvider>
          <CreateQuestionDialog>
            <div className='trigger'>Trigger</div>
          </CreateQuestionDialog>
        </CreateCheckStoreProvider>
      </RootProviders>,
    )

    cy.get('#question-dialog').should('not.exist')
    cy.get('.trigger').click()
    cy.get('#question-dialog').should('be.visible')

    cy.get('#question-dialog input[name="question"]').type('Example Question')

    cy.get('#question-dialog [aria-label="popover-trigger-type"]').click()

    cy.get("[aria-label='popover-content-type'] * div[data-slot='command-item']")
      .its('length')
      .then((options: number) => {
        //? Pre-select the last option to ensure that all options are selectable
        cy.get('#question-dialog [aria-label="popover-trigger-type"]').click()
        cy.get("[aria-label='popover-content-type']").should('be.visible').get("[aria-label='popover-content-type'] * div[data-slot='command-item']").last().click()

        for (let i = 0; i < options; i++) {
          cy.get('#question-dialog [aria-label="popover-trigger-type"]').click()
          cy.get("[aria-label='popover-content-type']").should('be.visible').get("[aria-label='popover-content-type'] * div[data-slot='command-item']").eq(i).click()
          cy.wait(200)
        }
      })
  })
})
