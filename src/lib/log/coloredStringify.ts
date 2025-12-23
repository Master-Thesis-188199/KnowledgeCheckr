import 'node-json-color-stringify'

// @ts-expect-error Expect colorStringify to not be found
export const stringifyColored = (v: object | null): string => JSON.colorStringify(v, null, 2)
