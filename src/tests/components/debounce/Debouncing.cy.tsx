import debounceFunction from '@/src/hooks/Shared/debounceFunction'

const DebounceTime = 300

describe('Debouncing Suite: ', () => {
  it('Verify that debouncing a function delays its excecution and prevents rapid calls', () => {
    const saveFunction = cy.stub().as('saveFunction')
    const debouncedSave = debounceFunction(saveFunction, DebounceTime)

    // Simulate rapid calls to the debounced function
    for (let i = 0; i < 5; i++) {
      debouncedSave(`Call ${i + 1}`)
    }
    cy.get('@saveFunction').should('not.have.been.called')
    cy.wait(DebounceTime + 100)
    cy.get('@saveFunction').should('have.been.calledOnceWith', 'Call 5')
  })

  it("Verify that a debounced function call can be cancelled before it's executed", () => {
    const saveFunction = cy.stub().as('saveFunction')
    const debouncedSave = debounceFunction(saveFunction, DebounceTime)

    debouncedSave('Initial Call')
    debouncedSave.abort()

    cy.wait(DebounceTime + 100)
    cy.get('@saveFunction').should('not.have.been.called')
  })
})
