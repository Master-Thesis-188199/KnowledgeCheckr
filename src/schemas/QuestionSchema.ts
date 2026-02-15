import { z, ZodIssueCode } from 'zod'
import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import identifyDuplicateFields from '@/src/schemas/utils/refinements/IdentifyDuplicateFields'

const AnswerId = z
  .string()
  .uuid('An answer must have an uuid to identify it!')
  .catch(() => getUUID())

const baseQuestion = z.object({
  id: z.string().uuid(),
  points: z.number().positive(),
  category: z.string().default('general'),

  question: z
    .string()
    .refine((q) => q.split(' ').length > 2, 'Please reformulate your question to be at least 3 words long.')
    .default(
      lorem()
        .substring(0, Math.floor(Math.random() * 100) + 20)
        .split('\n')
        .join(''),
    ),

  //* specifies how / in which environments the question should be displayed to users.
  accessibility: z.enum(['all', 'practice-only', 'exam-only']).default('all').catch('all'),
})

/**
 * Ensures that the `answers` have unique names and ids, otherwise location / property based issues are created.
 * @param answers The array of answers provided by the `superRefine` operrand.
 * @param ctx The superRefine context to create issues with.
 */
const uniqueAnswerConstraints = (answers: Array<{ answer: string; id: string }>, ctx: z.RefinementCtx) => {
  identifyDuplicateFields(answers, ctx, {
    field: 'answer',
    key: (a) => a.answer,
    normalizeKey: (s) => s.trim().toLowerCase(),
    message: (dup) => `Answers must be unique. Duplicate: "${dup}"`,
    mark: 'both',
  })

  identifyDuplicateFields(answers, ctx, {
    field: 'id',
    key: (a) => a.id,
    message: (dup) => `Answer-ids must be unique. Duplicate id: "${dup}"`,
    mark: 'both',
  })
}

const multipleChoiceAnswerSchema = z.object({
  type: z.literal('multiple-choice'),
  answers: z
    .array(
      z.object({
        id: AnswerId,
        answer: z.string().min(1, 'An answer must not be empty!'),
        correct: z.boolean(),
      }),
    )
    .min(1, 'Please provide at least one answer')
    .refine((answers) => answers.find((answer) => answer.correct), { message: 'At least one answer has to be correct!' })
    .superRefine(uniqueAnswerConstraints)
    .default(() => [
      { id: getUUID(), answer: 'Answer 1', correct: false },
      { id: getUUID(), answer: 'Answer 2', correct: true },
      { id: getUUID(), answer: 'Answer 3', correct: true },
      { id: getUUID(), answer: 'Answer 4', correct: false },
    ]),
})

const singleChoiceAnswerSchema = z.object({
  type: z.literal('single-choice'),
  answers: z
    .array(
      z.object({
        id: AnswerId,
        answer: z.string(),
        correct: z.boolean(),
      }),
    )
    .min(1, 'Please provide at least one answer')
    .superRefine(uniqueAnswerConstraints)
    .refine((answers) => answers.filter((answer) => answer.correct).length === 1, { message: 'A single-choice question must have *one* correct answer!' })
    .default(() => [
      { id: getUUID(), answer: 'Answer 1', correct: false },
      { id: getUUID(), answer: 'Answer 2', correct: true },
      { id: getUUID(), answer: 'Answer 3', correct: false },
      { id: getUUID(), answer: 'Answer 4', correct: false },
    ]),
})

const dragDropAnswerSchema = z.object({
  type: z.literal('drag-drop'),
  answers: z
    .array(
      z.object({
        id: AnswerId,
        answer: z.string(),
        position: z.number().min(0, 'Position must be positive'),
      }),
    )
    .superRefine((answers, ctx) => {
      const n = answers.length
      const seen = new Set<number>()
      const minPos = Math.min(...answers.map((a) => a.position))

      if (minPos !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          minimum: 0,
          type: 'number',
          inclusive: true,
          message: `[drag-drop] positions must begin from 0; received: ${minPos} `,
          path: [answers.findIndex((a) => a.position === minPos), 'position'],
        })
        return
      }

      answers.forEach((answer, i) => {
        if (seen.has(answer.position)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `[drag-drop] duplicate position: ${answer.position}`,
            path: [i, 'position'],
          })
        }
        seen.add(answer.position)
      })

      //* Identify gaps in continuous range of positions
      for (let pos = 0; pos <= n - 1; pos++) {
        if (!seen.has(pos)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `[drag-drop] positions must form a continuous range: [0...${n - 1}]; received: [${answers.map((a) => a.position).join(', ')}]. Position ${pos} is missing!`,
          })

          break
        }
      }
    })
    .superRefine(uniqueAnswerConstraints)
    .default(() => [
      { id: getUUID(), answer: 'Answer 1', position: 0 },
      { id: getUUID(), answer: 'Answer 2', position: 1 },
      { id: getUUID(), answer: 'Answer 3', position: 2 },
      { id: getUUID(), answer: 'Answer 4', position: 3 },
    ]),
})

