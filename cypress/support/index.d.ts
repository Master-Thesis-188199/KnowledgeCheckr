/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Cypress {
  type SingleChoice = import('../../src/schemas/QuestionSchema').SingleChoice
  type MultipleChoice = import('../../src/schemas/QuestionSchema').MultipleChoice
  type OpenQuestion = import('../../src/schemas/QuestionSchema').OpenQuestion
  type DragDropQuestion = import('../../src/schemas/QuestionSchema').DragDropQuestion
  type Question = import('../../src/schemas/QuestionSchema').Question
  type QuestionOptions<Q> = Q extends SingleChoice
    ? { selection: SingleChoice['answers'][number]['id']; type: Q['type'] }
    : Q extends MultipleChoice
      ? { selection: MultipleChoice['answers'][number]['id'][]; type: Q['type'] }
      : Q extends OpenQuestion
        ? { input: string; type: Q['type'] }
        : Q extends DragDropQuestion
          ? { selection: DragDropQuestion['answers'][number]['id'][]; type: Q['type'] }
          : never

  type CorrectnessFor<Q> = Q extends SingleChoice
    ? 'correct' | 'incorrect'
    : Q extends MultipleChoice
      ? 'correct' | 'incorrect' | 'all'
      : Q extends OpenQuestion
        ? 'correct' | 'incorrect'
        : Q extends DragDropQuestion
          ? 'correct' | 'partly-correct' | 'incorrect'
          : never

  interface Chainable<Subject = any> {
    skip(message?: string, skipCondition?: boolean): void
    login(email: string, password: string): void
    loginTestUser(): void
    loginAnonymously(): void
    signUp(username: string, email: string, password: string): void
    signOut(): void

    removeDBUser(email: string, username: string): void

    dragDrop(dragLocator: Cypress.Chainable<JQuery<HTMLElement>>, dropLocator: Cypress.Chainable<JQuery<HTMLElement>>): void

    //? response type assertion needed because Interception<any, any> translates to any when used within tests.
    waitServerAction<Response>(alias: string, callback: (body?: Response, response: { statusCode?: number }) => void): void
    simulatePracticeSelection<Q extends Question>(question: Q, options: Partial<{ correctness: CorrectnessFor<Q> } & QuestionOptions<Q>> = {}): Chainable<void>
  }
}
