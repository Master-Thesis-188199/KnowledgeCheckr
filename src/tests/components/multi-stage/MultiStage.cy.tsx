import { MultiStageProgressBar } from '@/src/components/Shared/MultiStageProgress/MultiStageProgressBar'
import { MultiStageStoreProvider } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { MutliStageRenderer } from '@/src/components/Shared/MultiStageProgress/MutliStageRenderer'

describe('Multi-Stage Test Suite: ', () => {
  it('Verify switching between stages works when clicking on stage-indicators', () => {
    cy.viewport(1200, 150)

    cy.mount(
      <div className='p-12'>
        <MultiStageStoreProvider
          initialStoreProps={{
            stage: 1,
            stages: [
              { stage: 1, title: 'First' },
              { stage: 2, title: 'Second' },
              { stage: 3, title: 'Third' },
              { stage: 4, title: 'Fourth' },
              { stage: 5, title: 'Fifth' },
            ],
          }}>
          <MultiStageProgressBar />

          <MutliStageRenderer stage={1}>
            <div id='stage-1' children='Stage 1' />
          </MutliStageRenderer>

          <MutliStageRenderer stage={5}>
            <div id='stage-5' children='Stage 5' />
          </MutliStageRenderer>
        </MultiStageStoreProvider>
      </div>,
    )

    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1)
    cy.get('#multi-stage-list-parent').children().filter(':visible').children().filter('li').should('have.length', 5)

    cy.get('#multi-stage-list-parent').children().filter(':visible').children().filter('li').first().should('have.attr', 'data-active', 'true')
    cy.get('#stage-1').should('be.visible')

    cy.get('#multi-stage-list-parent').children().filter(':visible').children().filter('li').last().click().should('have.attr', 'data-active', 'true')
    cy.get('#stage-5').should('be.visible')
  })
})
