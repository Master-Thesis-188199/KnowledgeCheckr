import { Question } from '@/schemas/QuestionSchema'
import DisplayQuestion from '@/components/check/DisplayQuestion'

export default async function CheckPage() {
  const OpenQuestion: Extract<Question, { type: 'open-question' }> = {
    id: Math.random().toString(36),
    points: 10,
    type: 'open-question',
    question: 'Describe in simple terms what a knowledge check is.',
    category: 'general',
    expectation: "A knowledge check is a test or quiz that assesses a learner's understanding of a topic.",
  }

  const SingleChoice: Question = {
    id: Math.random().toString(36),
    points: 10,
    type: 'single-choice',
    question: 'adajsd ad',
    answers: [
      { answer: 'Answer 1', correct: false },
      { answer: 'Answer 2', correct: true },
      { answer: 'Answer 3', correct: false },
      { answer: 'Answer 4', correct: false },
    ],
    category: 'general',
  }
  return (
    <div className='grid grid-cols-1 gap-8 @[1000px]:grid-cols-2 @[1400px]:grid-cols-3 @[1400px]:gap-14'>
      <DisplayQuestion {...OpenQuestion} />
      <DisplayQuestion
        {...SingleChoice}
        question='Which of the following is not a position in football / soccer?'
        answers={[
          {
            answer: 'Goal Defence',
            correct: false,
          },
          {
            answer: 'Left Midfielder',
            correct: false,
          },
          {
            answer: 'Right Fullback',
            correct: false,
          },
          {
            answer: 'Centre Back',
            correct: false,
          },
        ]}
      />
      <DisplayQuestion {...SingleChoice} type='multiple-choice' question='Please select choose which answers are correct' />
      <DisplayQuestion
        {...SingleChoice}
        type='multiple-choice'
        question='Which of the following is a position in football / soccer?'
        answers={[
          {
            answer: 'Goal Defence',
            correct: false,
          },
          {
            answer: 'Left Midfielder',
            correct: false,
          },
          {
            answer: 'Right Fullback',
            correct: false,
          },
          {
            answer: 'Centre Back',
            correct: false,
          },
        ]}
      />
    </div>
  )
}
