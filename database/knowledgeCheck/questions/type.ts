export interface DbQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'drag-drop' | 'open-question'
  points: number
  question: string
  category_id: string
  knowledgecheck_id: string
  createdAt: string
  updatedAt: string
}

export interface DBAnswer {
  id: string
  answer: string
  correct: 0 | 1 | null
  position: number | null
  Question_id: string
  createdAt: string
  updatedAt: string
}

export interface DBCategory {
  id: string
  name: string
  prerequisite_category_id: string | null
  createdAt: string
  updatedAt: string
}
