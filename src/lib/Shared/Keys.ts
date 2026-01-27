export default function getKeys<TObj extends object>(obj: TObj) {
  const keys = Object.keys(obj) as (keyof TObj)[]
  return keys
}
