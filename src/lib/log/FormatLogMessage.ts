import isEmpty from 'lodash/isEmpty'
import { stringifyObject } from '@/src/lib/log/StringifyObject'

type FormatValues = {
  timestamp: unknown
  context: unknown
  level: string
  message: unknown
  [key: string | symbol]: unknown
}

type ShowOptions = {
  timestamp?: boolean
  context?: boolean
  args?: boolean
  colorizeArgs?: boolean
}

/**
 * This function is used to access an object property through a matching symbol.
 * @param obj The object that contains symbols.
 * @param _symbol The symbol that should match to retrieve the respective property from the given object.
 * @returns The given object-property associated with the given symbol.
 */
function getObjectBySymbol(obj: object, _symbol: string) {
  const symbols = Object.getOwnPropertySymbols(obj)
  const symbol = symbols.find((s) => s.toString().toLowerCase().includes(_symbol))

  if (!symbol) return undefined

  //@ts-expect-error Accessing object-symbol is not a common practice.
  return obj[symbol]
}

/**
 * This function allows unified log message formats across all logger-transports by specifying which optional properties to print via the `show` property.
 * @param show Allows for customization of which optional arguments to include in log messages
 * @param values The values provided by the `winston.format.printf` function.
 * @returns The formatted log message
 */
export function formatLogMessage({ show, values: { timestamp, context, level, message, ...args } }: { show: ShowOptions; values: FormatValues }) {
  const fields = new Map()
  fields.set('level', level)
  fields.set('message', message)

  Object.keys(show).forEach((_key) => {
    const key = _key as keyof typeof show
    if (!!show[key]) {
      switch (key) {
        case 'timestamp':
          fields.set(key, timestamp)
          break
        case 'context':
          fields.set(key, context)
          break
        case 'args':
          if (isEmpty(getObjectBySymbol(args, 'splat'))) break
          fields.set(key, getObjectBySymbol(args, 'splat'))
          break
      }
    }
  })

  const templateArgs = []

  if (fields.has('timestamp')) templateArgs.push('<timestamp>')
  if (fields.has('context')) templateArgs.push('(<context>)')
  templateArgs.push('[<level>]:')
  templateArgs.push('<message>')
  if (fields.has('args')) templateArgs.push('<args>')

  let template = templateArgs.join(' ')

  fields.forEach((value, key) => {
    //* the args argument is provided as an array of individual arguments by winston, thus each element is parsed respectively.
    if (key === 'args') {
      value = parseExtraArguments(value as unknown[], show.colorizeArgs ?? false).join(' ')
    } else if (typeof value === 'object') {
      value = stringifyObject(value, { colored: show.colorizeArgs ?? false, pretified: true })
    }

    template = template.replace(`<${key}>`, value)
  })

  return template
}

function parseExtraArguments(args: Array<unknown>, colored: boolean) {
  return args.map((arg) => {
    if (typeof arg === 'object') {
      return '\n' + stringifyObject(arg, { colored, pretified: true })
    }

    return String(arg)
  })
}
