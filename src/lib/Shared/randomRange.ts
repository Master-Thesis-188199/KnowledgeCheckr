export default function randomRange(options: { min?: number; max?: number; multiplyFactor?: number; rounded?: boolean } = {}) {
  const min = options.min ?? 0

  let value: number = Math.max(min, Math.random() * (options.multiplyFactor ?? 1))

  if (options.max !== undefined) value = Math.min(value, options.max)

  return options.rounded ? Math.floor(value) : value
}
