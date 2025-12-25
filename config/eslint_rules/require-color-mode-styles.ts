/* eslint-disable @typescript-eslint/no-explicit-any */
import { TSESLint } from '@typescript-eslint/utils'
type MessageIds = 'missingLight' | 'missingDark'

/**
 * ESLint rule: require-color-mode-styles
 *
 * This rule goes over every JSX element and when an element's attributes matches one of the specified attributes (default: 'class' and 'className') the rule will verify its value.
 *
 * Case 1: An JSX element ** has no ** attribute(s) that is specified in the 'attributes' array (by default: 'class' and 'className'): Will essentially terminate / finish the rule without issusing problems.
 * Case 2: An JSX element ** has ** attribute(s) that are specified in the 'attributes' array (by default: 'class' and 'className'):
 *      | The rule will now evaluate the classes that are assigned to the respective attributes using the `getClassNames` function.
 *      | Then it goes through each classname and evaluates it by callling the `evaluateClassname` function.
 *         The function takes in each individual className and determines the color-mode it targets and whether it modifies / uses any colors, thus determines whether it is relevenat in the context of color-modes.
 *         This means that it first checks the color-mode that is being targetted and essentially checks whether the class uses a matchin utility class ('bg', 'text', ...) that is specified in `utilityClasses`.
 *         Then it checks if these utility classes also use colors to eliminate classes like ("ring-2", "border-b-2") that do not change / use any colors.
 *         In case the class in question satisfied all these conditions an object of type:
 *           {
 *              mode: 'light' | 'dark',
 *              utility: typeof utilityClasses[number],    // ('text', 'bg', 'ring', ...)
 *              className: string,                        // the original class that was passed to the function, e.g. "dark:hover:bg-neutral-200"
 *              relevantClass: string                     // the essential part of the class, e.g. "bg-neutral-200", "ring-neutral-200"
 *           }
 *      | After going over all matchin attributes (e.g. 'className') and evaluating each class, to filter out irrelevant classes, the remaining color related classes are compared.
 *      | Case 1: When the amount of color related light- and dark- mode classes match then there are both light- mode values and dark-mode values defined for the given attribute.
 *      | Case 2: When the amount of color related light- and dark- mode classes differ then an issue will be created for the given attribute.
 *
 */

const defaultColorNames = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'black',
  'white',
  'inherit',
  'current',
  'transparent',
]

type Options = {
  utilityClasses: Array<string>
  attributes: Array<string>
  helpers: Array<string>
  colorNames: Array<string>
}

/**
 * This function evaluate a given className by first checking which type of class it is (dark-, light- mode) and whether it is relevant in the context of color-modes. Thus, whether it uses any `utilityClasses` modifiers and any `colorNames`.
 * @param className The classname to inspect / analyze
 * @param options.utilityClasses The utilityClasses to consider as relevant in the context of color-mode
 * @param options.colorNames The colorNames to consider as relevant in the context of color-mode
 * @returns Either null when the class was irrelevant or an object containing relevant information when the class is 'important.'
 */
function evaluateClassname(className: string, { utilityClasses, colorNames }: Pick<Options, 'utilityClasses' | 'colorNames'>) {
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
  const utility = relevantClass.split('-').at(0)

  // console.log(`Considering '${relevantClass}'`)

  return {
    mode: colorMode,
    utility,
    className,
    relevantClass,
  }
}

/**
 * Retrieve classnames as an array from all element-nodes.
 * Supports:
 *  - className="..."
 *  - className={'...'}
 *  - className={`...`} (no interpolations)
 *  - className={cn("...", "...")}
 *  - className={tw("...", "...")}
 */
