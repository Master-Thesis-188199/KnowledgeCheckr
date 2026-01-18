/* eslint-disable enforce-logger-usage/no-console-in-server-or-async */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type PlainObject = Record<string, unknown>

const localeDir = 'locales'
const i18nAllyDir = 'locales_i18n_ally'

const PLURAL_FORMS = new Set(['zero', 'one', 'two', 'few', 'many', 'other'])

/**
 * Deep clone + add "base keys" for plural-suffixed keys like:
 *   "stars#one", "stars#other"  -> also create "stars" (prefer #other)
 * so that `i18n-ally` recognizes the key and display the base-translation
 */
function addPluralBaseKeys(input: unknown): unknown {
  if (!isPlainObject(input)) return input

  const obj = input as PlainObject
  const out: PlainObject = {}

  // First recurse normally
  for (const [k, v] of Object.entries(obj)) {
    out[k] = addPluralBaseKeys(v)
  }

  // Then add base keys for plural entries
  // For every key "name#form", if "name" is missing, create it using:
  //   prefer #other, else #one, else first available
  const pluralGroups = new Map<string, { other?: string; one?: string; first?: string }>()

  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== 'string') continue

    const m = k.match(/^(.*)#([a-zA-Z]+)$/)
    if (!m) continue

    const base = m[1]
    const form = m[2]

    if (!PLURAL_FORMS.has(form)) continue

    const group = pluralGroups.get(base) ?? {}
    if (!group.first) group.first = v
    if (form === 'other') group.other = v
    if (form === 'one') group.one = v

    pluralGroups.set(base, group)
  }

  for (const [base, group] of pluralGroups.entries()) {
    // Only create base if it's actually missing
    if (Object.prototype.hasOwnProperty.call(out, base)) continue

    out[base] = group.other ?? group.one ?? group.first ?? ''
  }

  return out
}

function isPlainObject(x: unknown): x is PlainObject {
  return !!x && typeof x === 'object' && !Array.isArray(x)
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true })
}

async function readRuntimeLocale(filePath: string): Promise<unknown> {
  // With a TS runner (tsx), we can import TS locale modules directly.
  const mod = await import(pathToFileURL(filePath).href)
  return mod.default ?? mod
}

async function main() {
  const root = import.meta.dirname
  const runtimeDir = path.join(root, '..', localeDir)
  const ideDir = path.join(root, '..', i18nAllyDir)

  await ensureDir(ideDir)

  const files = await fs.readdir(runtimeDir)
  const localeFiles = files.filter((f) => f.endsWith('.ts') || f.endsWith('.js'))

  for (const file of localeFiles) {
    const locale = file.replace(/\.(ts|js)$/, '')
    const runtimePath = path.join(runtimeDir, file)

    const runtimeMessages = await readRuntimeLocale(runtimePath)
    const ideMessages = addPluralBaseKeys(runtimeMessages)

    const outPath = path.join(ideDir, `${locale}.json`)
    await fs.writeFile(outPath, JSON.stringify(ideMessages, null, 2) + '\n', 'utf8')

    console.log(`Generated ${outPath}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
