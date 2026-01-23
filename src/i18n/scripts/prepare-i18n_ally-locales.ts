/* eslint-disable enforce-logger-usage/no-console-in-server-or-async */
import isEqual from 'lodash/isEqual'
import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type Translations = {
  [key: string]: string | Translations
}

type PlainObject = Record<string, unknown>

const baseLocaleDirName = 'locales'
/**
 * The name of the directory to save the i18n-ally extension friendly locales
 */
const outputLocaleDirName = 'locales_i18n_ally'

const PLURAL_FORMS = new Set(['zero', 'one', 'two', 'few', 'many', 'other'])

/**
 * Deep clone + add "base keys" for plural-suffixed keys like:
 *   "stars#one", "stars#other"  -> also create "stars" (prefer #other)
 * so that `i18n-ally` recognizes the key and display the base-translation
 */
function addPluralBaseKeys<TInputShape extends object | string>(input: TInputShape): TInputShape {
  if (!isPlainObject(input)) return input

  const obj = input as Translations
  const out: Translations = {}

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

  return out as TInputShape
}

function isPlainObject(x: unknown): x is PlainObject {
  return !!x && typeof x === 'object' && !Array.isArray(x)
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true })
}

async function readRuntimeLocale(filePath: string): Promise<object> {
  // With a TS runner (tsx), we can import TS locale modules directly.
  const mod = await import(pathToFileURL(filePath).href)
  return mod.default ?? mod
}

async function main() {
  const root = import.meta.dirname
  const baseLocaleDirectory = path.join(root, '..', baseLocaleDirName)
  const outputLocaleDirectory = path.join(root, '..', outputLocaleDirName)

  await ensureDir(outputLocaleDirectory)

  const files = await fs.readdir(baseLocaleDirectory)
  const localeFiles = files.filter((f) => f.endsWith('.ts') || f.endsWith('.js'))

  for (const file of localeFiles) {
    const locale = file.replace(/\.(ts|js)$/, '')
    const filePath = path.join(baseLocaleDirectory, file)

    const baseTranslations = await readRuntimeLocale(filePath)
    const extendedTranslations = addPluralBaseKeys(baseTranslations)

    if (isEqual(baseTranslations, extendedTranslations)) {
      console.log(`Locale '${locale}' has not been modified. Aborting i18n-ally locale preparation...\n`)
      continue
    }

    const outPath = path.join(outputLocaleDirectory, `${locale}.json`)
    await fs.writeFile(outPath, JSON.stringify(extendedTranslations, null, 2) + '\n', 'utf8')

    console.log(`Generated ${outPath}\n`)
  }
}

let executionCount = 0
main()
  .then(() => {
    const startNoficiationOptions: Parameters<typeof sendUpdateNotification>['0'] = {
      soundName: 'SelectClick',
      title: 'Listening for locale changes',
      subtitle: 'Generating i18n-ally friend locale files onChange',
    }
    sendUpdateNotification(executionCount > 0 ? {} : startNoficiationOptions)
    executionCount++
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

function sendUpdateNotification({
  title = 'Generated i18n-ally translations',
  subtitle = 'Re-generated i18n-ally translations to support plural entries',
  soundName = 'TheDrop',
  withSound = true,
}: {
  title?: string
  subtitle?: string
  withSound?: boolean
  soundName?: string
}) {
  if (process.platform === 'darwin') {
    const cmd = `osascript -e 'display notification "${subtitle}" with title "${title}" ${withSound ? `sound name "${soundName}"` : ''}'`
    console.log(cmd)
    exec(cmd, () => {})
  }
}