function getClassNames(attrValue: any, { helpers: helperNames }: Pick<Options, 'helpers'>) {
  if (!attrValue) return null

  // className="foo bar"
  if (attrValue.type === 'Literal' && typeof attrValue.value === 'string') {
    return attrValue.value
  }

  if (attrValue.type === 'JSXExpressionContainer') {
    const expr = attrValue.expression

    // className={'foo bar'}
    if (expr.type === 'Literal' && typeof expr.value === 'string') {
      return expr.value
    }

    // className={`foo bar`} (no interpolations)
    if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
      //@ts-ignore
      return expr.quasis.map((q) => q.value.cooked || '').join('')
    }

    // className={cn("foo bar", "baz")} or className={tw("foo", "bar")}
    if (expr.type === 'CallExpression') {
      if (expr.callee.type === 'Identifier' && helperNames.includes(expr.callee.name)) {
        const pieces = []

        for (const arg of expr.arguments) {
          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            pieces.push(arg.value)
          } else if (arg.type === 'TemplateLiteral' && arg.expressions.length === 0) {
            //@ts-ignore
            pieces.push(arg.quasis.map((q) => q.value.cooked || '').join(''))
          } else if (arg.type === 'LogicalExpression' && arg.right.type === 'Literal') {
            pieces.push(arg.right.value)
          } else {
            // Dynamic argument – we can't safely know full class list.
            // return null
          }
        }

        // console.log(`collected ${expr.callee.name} classes: \n${pieces.map((c) => `'${c}'`).join(' ')}`)

        if (pieces.length > 0) {
          return pieces.join(' ')
        }
      }
    }
  }

  return null
}

