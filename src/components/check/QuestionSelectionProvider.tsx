'use client'

import { createContext, useContext, useState } from 'react'

interface SelectionContext {
  selection: string[]
  resetSelection: () => void
  addSelection: (identifier: string) => void
  isSelected: (identifier: string) => boolean
  toggleSelection: (identifier: string) => void
  maxSelection?: number
}

const QuestionSelectionContext = createContext<SelectionContext>({} as SelectionContext)

export function useQuestionSelectionContext() {
  const context = useContext(QuestionSelectionContext)
  if (!context) {
    throw new Error('useQuestionSelectionContext must be used within a QuestionSelectionProvider')
  }
  return context
}

export default function QuestionSelectionProvider({ children, maxSelection }: { maxSelection?: number; children: React.ReactNode }) {
  const [selection, setSelection] = useState<string[]>([])
  const handlers = SelectionHandler(selection, setSelection, maxSelection)

  return <QuestionSelectionContext.Provider value={{ selection, ...handlers, maxSelection }}>{children}</QuestionSelectionContext.Provider>
}

function SelectionHandler(selection: string[], setSelection: (prev: string[]) => void, maxSelection?: number) {
  const removeSelection = (identifier: string) => setSelection(selection.filter((sel) => sel !== identifier))

  const addSelection = (identifier: string) => {
    if (maxSelection === undefined) {
      setSelection([...selection.filter((sel) => sel !== identifier), identifier])
      return
    }
    if (selection.length >= maxSelection) return

    setSelection([...selection.slice(selection.length - maxSelection - 1, selection.length), identifier])
  }
  const resetSelection = () => setSelection([])
  const toggleSelection = (identifier: string) => (isSelected(identifier) ? removeSelection(identifier) : addSelection(identifier))
  const isSelected = (identifier: string) => selection.includes(identifier)

  return { addSelection, resetSelection, toggleSelection, isSelected }
}
