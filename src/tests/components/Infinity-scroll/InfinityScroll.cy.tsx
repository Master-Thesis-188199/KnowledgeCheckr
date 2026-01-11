import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import { Any } from '@/types'

describe('InfinityScroll Suite: ', () => {
  it('Verify that contents are dynamically fetched when the user reaches the end of the page', () => {
    const initialItems = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`)

    cy.mount(
      <InfiniteScrollProvider initialItems={initialItems}>
        <div className='flex flex-col gap-4'>
          <InfinityScrollRenderer<Any> component={ExemplaryComponent} />
        </div>

        <InfinityScrollFetcher
          loadingLabel='Loading...'
          getItems={(offset) =>
            new Promise((resolve) =>
              setTimeout(() => {
                resolve(Array.from({ length: 10 }, (_, i) => `Item ${i + offset + 1}`))
              }, 100),
            )
          }
        />
      </InfiniteScrollProvider>,
    )

    cy.get('.item').should('have.length', 10)
    cy.scrollTo('bottom').get('#infinity-fetcher-loading-indicator').should('be.visible')
    cy.get('.item').should('have.length', 20)
    cy.get('#infinity-fetcher-loading-indicator').should('not.exist')
  })
})

function ExemplaryComponent() {
  return <div className='item h-12'>Example</div>
}
