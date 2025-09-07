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
})
