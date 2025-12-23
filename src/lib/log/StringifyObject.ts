import 'node-json-color-stringify'

export const stringifyObject = (obj: object | null, opts: { colored?: boolean; pretified?: boolean }): string => {
  if (opts.pretified) {
    // @ts-expect-error Expect colorStringify to not be found
    return opts.colored ? JSON.colorStringify(obj, null, 2) : JSON.stringify(obj, null, 2)
  } else {
    // @ts-expect-error Expect colorStringify to not be found
    return opts.colored ? JSON.colorStringify(obj) : JSON.stringify(obj)
  }
}
