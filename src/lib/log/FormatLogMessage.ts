type FormatValues = {
  timestamp: unknown
  identifier: unknown
  level: string
  message: unknown
  [key: string | symbol]: unknown
}

type ShowOptions = {
  timestamp?: boolean
  identifier?: boolean
  args?: boolean
  colorizeArgs?: boolean
}

/**
 * This function allows unified log message formats across all logger-transports by specifying which optional properties to print via the `show` property.
 * @param show Allows for customization of which optional arguments to include in log messages
 * @param values The values provided by the `winston.format.printf` function.
 * @returns The formatted log message
 */
export function formatLogMessage({ show, values: { timestamp, identifier, level, message, ...args } }: { show: ShowOptions; values: FormatValues }) {
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
        case 'identifier':
          fields.set(key, identifier)
          break
        case 'args':
          fields.set(key, args)
          break
      }
    }
  })

  const templateArgs = []

  if (fields.has('timestamp')) templateArgs.push('<timestamp>')
  if (fields.has('identifier')) templateArgs.push('(<identifier>)')
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
