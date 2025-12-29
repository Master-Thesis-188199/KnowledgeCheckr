/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from 'react'
import { RunTests } from '@typescript-eslint/utils/ts-eslint'
import { MessageIds, Options } from '../require-color-mode-styles'

type SpecProps = {
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

export default function createTest(spec: SpecProps): RunTests<MessageIds, Options[]>['invalid'][number] {
  const tag = spec.jsxTag ?? 'div'
  const baseClassStr = spec.baseClasses.join(' ')

  const options = spec.ruleOptions ? ([spec.ruleOptions] as never) : undefined

  return {
    name: spec.name,
    options,
    code: `const A = () => (<${tag} className="${baseClassStr}" />)`,
    errors: [
      {
        messageId: spec.errorType,
        data: {
          key: joinArray(spec.utilities),
          missing: quoteJoinArray(spec.missingClasses),
        },
        suggestions: [
          {
            desc: `Add all missing classes for ${joinArray(spec.utilities)}`,
            output: `const A = () => (<${tag} className="${baseClassStr} ${spec.missingClasses.join(' ')}" />)`,
          },
          ...spec.missingClasses.map((missingClass): any => ({
            desc: `Add ${missingClass.includes('dark:') ? 'dark' : 'light'}-mode ${missingClass}`,
            output: `const A = () => (<${tag} className="${baseClassStr} ${missingClass}" />)`,
          })),
        ],
      },
    ],
  }
}
