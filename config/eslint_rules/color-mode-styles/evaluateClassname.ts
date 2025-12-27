import collectClassnames from './collectClassnames'
import { ClassWithOwner, Options } from './require-color-mode-styles'

/**
 * This function evaluate a given className by first checking which type of class it is (dark-, light- mode) and whether it is relevant in the context of color-modes. Thus, whether it uses any `utilityClasses` modifiers and any `colorNames`.
 * @param className The classname to inspect / analyze
 * @param options.utilityClasses The utilityClasses to consider as relevant in the context of color-mode
 * @param options.colorNames The colorNames to consider as relevant in the context of color-mode
 * @returns Either null when the class was irrelevant or an object containing relevant information when the class is 'important.'
 */
export default function evaluateClassname(
  className: string,
  { utilityClasses, colorNames }: Pick<Options, 'utilityClasses' | 'colorNames'>,
): {
  mode: 'dark' | 'light'
  utility: string
  className: string
  relevantClass: string
} | null {
  if (!className || typeof className !== 'string') return null

  const colorMode = className.includes('dark:') ? 'dark' : 'light'

  // Ignore arbitrary values like "[color:red]".
  // if (token.startsWith('[')) return null

  //* splits classes like "dark:hover:bg-neutral-200" into ['dark', 'hover', 'bg-neutral-200]
  const classNameArguments = className
    .split(':')
    .filter(Boolean)
    .filter((arg) => arg.includes('-')) // strip "non-modifying" arguments like "dark", "hover", "active", "border"

  if (classNameArguments.length === 0) return null

  //* `classNameArguments` array should now only have a length of 1, with the actual class like "border-b-2", "ring-2", "ring-neutral-200", "text-neutral-200"
  //   --> now strip the non-modifying styles

  //* check if last className argument like "border-b-2", "ring-", "ring-neutral-200", "text-neutral-200" is a modifying style: thus uses a relevant prefix ("bg", "ring", ..) and uses a color "-<color>"
  const modifyingStyles = classNameArguments.filter((arg) => {
    const parts = arg.split('-')
    const modifier = parts[0] // e.g. bg, ring, shadow, text, flex, ...

    const isColorModifyingClass = utilityClasses.includes(modifier) // does class start with e.g. "bg-", "ring-", "text-", ...

    const color = parts[1] // e.g. "black", "white", "neutral", "2" [ring-2], ...

    const hasColor = colorNames.includes(color)

    return isColorModifyingClass && hasColor
  })

  //* classname does not modify colors, like ring-2, p-2, border-b-2 --> irreleavnt
  if (modifyingStyles.length === 0) {
    return null
  }

  if (modifyingStyles.length > 1) {
    console.error(`While parsing a classname an unexpected output occured. Class: '${modifyingStyles.join(':')}' was categorized as relevant but has an invalid structure! \nDiscarding class`)
    return null
  }

  //* is the relevant part of the class like bg-neutral-200, ring-neutral-200 and so on based on the pre-defined types of
  const relevantClass = modifyingStyles.join('')
  const utility = relevantClass.split('-')[0]

  // console.log(`Considering '${relevantClass}'`)

  return {
    mode: colorMode,
    utility,
    className,
    relevantClass,
  }
}

/**
 * This function evaluate a given className by first checking which type of class it is (dark-, light- mode) and whether it is relevant in the context of color-modes. Thus, whether it uses any `utilityClasses` modifiers and any `colorNames`.
 * @param className The classname to inspect / analyze
 * @param options.utilityClasses The utilityClasses to consider as relevant in the context of color-mode
 * @param options.colorNames The colorNames to consider as relevant in the context of color-mode
 * @returns Either null when the class was irrelevant or an object containing relevant information when the class is 'important.'
 */
export function evaluateClassnameRelevance(
  { className, owner }: ReturnType<typeof collectClassnames>[number],
  { utilityClasses, colorNames }: Pick<Options, 'utilityClasses' | 'colorNames'>,
): ClassWithOwner | null {
  if (!className || typeof className !== 'string') return null

  const colorMode = className.includes('dark:') ? 'dark' : 'light'

  // Ignore arbitrary values like "[color:red]".
  // if (token.startsWith('[')) return null

  //* splits classes like "dark:hover:bg-neutral-200" into ['dark', 'hover', 'bg-neutral-200]
  const classNameArguments = className
    .split(':')
    .filter(Boolean)
    .filter((arg) => arg.includes('-')) // strip "non-modifying" arguments like "dark", "hover", "active", "border"

  if (classNameArguments.length === 0) return null

  //* `classNameArguments` array should now only have a length of 1, with the actual class like "border-b-2", "ring-2", "ring-neutral-200", "text-neutral-200"
  //   --> now strip the non-modifying styles

  //* check if last className argument like "border-b-2", "ring-", "ring-neutral-200", "text-neutral-200" is a modifying style: thus uses a relevant prefix ("bg", "ring", ..) and uses a color "-<color>"
  const modifyingStyles = classNameArguments.filter((arg) => {
    const parts = arg.split('-')
    const modifier = parts[0] // e.g. bg, ring, shadow, text, flex, ...

    const isColorModifyingClass = utilityClasses.includes(modifier) // does class start with e.g. "bg-", "ring-", "text-", ...

    const color = parts[1] // e.g. "black", "white", "neutral", "2" [ring-2], ...

    const hasColor = colorNames.includes(color)

    return isColorModifyingClass && hasColor
  })

  //* classname does not modify colors, like ring-2, p-2, border-b-2 --> irreleavnt
  if (modifyingStyles.length === 0) {
    return null
  }

  if (modifyingStyles.length > 1) {
    console.error(`While parsing a classname an unexpected output occured. Class: '${modifyingStyles.join(':')}' was categorized as relevant but has an invalid structure! \nDiscarding class`)
    return null
  }

  //* is the relevant part of the class like bg-neutral-200, ring-neutral-200 and so on based on the pre-defined types of
  const relevantClass = modifyingStyles.join('')
  const utility = relevantClass.split('-')[0]

  // console.log(`Considering '${relevantClass}'`)

  return {
    colorMode,
    utility,
    className,
    relevantClass,
    owner,
  }
}