const openAnswerSchema = z.object({
  type: z.literal('open-question'),
  expectation: z.string().optional(),
})

const questionAnswerTypes = z.discriminatedUnion('type', [singleChoiceAnswerSchema, multipleChoiceAnswerSchema, openAnswerSchema, dragDropAnswerSchema])

export const QuestionSchema = z.intersection(baseQuestion, questionAnswerTypes).default(() => generateRandomQuestion())

export type Question = z.infer<typeof QuestionSchema>

const { validate: validateQuestion, instantiate: instantiateQuestion, safeParse: safeParseQuestion } = schemaUtilities(QuestionSchema)
export { instantiateQuestion, safeParseQuestion, validateQuestion }

export type ChoiceQuestion = Extract<Question, { type: 'single-choice' | 'multiple-choice' }>
export type SingleChoice = Extract<Question, { type: 'single-choice' }>
const { validate: validateSingleChoice, instantiate: instantiateSingleChoice, safeParse: safeParseSingleChoice } = schemaUtilities(z.intersection(baseQuestion, singleChoiceAnswerSchema))
export { instantiateSingleChoice, safeParseSingleChoice, validateSingleChoice }

export type MultipleChoice = Extract<Question, { type: 'multiple-choice' }>
const { validate: validateMultipleChoice, instantiate: instantiateMultipleChoice, safeParse: safeParseMultipleChoice } = schemaUtilities(z.intersection(baseQuestion, multipleChoiceAnswerSchema))
export { instantiateMultipleChoice, safeParseMultipleChoice, validateMultipleChoice }

export type OpenQuestion = Extract<Question, { type: 'open-question' }>
const { validate: validateOpenQuestion, instantiate: instantiateOpenQuestion, safeParse: safeParseOpenQuestion } = schemaUtilities(z.intersection(baseQuestion, openAnswerSchema))
export { instantiateOpenQuestion, safeParseOpenQuestion, validateOpenQuestion }

export type DragDropQuestion = Extract<Question, { type: 'drag-drop' }>
const { validate: validateDragDropQuestion, instantiate: instantiateDragDropQuestion, safeParse: safeParseDragDropQuestion } = schemaUtilities(z.intersection(baseQuestion, dragDropAnswerSchema))
export { instantiateDragDropQuestion, safeParseDragDropQuestion, validateDragDropQuestion }

// #region Dummy Data
function generateRandomQuestion(): z.infer<typeof baseQuestion> & z.infer<typeof questionAnswerTypes> {
  return {
    id: getUUID(),
    category: 'general',
    points: Math.max(Math.round(Math.random() * 15), 1),
    accessibility: 'all',
    ...generateRandomQuestionType(),
  }
}

