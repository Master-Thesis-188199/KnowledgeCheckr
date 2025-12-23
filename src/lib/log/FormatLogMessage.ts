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
export function formatLogMessage({ show, values }: { show: ShowOptions; values: FormatValues }) {
  return computeAndApplyTemplate(show, values)
}

function parseExtraArguments(args: Array<unknown>, colored: boolean) {
  return args.map((arg) => {
    if (typeof arg === 'object') {
      return '\n' + stringifyObject(arg, { colored, pretified: true })
    }

    return String(arg)
  })
}

function computeAndApplyTemplate(propertyVisibilities: ShowOptions, values: FormatValues) {
  const fields = new Map([
    ['level', values.level],
    ['message', values.message],
  ])

  //* destructure known values to prevent identifying them as additional arguments
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { timestamp, context, level, message, ...args } = values

  //* gather included log properties and their values
  Object.keys(propertyVisibilities).map((key) => {
    const included = propertyVisibilities[key as keyof typeof propertyVisibilities]
    if (!included) return

    if (key === 'args') {
      fields.set(key, getObjectBySymbol(args, 'splat'))
    } else if (!!values[key]) {
      fields.set(key, values[key])
    }
  })

  let templateOrder: Array<keyof (Omit<ShowOptions, 'colorizeArgs'> & Pick<FormatValues, 'level' | 'message'>)> = ['timestamp', 'context', 'level', 'message', 'args']
  // strip fields that shall not be included in the log-messages from the template-order
  templateOrder = templateOrder.filter((key) => !!fields.has(key))

  const templateArgs = []

  //* compute template string composed of included properties in the desired order
  for (const templateKey of templateOrder) {
    if (!fields.has(templateKey)) continue

    if (templateKey === 'context')
      // override styling for context property
      templateArgs.push(`(<${templateKey}>)`)
    else if (templateKey === 'level')
      // override styling for level property
      templateArgs.push(`[<${templateKey}>]:`)
    else templateArgs.push(`<${templateKey}>`)
  }

  //* build template string
  let logMessage = Array.from(templateArgs).join(' ')

  //* insert values into template string
  for (const messageElementKey of templateOrder) {
    let value = fields.get(messageElementKey)

    if (messageElementKey === 'args') {
      value = parseExtraArguments(value as unknown[], propertyVisibilities.colorizeArgs ?? false).join(' ')
    } else if (typeof value === 'object') {
      value = stringifyObject(value, { colored: propertyVisibilities.colorizeArgs ?? false, pretified: true })
    }

    logMessage = logMessage.replace(`<${messageElementKey}>`, String(value).trim())
  }

  return logMessage
}
