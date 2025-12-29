/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from 'react'
import { RunTests } from '@typescript-eslint/utils/ts-eslint'
import { MessageIds, Options } from '../require-color-mode-styles'

type SpecProps = Omit<RunTests<MessageIds, Options[]>['invalid'][number], 'code' | 'errors' | 'output' | 'options'> & {
  errorType: MessageIds
  name: string
  baseClasses: string[]
  missingClasses: string[]
  utilities: string[]
  ruleOptions?: Partial<Options>
  jsxTag?: ElementType
}

const quoteString = (input: string) => `'${input}'`
const quoteJoinArray = (options: string[], seperator = ', ') => options.map(quoteString).join(seperator)
const joinArray = (options: string[], seperator = ', ') => options.join(seperator)

export default function createTest({ jsxTag, baseClasses, missingClasses, utilities, ruleOptions, name, errorType, ...optionalProps }: SpecProps): RunTests<MessageIds, Options[]>['invalid'][number] {
  const tag = jsxTag ?? 'div'
  const baseClassStr = baseClasses.join(' ')

  const options = ruleOptions ? ([ruleOptions] as never) : undefined

  return {
    ...optionalProps,
    name: name,
    options,
    code: `const A = () => (<${tag} className="${baseClassStr}" />)`,
    errors: [
      {
        messageId: errorType,
        data: {
          key: joinArray(utilities),
          missing: quoteJoinArray(missingClasses),
        },
        suggestions: [
          {
            desc: `Add all missing classes for ${joinArray(utilities)}`,
            output: `const A = () => (<${tag} className="${baseClassStr} ${missingClasses.join(' ')}" />)`,
          },
          ...missingClasses.map((missingClass): any => ({
            desc: `Add ${missingClass.includes('dark:') ? 'dark' : 'light'}-mode ${missingClass}`,
            output: `const A = () => (<${tag} className="${baseClassStr} ${missingClass}" />)`,
          })),
        ],
      },
    ],
  }
}
