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
/**
 * This function evaluate a given className by first checking which type of class it is (dark-, light- mode) and whether it is relevant in the context of color-modes. Thus, whether it uses any `utilityClasses` modifiers and any `colorNames`.
 * @param className The classname to inspect / analyze
 * @param options.utilityClasses The utilityClasses to consider as relevant in the context of color-mode
 * @param options.colorNames The colorNames to consider as relevant in the context of color-mode
 * @returns Either null when the class was irrelevant or an object containing relevant information when the class is 'important.'
 */
function evaluateClassname(className, { utilityClasses, colorNames }) {
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
 * Retrieve classnames as an array from all element-nodes.
 * Supports:
 *  - className="..."
 *  - className={'...'}
 *  - className={`...`} (no interpolations)
 *  - className={cn("...", "...")}
 *  - className={tw("...", "...")}
 */
function getClassNames(attrValue, { helpers: helperNames }) {
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
/**
 * Collect *per-class* entries with ownership information.
 *
 * For static className:
 *   - returns one OwnerSimple with all classes split.
 *
 * For helper calls (cn/tw):
 *   - returns one OwnerHelperSegment per literal/template/logical-right-literal argument
 *   - each segment has its own classString, which we split into classNames.
 */
function getClassEntries(attrValue, helperNames) {
  const entries = []
  if (!attrValue) return entries
  // className="foo bar"
  if (attrValue.type === 'Literal' && typeof attrValue.value === 'string') {
    const classString = attrValue.value
    const classNames = classString
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
    const owner = {
      kind: 'simple',
      attrValue,
      classString,
    }
    for (const cls of classNames) {
      entries.push({ className: cls, owner })
    }
    return entries
  }
  if (attrValue.type === 'JSXExpressionContainer') {
    const expr = attrValue.expression
    // className={'foo bar'}
    if (expr.type === 'Literal' && typeof expr.value === 'string') {
      const classString = expr.value
      const classNames = classString
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
      const owner = {
        kind: 'simple',
        attrValue,
        classString,
      }
      for (const cls of classNames) {
        entries.push({ className: cls, owner })
      }
      return entries
    }
    // className={`foo bar`} (no interpolations)
    if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
      const classString = expr.quasis.map((q) => q.value.cooked || '').join('')
      const classNames = classString
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
      const owner = {
        kind: 'simple',
        attrValue,
        classString,
      }
      for (const cls of classNames) {
        entries.push({ className: cls, owner })
      }
      return entries
    }
    // className={cn("...", "...")} or className={tw("...", "...")}
    if (expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && helperNames.includes(expr.callee.name)) {
      const callExpression = expr
      callExpression.arguments.forEach((arg, index) => {
        // argument: "foo bar"
        if (arg.type === 'Literal' && typeof arg.value === 'string') {
          const classString = arg.value
          const classNames = classString
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean)
          const owner = {
            kind: 'helper-segment',
            callExpression,
            argNode: arg,
            classString,
          }
          for (const cls of classNames) {
            entries.push({ className: cls, owner })
          }
          return
        }
        // argument: `foo bar`
        if (arg.type === 'TemplateLiteral' && arg.expressions.length === 0) {
          const classString = arg.quasis.map((q) => q.value.cooked || '').join('')
          const classNames = classString
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean)
          const owner = {
            kind: 'helper-segment',
            callExpression,
            argNode: arg,
            classString,
          }
          for (const cls of classNames) {
            entries.push({ className: cls, owner })
          }
          return
        }
        // argument: cond && "foo bar"
        if (arg.type === 'LogicalExpression' && arg.right.type === 'Literal' && typeof arg.right.value === 'string') {
          const literal = arg.right
          const classString = literal.value
          const classNames = classString
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean)
          const owner = {
            kind: 'helper-segment',
            callExpression,
            argNode: literal,
            classString,
          }
          for (const cls of classNames) {
            entries.push({ className: cls, owner })
          }
          return
        }
        // other arg shapes are ignored
      })
      return entries
    }
  }
  return entries
}
function makeSuggestions(args) {
  // IMPORTANT: copy into locals that are scoped to THIS function call
  const { attrNode, key, missingColorMode, sourceCode, fixerBuilder } = args
  // Deep-ish copy so we don't accidentally share references (owners are objects)
  const localMissing = args.thisUtilityMissing.map((x) => ({
    utility: x.utility,
    suggestedClass: x.className,
    owner: x.owner,
  }))
  const modeLower = missingColorMode.toLowerCase()
  const utilities = [...new Set(localMissing.map((s) => s.utility))]
  const utilityPart = utilities.length === 1 ? `'${utilities[0]}'` : utilities.map((u) => `'${u}'`).join(', ')
  const addAll = {
    // @ts-expect-error `desc` is supported by ESLint suggestions
    desc: `Add all missing ${modeLower}-mode ${utilities.length === 1 ? 'class' : 'classes'} for ${utilityPart}`,
    fix(fixer) {
      var _a, _b, _c, _d
      const ownerGroups = new Map()
      for (const { suggestedClass, owner } of localMissing) {
        const keyForOwner =
          owner.kind === 'simple'
            ? `simple:${(_b = (_a = attrNode.range) === null || _a === void 0 ? void 0 : _a.join('-')) !== null && _b !== void 0 ? _b : 'no-range'}`
            : `helper:${(_d = (_c = owner.argNode.range) === null || _c === void 0 ? void 0 : _c.join('-')) !== null && _d !== void 0 ? _d : 'no-range'}`
        const existing = ownerGroups.get(keyForOwner)
        if (existing) existing.suggestedClasses.push(suggestedClass)
        else ownerGroups.set(keyForOwner, { owner, suggestedClasses: [suggestedClass] })
      }
      const fixes = []
      for (const { owner, suggestedClasses } of ownerGroups.values()) {
        const fix = fixerBuilder(attrNode, owner, suggestedClasses.join(' '), fixer, sourceCode)
        if (Array.isArray(fix)) fixes.push(...fix)
        else if (fix) fixes.push(fix)
      }
      return fixes
    },
  }
  const perClass = localMissing.map(({ suggestedClass, owner }) => {
    // capture each item in its own local binding
    const sc = suggestedClass
    const ow = owner
    const s = {
      // @ts-expect-error `desc` is supported by ESLint suggestions
      desc: `Add missing ${modeLower}-mode class ${sc}`,
      fix(fixer) {
        // console.log(
        //   'FIX RUN utility=',
        //   key,
        //   'missing=',
        //   localMissing.map((x) => x.suggestedClass),
        // )
        return fixerBuilder(attrNode, ow, sc, fixer, sourceCode)
      },
    }
    return s
  })
  return [addAll, ...perClass]
}
function buildAddClassFix(attrNode, owner, suggestedClasses, fixer, sourceCode) {
  const value = attrNode.value
  if (!value) return null
  const appendTo = (existing) => (existing.trim() + ' ' + suggestedClasses).trim()
  // SIMPLE: className="..." / {'...'} / `...`
  if (owner.kind === 'simple') {
    const target = owner.attrValue
    const newClassString = appendTo(owner.classString)
    if (target.type === 'Literal' && typeof target.value === 'string') {
      // preserve quote style
      const raw = sourceCode.getText(target) // e.g. "..." or '...'
      const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
      const newText = `${quote}${newClassString}${quote}`
      return fixer.replaceText(target, newText)
    }
    if (target.type === 'JSXExpressionContainer') {
      const expr = target.expression
      if (expr.type === 'Literal' && typeof expr.value === 'string') {
        const raw = sourceCode.getText(expr)
        const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
        const newText = `${quote}${newClassString}${quote}`
        return fixer.replaceText(expr, newText)
      }
      if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
        return fixer.replaceText(expr, '`' + newClassString + '`')
      }
    }
    return null
  }
  // HELPER SEGMENT: a specific cn/tw argument literal/template
  if (owner.kind === 'helper-segment') {
    const argNode = owner.argNode
    // Literal argument (including logical-expression right side we stored)
    if (argNode.type === 'Literal' && typeof argNode.value === 'string') {
      const newClassString = appendTo(owner.classString)
      const raw = sourceCode.getText(argNode) // e.g. "..." or '...'
      const quote = raw[0] === "'" || raw[0] === '"' ? raw[0] : '"'
      const newText = `${quote}${newClassString}${quote}`
      return fixer.replaceText(argNode, newText)
    }
    // Template literal argument with no expressions
    if (argNode.type === 'TemplateLiteral' && argNode.expressions.length === 0) {
      const newClassString = appendTo(owner.classString)
      return fixer.replaceText(argNode, '`' + newClassString + '`')
    }
  }
  return null
}
const requireColorModeStylesRule = {
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
    const options = (context.options && context.options[0]) || {}
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
    function checkClassName(attrNode) {
      var _a
      const attrName = attrNode.name && attrNode.name.name.toString()
      if (!attributesToCheck.includes(attrName)) return
      const entries = getClassEntries(attrNode.value, helperNames)
      if (entries.length === 0) return
      // const classNames = classString
      //   .split(/\s+/)
      //   .map((t: string) => t.trim())
      //   .filter(Boolean)
      // console.log('considering classes: \n', tokens.map((t) => `'${t}'`).join(', '))
      /**
       * key -> { lightUtilities: string[], darkUtilities: string[] }
       */
      const keyMap = new Map() // key: the utilty type like "text", "bg", "ring"; the value { lightClasses: [], darkClasses: [] }
      for (const { className, owner } of entries) {
        const _parsed = evaluateClassname(className, { utilityClasses, colorNames })
        if (!_parsed) continue
        const parsed = Object.assign(Object.assign({}, _parsed), { owner })
        if (keyMap.has(_parsed.utility)) {
          const val = keyMap.get(_parsed.utility)
          const prop = _parsed.mode === 'light' ? 'lightClasses' : 'darkClasses'
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
        if (darkClasses.find((d) => d.className.includes('dark:shadow-neutral-700'))) {
          // console.log(lightClasses, darkClasses, '-----\n\n')
        }
        const missingColorMode = lightClasses.length > darkClasses.length ? 'Dark' : 'Light'
        //* Find matching classes
        const superiorMode = lightClasses.length > darkClasses.length ? lightClasses : darkClasses
        const inferiorMode = lightClasses.length > darkClasses.length ? darkClasses : lightClasses
        const missingClasses = []
        // choose the color-mode class array that has the most classes, thus that is not missing any classes.
        // This loop iterates over the superior-class array and would create contrary suggestions for each of the superiorClasses, because there is no check yet to consider existing inferior-classes
        for (const superior of superiorMode) {
          // -- start: check for eliminating matchin opposite classes from creating suggestions
          //* Filter out those color-mode classes that match (that exist for both modes)
          // eliminate classes from both the superiorMode and inferiorMode that are indeed matching, to only keep considering truly missing classes with no opposites.
          const inSameClassString = inferiorMode.find((inf) => inf.owner.classString === superior.owner.classString)
          const removeDarkModifier = (input) => (input === null || input === void 0 ? void 0 : input.replace('dark:', ''))
          const haveSameModifiers =
            removeDarkModifier(
              (_a = inSameClassString === null || inSameClassString === void 0 ? void 0 : inSameClassString.className) === null || _a === void 0
                ? void 0
                : _a.replace(inSameClassString === null || inSameClassString === void 0 ? void 0 : inSameClassString.relevantClass, ''),
            ) === removeDarkModifier(superior.className.replace(superior.relevantClass, ''))
          if (haveSameModifiers && inSameClassString) continue
          console.log(`'${superior.className}' has no matching opposite.`)
          // -- end: check for eliminating matchin opposite classes from creating suggestions
          const modifiers = superior.className.replace('dark:', '').replace(superior.relevantClass, '') // stripping e.g "bg-neutral-200" from "dark:hover:bg-neutral-200" to leave "hover:"
          const currentColor = superior.relevantClass.split('-').slice(1).join('-') // "red-200", "neutral-200", "white"
          let contraryColor
          if (currentColor.includes('-')) {
            const intensity = Number(
              currentColor
                .split('-')[1] // [50, 100, 200, 200/80, 800, 900/90] --> remove potential opacity modifiers
                .split('/')
                .at(0),
            )
            let opacity = ''
            if (currentColor.includes('/')) {
              opacity = '/' + currentColor.split('/').at(1)
            }
            contraryColor = `${currentColor.split('-').at(0)}-${Math.abs(intensity - 900)}${opacity}`
          } else {
            contraryColor = currentColor === 'white' ? 'black' : 'white'
          }
          console.log(`Determined ${missingColorMode.toLocaleLowerCase() === 'dark' && modifiers ? 'dark:' : ''}${modifiers}${superior.utility}-${contraryColor} as missing`)
          missingClasses.push({
            utility: superior.utility,
            mode: missingColorMode.toLowerCase(),
            className: `${missingColorMode.toLocaleLowerCase() === 'dark' && modifiers ? 'dark:' : ''}${modifiers}${superior.utility}-${contraryColor}`,
            owner: superior.owner,
            relevantClass: `${superior.utility}-${contraryColor}`,
          })
        }
        console.log('Missing: \n', missingClasses)
        context.report({
          node: attrNode,
          messageId: `missing${missingColorMode}`,
          data: {
            key,
            lightStyles: lightClasses.map((l) => `'${l.className}'`).join(', '),
            darkStyles: darkClasses.map((d) => `'${d.className}'`).join(', '),
          },
          suggest: [
            missingClasses.map((missing) => ({
              //@ts-expect-error
              desc: `Add ${missing.mode}-mode ${missing.className}`,
              fix: (fixer) => {
                return buildAddClassFix(attrNode, missing.owner, missing.className, fixer, sourceCode)
              },
            }))[0],
          ],
        })
      }
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