const requireColorModeStylesRule: TSESLint.RuleModule<MessageIds, Options[]> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require Tailwind color utilities to define both light and dark mode variants for the same property/variant chain.',
      // recommended: false,
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          // Which utility prefixes count as 'color' utilities.
          utilityClasses: {
            type: 'array',
            items: { type: 'string' },
          },
          // Which JSX attribute names to inspect (e.g. className, class)
          attributes: {
            type: 'array',
            items: { type: 'string' },
          },
          // Helper function names like `cn` and `tw`
          helpers: {
            type: 'array',
            items: { type: 'string' },
          },
          // Allowed color names (first token after the prefix).
          // Example: "neutral" in "bg-neutral-200".
          colorNames: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingDark: "Element is missing dark-mode style(s) for '{{key}}' ([{{lightStyles}}] vs. [{{darkStyles}}]).",
      missingLight: "Element is missing light-mode color style(s) for '{{key}}' ([{{lightStyles}}] vs. [{{darkStyles}}]).",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    const options = (context.options && context.options[0]) || ({} as Options)

    if (!options.utilityClasses) options.utilityClasses = ['bg', 'text', 'border', 'ring', 'shadow']
    if (!options.attributes) options.attributes = ['className', 'class']
    if (!options.helpers) options.helpers = ['cn', 'tw']
    if (!options.colorNames) options.colorNames = defaultColorNames

    const { utilityClasses, attributes: attributesToCheck, helpers: helperNames, colorNames } = options

    /**
     * Parse a token and see if it's a color-related utility.
     *
     * Returns:
     *   null if not color-related.
     *   { key, mode, utility } otherwise.
     *
     * - key: "<variants...>:<prefix>" (without `dark:`)
     *   e.g. "bg", "hover:bg", "md:hover:bg"
     * - mode: "light" | "dark"
     * - utility: the full tailwind utility, e.g. "bg-neutral-200"
     */

    function checkClassName(attrNode: any) {
      const attrName = attrNode.name && attrNode.name.name
      if (!attributesToCheck.includes(attrName)) return

      const classString = getClassNames(attrNode.value, { helpers: helperNames })
      if (!classString) return

      const classNames = classString
        .split(/\s+/)
        .map((t: string) => t.trim())
        .filter(Boolean)

      // console.log('considering classes: \n', tokens.map((t) => `'${t}'`).join(', '))

      /**
       * key -> { lightUtilities: string[], darkUtilities: string[] }
       */
      const keyMap = new Map() // key: the utilty type like "text", "bg", "ring"; the value { lightClasses: [], darkClasses: [] }

      for (const class_name of classNames) {
        const parsed = evaluateClassname(class_name, { utilityClasses, colorNames })
        if (!parsed) continue

        if (keyMap.has(parsed.utility)) {
          const val = keyMap.get(parsed.utility)
          const prop = parsed.mode === 'light' ? 'lightClasses' : 'darkClasses'

          val[prop].push(parsed)
          keyMap.set(parsed.utility, val)
        } else {
          keyMap.set(parsed.utility, { lightClasses: parsed.mode === 'light' ? [parsed] : [], darkClasses: parsed.mode === 'dark' ? [parsed] : [] })
        }

        // console.log('Parsed Result: ', parsed)
      }

      for (const key of keyMap.keys()) {
        const { lightClasses, darkClasses } = keyMap.get(key)

        if (lightClasses.length === darkClasses.length) {
          // console.log(`${key} utility classes match light- and dark- mode styles.`)
          continue
        }

        const missingColorMode = lightClasses.length > darkClasses.length ? 'Dark' : 'Light'

        const missingClassesSuggestions: any[] = []
        // choose the color-mode class array that has the most classes, thus that is not missing any classes.
        for (const colorModeClass of lightClasses.length > darkClasses.length ? lightClasses : darkClasses) {
          const modifiers = colorModeClass.className.replace('dark:', '').replace(colorModeClass.relevantClass, '') // stripping e.g "bg-neutral-200" from "dark:hover:bg-neutral-200" to leave "hover:"

          const currentColor = colorModeClass.relevantClass.split('-').slice(1).join('-') // "red-200", "neutral-200", "white"
          console.log(`creating suggestion for ${currentColor}`)
          let contraryColor

          if (currentColor.includes('-')) {
            const intensity = Number(
              currentColor
                .split('-')
                .at(1) // [50, 100, 200, 200/80, 800, 900/90] --> remove potential opacity modifiers
                .split('/')
                .at(0), // [50, 100, 200, 300, 400, 500, ..., 900]
            )

            let opacity = ''
            if (currentColor.includes('/')) {
              opacity = '/' + currentColor.split('/').at(1)
            }

            contraryColor = `${currentColor.split('-').at(0)}-${Math.abs(intensity - 900)}${opacity}`
          } else {
            contraryColor = currentColor === 'white' ? 'black' : 'white'
          }

          missingClassesSuggestions.push(`${missingColorMode.toLocaleLowerCase() === 'dark' && modifiers ? 'dark:' : ''}${modifiers}${colorModeClass.utility}-${contraryColor}`)
        }

        context.report({
          node: attrNode,
          messageId: `missing${missingColorMode}`,
          data: {
            key,
            lightStyles: lightClasses.map((l: any) => `'${l.className}'`).join(', '),
            darkStyles: darkClasses.map((d: any) => `'${d.className}'`).join(', '),
          },
          suggest: [
            {
              //@ts-ignore
              desc: `Add missing ${missingColorMode.toLowerCase()}-mode classes`,
              fix: function (fixer: any) {
                return buildAddClassFix(attrNode, classString, missingClassesSuggestions.join(' '), fixer)
              },
            },
            //@ts-ignore
            ...missingClassesSuggestions.map((suggestedClass) => ({
              desc: `Add missing ${missingColorMode.toLowerCase()}-mode class ${suggestedClass}`,
              fix: function (fixer: any) {
                return buildAddClassFix(attrNode, classString, suggestedClass, fixer)
              },
            })),
          ],
        })
      }
    }

    function buildAddClassFix(attrNode: any, classString: string, suggestedClass: any, fixer: any) {
      const value = attrNode.value
      if (!value) return null

      const existingClasses = (classString || '').trim()
      const newClassString = (existingClasses + ' ' + suggestedClass).trim()

      // <div className="foo bar" />
      if (value.type === 'Literal' && typeof value.value === 'string') {
        // Rebuild as a normal double-quoted string literal
        return fixer.replaceText(value, `"${newClassString}"`)
      }

      if (value.type === 'JSXExpressionContainer') {
        const expr = value.expression

        // className={'foo bar'}
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          return fixer.replaceText(expr, `"${newClassString}"`)
        }

        // className={`foo bar`}
        if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
          return fixer.replaceText(expr, '`' + newClassString + '`')
        }

        // className={cn(...)} or className={tw(...)}
        if (expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && helperNames.includes(expr.callee.name)) {
          const exprText = sourceCode.getText(expr)

          // Naive but effective: insert `, "suggestedClass"` before the last ')'
          const lastParenIndex = exprText.lastIndexOf(')')

          if (lastParenIndex === -1) {
            return null
          }

          const before = exprText.slice(0, lastParenIndex)
          const after = exprText.slice(lastParenIndex)
          // Trim end to check for existing comma
          const trimmedBefore = before.replace(/\s+$/, '')

          // Does before already end with a comma?
          const hasTrailingComma = trimmedBefore.endsWith(',')

          const insertion = (hasTrailingComma ? ' ' : expr.arguments.length > 0 ? ', ' : '') + `"${suggestedClass}"`

          const newExprText = before + insertion + after

          return fixer.replaceText(expr, newExprText)
        }
      }

      return null
    }

    return {
      JSXAttribute: checkClassName,
    }
  },
}

const plugin = {
  rules: {
    'require-color-mode-styles': requireColorModeStylesRule,
  },
}

export default plugin
