import isEmpty from 'lodash/isEmpty'

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
          if (isEmpty(args)) break
          fields.set(key, args)
          break
      }
    }
  })

  const templateArgs = []

  if (fields.has('timestamp')) templateArgs.push('<timestamp>')
  if (fields.has('context')) templateArgs.push('(<context>)')
  templateArgs.push('[<level>]:')
  templateArgs.push('<message>')
  if (fields.has('args')) templateArgs.push('\n<args>')

  let template = templateArgs.join(' ')

  fields.forEach((value, key) => {
    if (typeof value === 'object') {
      // @ts-expect-error Expect colorStringify to not be found
      if (show.colorizeArgs) value = JSON.colorStringify(value, null, 2)
      else value = JSON.stringify(value, null, 2)
    }

    template = template.replace(`<${key}>`, value)
  })

  return template
}
