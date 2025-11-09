import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'

describe('Drag Drop Components:', () => {
  it('Verify that items can be dragged and dropped, thus switched with each other', () => {
    cy.viewport(780, 980)

    const items = [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
    ]
    cy.mount(
      <DragDropContainer className='drag-drop-container'>
        {items.map((item, i) => (
          <DragDropItem name={item.content} key={i} initialIndex={i} showPositionCounter>
            <span className='flex-1'>{item.content}</span>
          </DragDropItem>
        ))}
      </DragDropContainer>,
    )

    cy.get('.drag-drop-container').should('exist')
    cy.get('.drag-drop-container  [data-swapy-item]').should('have.length', items.length)

    //? Ensure initial order of items
    cy.get('.drag-drop-container  [data-swapy-item]').first().should('contain.text', items.at(0)!.content)
    cy.get('.drag-drop-container  [data-swapy-item]').last().should('contain.text', items.at(-1)!.content)

    cy.dragDrop(cy.get('[data-swapy-item]').first(), cy.get('div[data-swapy-item]').last())

    ///? Verify order of switches items
    cy.get('.drag-drop-container  [data-swapy-item]').first().should('contain.text', items.at(-1)!.content)
    cy.get('.drag-drop-container  [data-swapy-item]').last().should('contain.text', items.at(0)!.content)
  })

  it('Verify that the swap event is triggered when items are swapped', () => {
    cy.viewport(780, 980)

    const eventHandler = cy.stub().as('eventHandler')

    const items = [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
    ]
    cy.mount(
      <DragDropContainer className='drag-drop-container' onSwapEnd={eventHandler}>
        {items.map((item, i) => (
          <DragDropItem name={item.content} key={i} initialIndex={i} showPositionCounter>
            <span className='flex-1'>{item.content}</span>
          </DragDropItem>
        ))}
      </DragDropContainer>,
    )

    cy.get('@eventHandler').should('not.have.been.called')

    cy.dragDrop(cy.get('[data-swapy-item]').first(), cy.get('div[data-swapy-item]').last())

    ///? Verify order of switches items
    cy.get('.drag-drop-container  [data-swapy-item]').first().should('contain.text', items.at(-1)!.content)
    cy.get('.drag-drop-container  [data-swapy-item]').last().should('contain.text', items.at(0)!.content)
    cy.get('@eventHandler').should('have.been.calledOnce')
  })

  it('Verify that onSwap event is called on DragDropItem', () => {
    cy.viewport(780, 980)

    const swapEventHandler = cy.stub().as('eventHandler').log(true)

    const items = [
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
    ]
    cy.mount(
      <DragDropContainer className='drag-drop-container'>
        {items.map((item, i) => (
          <DragDropItem name={item.content} key={i} initialIndex={i} showPositionCounter onSwap={swapEventHandler}>
            <span className='flex-1'>{item.content}</span>
          </DragDropItem>
        ))}
      </DragDropContainer>,
    )

    cy.get('@eventHandler').should('not.have.been.called')

    cy.dragDrop(cy.get('[data-swapy-item]').first(), cy.get('div[data-swapy-item]').last())

    ///? Verify order of switches items
    cy.get('.drag-drop-container  [data-swapy-item]').first().should('contain.text', items.at(-1)!.content)
    cy.get('.drag-drop-container  [data-swapy-item]').last().should('contain.text', items.at(0)!.content)

    cy.get('@eventHandler').should('have.been.calledTwice')
    cy.get('@eventHandler').should('have.been.calledWithMatch', { detail: { name: 'Item 1', new_pos: 2, prev_pos: 0 } })
    cy.get('@eventHandler').should('have.been.calledWithMatch', { detail: { name: 'Item 3', new_pos: 0, prev_pos: 2 } })
  })
})
