import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { Button } from '@/src/components/shadcn/button'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

 const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default function DummyDataPage() {
  return (
    <>
      <PageHeading title='Create Dummy Data' />
      <Card as='form' className='flex max-w-lg flex-col gap-6'>
        <h1 className='text-lg font-semibold'>Create Practice Check</h1>
        <Button className='mx-auto min-w-3xs' formAction={createPracticeCheck}>
          Create Check
        </Button>
      </Card>
    </>
  )
}

async function createPracticeCheck() {
  'use server'
  const { user } = await requireAuthentication()

  const check = instantiateKnowledgeCheck()

  check.name = `Practice Knowledge ${Math.floor(Math.random() * 1000)}`
  check.description = 'Increase your knowledge by learning about Design, Tech, Daily and General things'
  check.difficulty = 6

  check.questionCategories = [
    { id: getUUID(), name: 'Design', skipOnMissingPrequisite: false },
    { id: getUUID(), name: 'Tech', skipOnMissingPrequisite: false },
    { id: getUUID(), name: 'Daily', skipOnMissingPrequisite: false },
    { id: getUUID(), name: 'general', skipOnMissingPrequisite: false },
  ]

  check.questions = [
    {
      ...instantiateSingleChoice(),
      question: 'What does RGB stand for?',
      category: 'Design',
      points: 7,
      answers: [
        { id: getUUID(), answer: 'Red, Green, Brown', correct: false },
        { id: getUUID(), answer: 'Orange, Green, Blue', correct: false },
        { id: getUUID(), answer: 'Red, Green, Blue', correct: true },
        { id: getUUID(), answer: 'Red, Yellow , Brown', correct: false },
      ],
    },
    {
      ...instantiateSingleChoice(),
      question: 'What does USB stand for?',
      category: 'Tech',
      points: 9,
      answers: [
        { id: getUUID(), answer: 'Universal Storage Bus', correct: false },
        { id: getUUID(), answer: 'Universal Self Storage', correct: false },
        { id: getUUID(), answer: 'Universal Serial Bus', correct: true },
        { id: getUUID(), answer: 'Universal Sustainable Storage', correct: false },
      ],
    },
    {
      ...instantiateMultipleChoice(),
      question: 'Which of these colors exist?',
      category: 'Design',
      points: 4,
      answers: [
        { id: getUUID(), answer: 'Orange', correct: true },
        { id: getUUID(), answer: 'Yellow', correct: true },
        { id: getUUID(), answer: 'Tree', correct: false },
        { id: getUUID(), answer: 'Yellish', correct: false },
        { id: getUUID(), answer: 'Brown', correct: true },
      ],
    },
    {
      ...instantiateMultipleChoice(),
      question: 'Which of these statements are true?',
      category: 'general',
      points: 4,
      answers: [
        { id: getUUID(), answer: 'The sun is very hot', correct: true },
        { id: getUUID(), answer: 'Earth is a planet', correct: true },
        { id: getUUID(), answer: 'Earth is flat', correct: false },
        { id: getUUID(), answer: 'The moon is a square', correct: false },
        { id: getUUID(), answer: 'Earth is round', correct: true },
      ],
    },
    {
      ...instantiateDragDropQuestion(),
      question: 'Order these activities by the occurence',
      category: 'Daily',
      points: 4,
      answers: [
        { id: getUUID(), answer: 'Midnight', position: 0 },
        { id: getUUID(), answer: 'Morning', position: 1 },
        { id: getUUID(), answer: 'Noon', position: 2 },
        { id: getUUID(), answer: 'Afternoon', position: 3 },
        { id: getUUID(), answer: 'Bedtime', position: 4 },
      ],
    },
    {
      ...instantiateDragDropQuestion(),
      question: 'Order these statements by the importance',
      category: 'Daily',
      points: 4,
      answers: [
        { id: getUUID(), answer: 'Sleep', position: 0 },
        { id: getUUID(), answer: 'Food & Drinks', position: 1 },
        { id: getUUID(), answer: 'People', position: 2 },
        { id: getUUID(), answer: 'Chocolate', position: 3 },
      ],
    },
    {
      ...instantiateOpenQuestion(),
      question: 'Describe the acronym RGB and its use-cases',
      category: 'Design',
      points: 4,
      expectation: 'Used to define colors through by setting the intensity of the three main colors (Red, Green, Blue).',
    },
    {
      ...instantiateOpenQuestion(),
      question: 'Describe the term web-dev',
      category: 'Tech',
      points: 4,
      expectation: 'This term is an acronym for web-development, which stands for e.g. developing websites.',
    },
  ]

  logger.info('Inserting new check...')
  await insertKnowledgeCheck(user.id, check) //.then(() => redirect('/checks'))
}
