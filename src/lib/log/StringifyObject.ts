import { colorize } from 'json-colorizer'

export const stringifyObject = (obj: object | null, opts: { colored?: boolean; pretified?: boolean }): string => {
  if (opts.pretified) {
    const json = JSON.stringify(obj, null, 2)
    return opts.colored ? colorize(json) : json
  } else {
    const json = JSON.stringify(obj)
    return opts.colored ? colorize(json) : json
  }
}
