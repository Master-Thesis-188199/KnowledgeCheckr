/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from 'react'
import { RunTests } from '@typescript-eslint/utils/ts-eslint'
import { MessageIds, Options } from '../require-color-mode-styles'

type StaticSpecProps = {
  type: 'staticClassname'
} & SpecProps

type DynamicSpecProps = {
  type: 'utilityFunction'
  functionName: string
  baseArguments: string[][]
  missingArguments: string[][]

  errorType: MessageIds[]
  utilities: Array<Array<Options['utilityClasses'][number]>>
} & Omit<SpecProps, 'baseClasses' | 'missingClasses' | 'errorType' | 'utilities'>

type SpecProps = Omit<RunTests<MessageIds, Options[]>['invalid'][number], 'code' | 'errors' | 'output' | 'options'> & {
  errorType: MessageIds
  name: string
  baseClasses: string[]
  missingClasses: string[]
  utilities: Array<Options['utilityClasses'][number]>
  ruleOptions?: Partial<Options>
  jsxTag?: ElementType
}

const quoteString = (input: string) => `'${input}'`
const quoteJoinArray = (options: string[], seperator = ', ') => options.map(quoteString).join(seperator)
const joinArray = (options: string[], seperator = ', ') => options.join(seperator)

export function createStaticClassTest({
  jsxTag,
  baseClasses,
  missingClasses,
  utilities,
  ruleOptions,
  name,
  errorType,
  ...optionalProps
}: SpecProps): RunTests<MessageIds, Options[]>['invalid'][number] {
  const tag = jsxTag ?? 'div'
  const baseClassStr = baseClasses.join(' ')

  const options = ruleOptions ? ([ruleOptions] as never) : undefined

  const addAllSuggestion = () => {
    if (missingClasses.length <= 1) return []

    return [
      {
        desc: `Add all missing classes for ${joinArray(utilities)}`,
        output: `const A = () => (<${tag} className="${baseClassStr} ${missingClasses.join(' ')}" />)`,
      },
    ]
  }

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
          ...addAllSuggestion(),
          ...missingClasses.map((missingClass): any => ({
            desc: `Add ${missingClass.includes('dark:') ? 'dark' : 'light'}-mode ${missingClass}`,
            output: `const A = () => (<${tag} className="${baseClassStr} ${missingClass}" />)`,
          })),
        ],
      },
    ],
  }
}

export function createDynamicClassTest({
  functionName,
  type,
  jsxTag,
  baseArguments,
  missingArguments,
  utilities,
  ruleOptions,
  name,
  errorType,
  ...optionalProps
}: DynamicSpecProps): RunTests<MessageIds, Options[]>['invalid'][number] {
  const tag = jsxTag ?? 'div'
  const options = ruleOptions ? ([ruleOptions] as never) : []

  const createClassnames = (funcArguments: string[][]) => {
    return `${functionName}(${funcArguments.map((arg) => "'" + arg.join(' ') + "'").join(', ')})`
  }

  const insertMissingArguments = (missingArgs: (typeof missingArguments)[number], argIndex: number) => {
    const base = [...baseArguments]
    const combined: typeof base = base

    base.forEach((baseArg, i) => {
      if (i === argIndex) {
        combined[i] = baseArg.concat(missingArgs)
      }
    })

    return combined
  }

  const insertSingleMissingClass = (missingClass: (typeof missingArguments)[number][number], argIndex: number) => {
    const base = [...baseArguments]
    const combined: typeof baseArguments = base

    base.forEach((baseArg, i) => {
      if (i !== argIndex) return
      combined[i] = baseArg.concat([missingClass])
    })

    return combined
  }

  const addAllSuggestion = (missingArgs: (typeof missingArguments)[number], argIndex: number) => {
    if (missingArgs.length <= 1) return [] // add-all is only available when there are multiple classes missing

    return [
      {
        desc: `Add all missing classes for ${joinArray(utilities[argIndex])}`,
        // expectation:
        output: `const A = () => (<${tag} className={${createClassnames(insertMissingArguments(missingArgs, argIndex))}} />)`,
      },
    ]
  }

  return {
    ...optionalProps,
    name: name,
    options,
    code: `const A = () => (<${tag} className={${createClassnames(baseArguments)}} />)`,
    errors: missingArguments.map((missing_arg, argIndex) => ({
      messageId: errorType[argIndex],
      data: {
        key: joinArray(utilities[argIndex]),
        missing: quoteJoinArray(missing_arg),
      },
      suggestions: [
        ...addAllSuggestion(missing_arg, argIndex),
        ...missing_arg.map((missingClass): any => ({
          desc: `Add ${missingClass.includes('dark:') ? 'dark' : 'light'}-mode ${missingClass}`,
          // expectation:
          output: `const A = () => (<${tag} className={${createClassnames(insertSingleMissingClass(missingClass, argIndex))}} />)`,
        })),
      ],
    })),
  }
}

export default function declareTest(props: StaticSpecProps | DynamicSpecProps) {
  return props.type === 'staticClassname' ? createStaticClassTest(props) : createDynamicClassTest(props)
}
