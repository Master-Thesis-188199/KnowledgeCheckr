/* eslint-disable enforce-logger-usage/no-console-in-server-or-async */
import isEqual from 'lodash/isEqual'
import { exec } from 'node:child_process'
import { existsSync, promises as fs, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import util from 'node:util'

type Translations = {
  [key: string]: string | Translations
}

type PlainObject = Record<string, unknown>

const baseLocaleDirName = 'locales'
/**
 * The name of the directory to save the i18n-ally extension friendly locales
 */
const outputLocaleDirName = 'locales'

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

async function readJSONLocale(filePath: string): Promise<object> {
  const content = readFileSync(filePath).toString()
  return JSON.parse(content)
}

/**
 * Saves the modified translations (added base-keys) to the respective filePath in a tsx-module default export syntax.
 * @param filePath The file path under which the updated translations are to be saved
 * @param translations The modified translations to save
 */
async function exportRuntimeLocale(filePath: string, translations: object) {
  const moduleContent = `//! Auto generated file, changes to this file will get replaced on next update
export default ${util.inspect(translations, {
    colors: false,
    depth: null,
    compact: false,
  })} as const`

  await fs.writeFile(filePath, moduleContent + '\n', 'utf8')
}

/**
 * Saves the modified translations (added base-keys) to the respective filePath as json file.
 * @param filePath The file path under which the updated translations are to be saved
 * @param translations The modified translations to save
 */
async function exportJsonLocale(filePath: string, translations: object) {
  await fs.writeFile(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf8')
}

async function main() {
  const root = import.meta.dirname
  const baseLocaleDirectory = path.join(root, '..', baseLocaleDirName)
  const outputLocaleDirectory = path.join(root, '..', outputLocaleDirName)

  await ensureDir(outputLocaleDirectory)

  //* Source of truth are json files, upon edit --> they are extended with missing base-keys and respective typescript modules are re-created to support type-safety.

  const files = await fs.readdir(baseLocaleDirectory)

  const localeFiles = files.filter((f) => f.endsWith('.json'))

  for (const filename of localeFiles) {
    const extension = filename.split('.').at(-1)
    const locale = filename.replace(/\.(ts|js|json)$/, '')
    const filePath = path.join(baseLocaleDirectory, filename)

    //* are translations up-to-date
    const localeHasOuptut = existsSync(path.join(baseLocaleDirectory, `${locale}.ts`))
    const generatedLocaleOuptutExists = localeHasOuptut ? await readRuntimeLocale(path.join(baseLocaleDirectory, `${locale}.ts`)) : undefined

    const baseTranslations = extension === 'ts' ? await readRuntimeLocale(filePath) : await readJSONLocale(filePath)
    const extendedTranslations = addPluralBaseKeys(baseTranslations)

    const areTranslationsUpToDate = generatedLocaleOuptutExists ? isEqual(baseTranslations, generatedLocaleOuptutExists) : false
    const noBaseKeysMissing = isEqual(baseTranslations, extendedTranslations)

    // locale files (json --> ts) are in sync and no base-keys are missing
    if (areTranslationsUpToDate && noBaseKeysMissing) {
      console.log(`Locale '${locale}' is up-to-date with auto-generated translations. No new keys were added, aborting preparation script for this locale.`)
      continue
    }

    await updateLocale(locale, outputLocaleDirectory, extendedTranslations, { missingBaseKeys: !noBaseKeysMissing, translationsOutdated: !areTranslationsUpToDate })

    if (!noBaseKeysMissing) {
      await sendUpdateNotification({
        title: `Identified missing base-keys for '${locale}'`,
        subtitle: `Updating source and output locale files for '${locale}' with missing base-keys`,
        soundName: 'TheDrop',
      })
    } else if (!areTranslationsUpToDate) {
      await sendUpdateNotification({
        title: `Translations out of sync for '${locale}'`,
        subtitle: `Updating typescript translation for '${locale}' as they are out-of-sync`,
        soundName: 'SelectClick',
      })
    }
  }
}

/**
 * This utility function applies updated translations to either both the source-locale (json) and the output locale (ts) depending on what changed
 * @param locale The locale which should be updated
 * @param directoryPath The directory where the locales are stored
 * @param translations The updated translations
 * @param options.translationsOutdated When set to true and no base-keys are missing only the typescript locale file is updated so that is up-to-date with the source-locale (json)
 * @param options.missingBaseKeys When set to true then the updated translations are applied to both the source-locale (json)  and the typescript locale file (ts)
 */
async function updateLocale(
  locale: 'en' | 'de' | string,
  directoryPath: string,
  translations: object,
  { translationsOutdated, missingBaseKeys }: { translationsOutdated: boolean; missingBaseKeys: boolean },
) {
  let updateMode: 'update-typescript' | 'update-both' | undefined

  if (translationsOutdated) updateMode = 'update-typescript'
  if (missingBaseKeys) updateMode = 'update-both'

  switch (updateMode) {
    case 'update-typescript': {
      console.log(`'${locale}' translations out-of-sync. Generating typescript module.`)
      await exportRuntimeLocale(path.join(directoryPath, `${locale}.ts`), translations)
      break
    }
    case 'update-both': {
      console.log(`Missing base-keys detected for '${locale}'. Generating typescript module and updating locale.json file.`)
      await exportRuntimeLocale(path.join(directoryPath, `${locale}.ts`), translations)
      await exportJsonLocale(path.join(directoryPath, `${locale}.json`), translations)
      break
    }
  }
}

main().catch((e) => {
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