function generateRandomQuestionType(): z.infer<typeof questionAnswerTypes> & Pick<z.infer<typeof baseQuestion>, 'question'> {
  const dummyQuestions: (z.infer<typeof questionAnswerTypes> & Pick<z.infer<typeof baseQuestion>, 'question'> & Partial<z.infer<typeof baseQuestion>>)[] = [
    {
      type: 'multiple-choice',
      question: 'In the PAYDAY series, who betrayed the PAYDAY gang that got Hoxton arrested?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Hector',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Vlad',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'The Dentist',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'The Elephant',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "What is the world's longest venomous snake?",
      category: 'Animals',
      answers: [
        {
          answer: 'King Cobra',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Green Anaconda',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Inland Taipan',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Yellow Bellied Sea Snake',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What style of beer will typically have a higher than average hop content?',
      category: 'General Knowledge',
      answers: [
        {
          answer: 'India Pale Ale',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Stout',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Extra Special Bitter',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Scotch Ale',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'According to the 2014-2015 Australian Bureau of Statistics, what percentage of Australians were born overseas?',
      category: 'General Knowledge',
      answers: [
        {
          answer: '28%',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '13%',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '20%',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '7%',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "The words 'bungalow' and 'shampoo' originate from the languages of which country?",
      category: 'General Knowledge',
      answers: [
        {
          answer: 'India',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Papua New Guinea',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Ethiopia',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'China',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Before the American colonies switched to the Gregorian calendar in 1752, on what date did their new year start?',
      category: 'History',
      answers: [
        {
          answer: 'March 25th',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'June 1st',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'September 25th',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'December 1st',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Aubrey Graham is better known as',
      category: 'Celebrities',
      answers: [
        {
          answer: 'Drake',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Travis Scott',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Lil Wayne',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '2 Chainz',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What organelle aids in synthesis of DNA in cells?',
      category: 'Science &amp; Nature',
      answers: [
        {
          answer: 'Ribosomes',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Nuclei',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Lysosomes',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Mitochondria',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "What is the name of the pirate that sings the intro to 'Spongebob Squarepants'?",
      category: 'Entertainment: Television',
      answers: [
        {
          answer: 'Painty',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Patchy',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Lloyd',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Larry',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "In which year was the pen and paper RPG 'Deadlands' released?",
      category: 'Entertainment: Board Games',
      answers: [
        {
          answer: '1996',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '2003',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '1999',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '1993',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'In relation to the British Occupation in Ireland, what does the IRA stand for.',
      category: 'History',
      answers: [
        {
          answer: 'Irish Republican Army',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Irish Rebel Alliance',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Irish Reformation Army',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Irish-Royal Alliance',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Who created the Cartoon Network series 'Adventure Time'?",
      category: 'Entertainment: Cartoon &amp; Animations',
      answers: [
        {
          answer: 'Pendleton Ward',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'J. G. Quintel',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Ben Bocquelet',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Rebecca Sugar',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Who is the founder of Team Fortress 2's fictional company \'Mann Co\'?",
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Zepheniah Mann',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Cave Johnson',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Wallace Breem',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Saxton Hale',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which U.S. president was said to have been too honest to lie to his father about chopping down a cherry tree?',
      category: 'History',
      answers: [
        {
          answer: 'George Washington',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Abraham Lincoln',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Thomas Jefferson',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'James Monroe',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of the following landmarks is not located in New York City?',
      category: 'General Knowledge',
      answers: [
        {
          answer: 'Lincoln Memorial',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Empire State Building',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Times Square',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Central Park',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "How does the character Dragowizard, Qinus Axia's from the anime \'Buddyfight\' differ between the Japanese and English dubs?",
      category: 'Entertainment: Japanese Anime &amp; Manga',
      answers: [
        {
          answer: 'Different Gender',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Different Body Proportions',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Different Backstory',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Different Appearance',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of these is a colony of polyps and not a jellyfish?',
      category: 'Animals',
      answers: [
        {
          answer: 'Portuguese Man-of-War',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Sea Wasp',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Irukandji',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Sea Nettle',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Who is the main character of 'Metal Gear Solid 3'?",
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Naked Snake',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Solid Snake',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Liquid Snake',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Venom Snake',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of the three astronauts of the Apollo 11 spaceflight did NOT walk on the moon?',
      category: 'General Knowledge',
      answers: [
        {
          answer: 'Michael Collins',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Buzz Aldrin',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Neil Armstrong',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'None of them',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What is the name of the protagonist of Life Is Strange?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Max Caulfield',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Frank Bowers',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Rachel Amber',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Kate Marsh',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What album did Gorillaz release in 2017?',
      category: 'Entertainment: Music',
      answers: [
        {
          answer: 'Humanz',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Plastic Beach',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'The Fall',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Demon Days',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of these covert groups employs Sam Fisher to work as a Splinter Cell?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Third Echelon',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Voron',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Black Arrow',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'The Engineers',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'When was Steam first released?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: '2003',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '2004',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '2011',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '2007',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "What is the 'Mitsubishi Wakamaru'?",
      category: 'Science: Gadgets',
      answers: [
        {
          answer: 'A robot',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'A pickup truck',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'An motorcycle',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'A motorboat',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which country is featured in Ace Combat 5: The Unsung War?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Osea',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Aurelia',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Australia',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Japan',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Which classic book opens with the line 'Call me Ishmael'?",
      category: 'Entertainment: Books',
      answers: [
        {
          answer: 'Moby Dick',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'A Tale of Two Cities',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Kidnapped',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Wuthering Heights',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What was the first organic compound to be synthesized from inorganic compounds?',
      category: 'Science &amp; Nature',
      answers: [
        {
          answer: 'Urea',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Propane',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Ethanol',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Formaldehyde',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Which American manufactured submachine gun was informally known by the American soldiers that used it as 'Grease Gun'?",
      category: 'General Knowledge',
      answers: [
        {
          answer: 'M3',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Colt 9mm',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Thompson',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'MAC-10',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Where does 'Gasolina' rapper Daddy Yankee originate from?",
      category: 'Entertainment: Music',
      answers: [
        {
          answer: 'Puerto Rico',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Cuba',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Mexico',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Spain',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Who was among those killed in the 2010 Smolensk, Russia plane crash tragedy?',
      category: 'History',
      answers: [
        {
          answer: 'The Polish President',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Pope John Paul II',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Bang-Ding Ow',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Albert Putin',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "During World War I, which nation's monarchs were blood related?",
      category: 'History',
      answers: [
        {
          answer: 'England, Germany, Russia',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'France, Russia, Germany',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Serbia, Russia, Croatia',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Germany, Spain, Austria',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'In Bionicle, who was formerly a Av-Matoran and is now the Toa of Light?',
      category: 'Entertainment: Comics',
      answers: [
        {
          answer: 'Takua',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Jaller',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Vakama',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Tahu',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Which 90's comedy cult classic features cameos appearances from Meat Loaf, Alice Cooper and Chris Farley?",
      category: 'Entertainment: Film',
      answers: [
        {
          answer: "Wayne's World",
          correct: true,
          id: getUUID(),
        },
        {
          answer: "Bill &amp; Ted's Excellent Adventure",
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Dumb and Dumber',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Austin Powers: International Man of Mystery',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of the following former Yugoslavian states is landlocked?',
      category: 'Geography',
      answers: [
        {
          answer: 'Serbia',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Bosnia and Herzegovina',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Montenegro',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Croatia',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which one of the following is not made by Ford?',
      category: 'Vehicles',
      answers: [
        {
          answer: 'Camry',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Fusion',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Model A',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'F-150',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Who was the only president to not be in office in Washington D.C?',
      category: 'Politics',
      answers: [
        {
          answer: 'George Washington',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Abraham Lincoln',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Richard Nixon',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Thomas Jefferson',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Electronic music producer Kygo's popularity skyrocketed after a certain remix. Which song did he remix?",
      category: 'General Knowledge',
      answers: [
        {
          answer: 'Ed Sheeran - I See Fire',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Marvin Gaye - Sexual Healing',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Coldplay - Midnight',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'a-ha - Take On Me',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'In the first Left 4 Dead, you can play as either of these four characters.',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Francis, Bill, Zoey, and Louis',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Bender, Andrew, Allison, and Brian',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Coach, Ellis, Nick, and Rochelle',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Harry, Ron, Hermione and Dumbledore',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What is the exact length of one non-curved part in Lane 1 of an Olympic Track?',
      category: 'Sports',
      answers: [
        {
          answer: '84.39m',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '100m',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '100yd',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '109.36yd',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of these is NOT a province in China?',
      category: 'Geography',
      answers: [
        {
          answer: 'Yangtze',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Fujian',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Sichuan',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Guangdong',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "What was the first 'Team Fortress 2' update to include a war?",
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Sniper vs. Spy Update',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'WAR! Update',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Meet Your Match Update',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Spy Vs. Engineer Update',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "What is the lowest layer of the Earth's atmosphere named?",
      category: 'Science &amp; Nature',
      answers: [
        {
          answer: 'Troposphere',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Stratosphere',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Mesosphere',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Thermosphere',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Which band had hits in 1975 with the songs, 'One Of These Nights' &amp; 'Lyin Eyes'?",
      category: 'Entertainment: Music',
      answers: [
        {
          answer: 'The Eagles',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Fools Gold',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'The Doobie Brothers',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Fleetwood Mac',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "In \'Future Diary\', what is the name of Yuno Gasai's Phone Diary?",
      category: 'Entertainment: Japanese Anime &amp; Manga',
      answers: [
        {
          answer: 'Yukiteru Diary',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Murder Diary',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Escape Diary ',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Justice Diary ',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of the following Ivy League universities has its official motto in Hebrew as well as in Latin?',
      category: 'General Knowledge',
      answers: [
        {
          answer: 'Yale University',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Princeton University',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Harvard University',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Columbia University',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'What CS:GO case contains the Butterfly Knife?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Breakout Case',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Shadow Case',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Vanguard Case',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Esports 2014 Case',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "The rights to the 'Rayman' series are owned by which company?",
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Ubisoft',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Nintendo',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'EA',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Sony',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: "Which of these words means 'idle spectator'?",
      category: 'General Knowledge',
      answers: [
        {
          answer: 'Gongoozler',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Gossypiboma',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Jentacular',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Meupareunia',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'In Night In The Woods, where does Gregg work?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'Snack Falcon',
          correct: true,
          id: getUUID(),
        },
        {
          answer: "Ol' Pickaxe",
          correct: false,
          id: getUUID(),
        },
        {
          answer: "Video Outpost 'Too'",
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Food Donkey',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Which of these characters was considered, but ultimately not included, for Super Smash Bros. Melee?',
      category: 'Entertainment: Video Games',
      answers: [
        {
          answer: 'James Bond',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Diddy Kong',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Mega Man',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Wave Racer',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'What does RGB stand for?',
      answers: [
        { answer: 'Red Green Blue', correct: true, id: getUUID() },
        { answer: 'Red Orange Yellow', correct: false, id: getUUID() },
        { answer: 'Blue Magenta Cyan', correct: false, id: getUUID() },
        { answer: 'Brown Orange Red', correct: false, id: getUUID() },
      ],
    },

    {
      type: 'single-choice',
      question: 'What does USB stand for?',
      answers: [
        { id: getUUID(), answer: 'Universal Storage Bus', correct: false },
        { id: getUUID(), answer: 'Universal Self Storage', correct: false },
        { id: getUUID(), answer: 'Universal Serial Bus', correct: true },
        { id: getUUID(), answer: 'Universal Sustainable Storage', correct: false },
      ],
    },

    {
      type: 'multiple-choice',
      question: 'Which of these colors exist?',
      answers: [
        { id: getUUID(), answer: 'Orange', correct: true },
        { id: getUUID(), answer: 'Yellow', correct: true },
        { id: getUUID(), answer: 'Tree', correct: false },
        { id: getUUID(), answer: 'Asphalt', correct: false },
        { id: getUUID(), answer: 'Ink', correct: false },
        { id: getUUID(), answer: 'Brown', correct: true },
      ],
    },

    {
      type: 'drag-drop',
      question: 'Order these activities by the occurence',
      answers: [
        { id: getUUID(), answer: 'Midnight', position: 0 },
        { id: getUUID(), answer: 'Morning', position: 1 },
        { id: getUUID(), answer: 'Noon', position: 2 },
        { id: getUUID(), answer: 'Afternoon', position: 3 },
        { id: getUUID(), answer: 'Bedtime', position: 4 },
      ],
    },

    {
      type: 'drag-drop',
      question: 'Order these statements by the importance',
      answers: [
        { id: getUUID(), answer: 'Sleep', position: 0 },
        { id: getUUID(), answer: 'Food & Drinks', position: 1 },
        { id: getUUID(), answer: 'People', position: 2 },
        { id: getUUID(), answer: 'Chocolate', position: 3 },
      ],
    },

    {
      type: 'open-question',
      question: 'Describe the term web-dev',
      expectation: 'This term is an acronym for web-development, which stands for e.g. developing websites.',
    },

    {
      type: 'open-question',
      question: 'Describe the acronym RGB and its use-cases',
      expectation: 'Used to define colors through by setting the intensity of the three main colors (Red, Green, Blue).',
    },
    {
      type: 'single-choice',
      question: 'A flashing red traffic light signifies that a driver should do what?',
      answers: [
        {
          answer: 'stop',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'speed up',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'proceed with caution',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'honk the horn',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'A knish is traditionally stuffed with what filling?',
      answers: [
        {
          answer: 'potato',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'creamed corn',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'lemon custard',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'raspberry jelly',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'A pita is a type of what?',
      answers: [
        {
          answer: 'fresh fruit',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'flat bread',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'French tart',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'friend bean dip',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "A portrait that comically exaggerates a person's physical traits is called a what?",
      answers: [
        {
          answer: 'landscape',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'caricature',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'still life',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Impressionism',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'A second-year college student is usually called a what?',
      answers: [
        {
          answer: 'sophomore',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'senior',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'freshman ',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'junior ',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'A student who earns a J.D. can begin his or her career as a what?',
      answers: [
        {
          answer: 'lawyer',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'bricklayer',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'doctor',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'accountant',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'A triptych is a work of art that is painted on how many panels?',
      answers: [
        {
          answer: 'two',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'three',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'five',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'eight',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to a famous line from the existentialist play 'No Exit' what is hell?",
      answers: [
        {
          answer: 'oneself',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'other people',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'little made large',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'hued in green and blue',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to a popular slogan, what state should people not 'mess with'?",
      answers: [
        {
          answer: 'New York',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Texas',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Montana',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Rhode Island',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to a Yale University study, what smell is the most recognizable to American adults?',
      answers: [
        {
          answer: 'tuna',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'laundry',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'popcorn',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'coffee',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to folklore, the 'jackalope' is an antlered version of what animal?",
      answers: [
        {
          answer: 'chicken',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'rabbit',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'moose',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'snake',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to Greek mythology, who was Apollo's twin sister?",
      answers: [
        {
          answer: 'Aphrodite',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Artemis',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Venus',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Athena',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to legend, if you give someone the 'evil eye' what are you doing?",
      answers: [
        {
          answer: 'cursing them',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'blessing a child',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'counting money',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'passing time',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to legend, in what country are you most likely to meet a leprechaun?',
      answers: [
        {
          answer: 'Ireland',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Poland',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Greenland',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Scotland',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to the American Kennel Club, what is the most popular breed of dog in the US as of 1999?',
      answers: [
        {
          answer: 'Poodle',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Beagle',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'German shepherd',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Labrador retriever',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to the Bible, Moses and Aaron had a sister named what?',
      answers: [
        {
          answer: 'Jochebed',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Ruth',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Leah',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Miriam',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to the children's nursery rhyme, what type of ocean did Columbus sail in 1492?",
      answers: [
        {
          answer: 'calm',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'blue',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'windy',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'really big',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to the Mother Goose nursery rhyme, which child is full of woe?',
      answers: [
        {
          answer: "Monday's child",
          correct: false,
          id: getUUID(),
        },
        {
          answer: "Wednesday's child",
          correct: true,
          id: getUUID(),
        },
        {
          answer: "Thursday's child",
          correct: false,
          id: getUUID(),
        },
        {
          answer: "Saturday's child",
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to the popular saying, what should you do 'when in Rome'?",
      answers: [
        {
          answer: 'watch your wallet',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'see the Coliseum',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'as the Romans do',
          correct: true,
          id: getUUID(),
        },
        {
          answer: "don't drink the water",
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to the proverb, necessity is the mother of what?',
      answers: [
        {
          answer: 'Invention',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Luck',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Problems',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Procrastination',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "According to the title of a popular children's TV show, what color is Bear's big house?",
      answers: [
        {
          answer: 'red',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'green',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'purple',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'blue',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'According to the USDA, which food group should you eat the most servings of per day?',
      answers: [
        {
          answer: 'vegetables',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'dairy',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'meats',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'breads',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Ada Lovelace is credited with being the first person to have made what?',
      answers: [
        {
          answer: 'a computer program',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'a souffle',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'a brassiere',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'a mystery novel',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'After Prince Charles, who is next in line to be the king of England?',
      answers: [
        {
          answer: 'Prince William',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Prince Andrew',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Prince Edward',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Fresh Prince',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "An airplane's black box is usually what color?",
      answers: [
        {
          answer: 'black',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'white',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'orange',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'purple',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'As of 1999, which state has the most Girl Scouts?',
      answers: [
        {
          answer: 'California',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Illinois',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'New York',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Pennsylvania',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Astronaut John Glenn served as a pilot in what branch of the military?',
      answers: [
        {
          answer: 'Army',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Air Force',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Marines',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Navy',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "At the equator, how fast is the earth's surface turning?",
      answers: [
        {
          answer: 'about 100 miles per hour',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'about 500 miles per hour',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'about 1000 miles per hour',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'about 2000 miles per hour',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'At what age can someone first attend an R-rated movie without an accompanying adult?',
      answers: [
        {
          answer: '15',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '17',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '18',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '21',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Backgammon is a how many player game?',
      answers: [
        {
          answer: 'Two',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Three',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Four',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Six',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Before he went into coaching, Phil Jackson played for which of the following NBA teams?',
      answers: [
        {
          answer: 'Boston Celtics',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Los Angeles Lakers',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'New York Knicks',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Philadelphia 76ers',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'By what name is Bob Keeshan better known?',
      answers: [
        {
          answer: 'Bozo the Clown',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Pee Wee Herman',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Captain Kangaroo',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Buffalo Bob',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'By what collective name do Christians refer to God the Father, God the Son and the Holy Ghost?',
      answers: [
        {
          answer: 'the Trio',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Troika',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Triumvirate',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Trinity',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'By what nickname is the Federal National Mortgage Association known?',
      answers: [
        {
          answer: 'Morty',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'FEMA',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Freddie Mac',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Fannie Mae',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Cheddar cheese got its name from a village in what country?',
      answers: [
        {
          answer: 'England',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'France',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Switzerland',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Denmark',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Cheese is a necessary ingredient in which of these dishes?',
      answers: [
        {
          answer: 'sushi',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'french fries',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'veal parmigiano',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'chicken pot pie',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "During what war did Francis Scott Key write the words to 'The Star-Spangled Banner'?",
      answers: [
        {
          answer: 'American Revolution',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'War of 1812',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Civil War',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'World War I',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'During which war did US troops fight the Battle of New Orleans?',
      answers: [
        {
          answer: 'American Revolution',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Civil War',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Mexican War',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'War of 1812',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Each year in pro baseball, the player voted as the best fielder at his position wins what?',
      answers: [
        {
          answer: 'a brand new car',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Gold Glove',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'the Silver Bat',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Brass Baseball',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Elephant tusks are made of what material?',
      answers: [
        {
          answer: 'coral',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'ivory',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'bone',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'calcium',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Excluding wisdom teeth, how many adult teeth do humans have?',
      answers: [
        {
          answer: '28',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '32',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '35',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '40',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "For a man and woman on a date, 'dutch treat' means what?",
      answers: [
        {
          answer: 'the man pays',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the woman pays',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'the Dutch pay',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'each pays their own way',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'For what purpose would you use an awl?',
      answers: [
        {
          answer: 'to shoot ducks',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'to polish floors',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'to make holes',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'to weigh fruit',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'From 1971 to 1997, the Democratic Republic of Congo was known as what?',
      answers: [
        {
          answer: 'Zaire',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Angola',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Rhodesia',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Belgian Congo',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: "From what language does the term 'R.S.V.P.' originate?",
      answers: [
        {
          answer: 'Russian',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Italian',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Portuguese',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'French',
          correct: true,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'From whom does the Lutheran Church get its name?',
      answers: [
        {
          answer: 'Martin Luther King Jr',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Martin Luther',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Luther Vandross',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Lex Luthor',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Gerry Adams is the president of what organization?',
      answers: [
        {
          answer: 'Greenpeace',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'NASCAR',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Sinn Fein',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'PLO',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'Girls of what religious community traditionally wear bonnets?',
      answers: [
        {
          answer: 'Amish',
          correct: true,
          id: getUUID(),
        },
        {
          answer: 'Sikh',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Roman Catholic',
          correct: false,
          id: getUUID(),
        },
        {
          answer: 'Christian',
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'How are actors Charlie Sheen and Emilio Estevez related?',
      answers: [
        {
          answer: "they're cousins",
          correct: false,
          id: getUUID(),
        },
        {
          answer: "they're brothers",
          correct: true,
          id: getUUID(),
        },
        {
          answer: "they're father and son",
          correct: false,
          id: getUUID(),
        },
        {
          answer: "they're uncle and nephew",
          correct: false,
          id: getUUID(),
        },
      ],
    },
    {
      type: 'single-choice',
      question: 'How do you express 3/4 as a decimal?',
      answers: [
        {
          answer: '.25',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '.50',
          correct: false,
          id: getUUID(),
        },
        {
          answer: '.75',
          correct: true,
          id: getUUID(),
        },
        {
          answer: '.90',
          correct: false,
          id: getUUID(),
        },
      ],
    },
  ]

  const randomIndex = Math.abs(Math.round(Math.random() * dummyQuestions.length - 1))
  return dummyQuestions[randomIndex]
}

// endregion
