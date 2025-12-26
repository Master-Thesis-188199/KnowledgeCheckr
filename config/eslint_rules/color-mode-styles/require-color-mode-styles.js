import collectClassnames from './collectClassnames.js';
import createEslintSuggestionFixer from './createEslintSuggestionFixer.js';
import evaluateClassname from './evaluateClassname.js';
const DEBUG_LOGS = false;
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
];
const DEFAULT_OPTIONS = {
    utilityClasses: ['bg', 'text', 'border', 'ring', 'shadow'],
    attributes: ['className', 'class'],
    helpers: ['cn', 'tw'],
    colorNames: defaultColorNames,
};
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
        var _a;
        const sourceCode = context.getSourceCode();
        const { utilityClasses, attributes: attributesToCheck, helpers: helperNames, colorNames } = resolveOptions((_a = context.options) === null || _a === void 0 ? void 0 : _a[0]);
        function checkClassName(attrNode) {
            var _a;
            const attrName = attrNode.name && attrNode.name.name.toString();
            if (!attributesToCheck.includes(attrName))
                return;
            const entries = collectClassnames(attrNode.value, helperNames);
            if (entries.length === 0)
                return;
            const keyMap = new Map(); // key: the utilty type like "text", "bg", "ring"; the value { lightClasses: [], darkClasses: [] }
            for (const { className, owner } of entries) {
                const _parsed = evaluateClassname(className, { utilityClasses, colorNames });
                if (!_parsed)
                    continue;
                const parsed = Object.assign(Object.assign({}, _parsed), { owner });
                if (keyMap.has(_parsed.utility)) {
                    const val = keyMap.get(_parsed.utility);
                    const prop = _parsed.mode === 'light' ? 'lightClasses' : 'darkClasses';
                    val[prop].push(parsed);
                    keyMap.set(parsed.utility, val);
                }
                else {
                    keyMap.set(parsed.utility, { lightClasses: parsed.mode === 'light' ? [parsed] : [], darkClasses: parsed.mode === 'dark' ? [parsed] : [] });
                }
            }
            const nodeMissingClasses = [];
            for (const key of keyMap.keys()) {
                const { lightClasses, darkClasses } = keyMap.get(key);
                if (lightClasses.length === darkClasses.length) {
                    // console.log(`${key} utility classes match light- and dark- mode styles.`)
                    continue;
                }
                if (darkClasses.find((d) => d.className.includes('dark:shadow-neutral-700'))) {
                    // console.log(lightClasses, darkClasses, '-----\n\n')
                }
                const missingColorMode = lightClasses.length > darkClasses.length ? 'dark' : 'light';
                //* Find matching classes
                const superiorMode = lightClasses.length > darkClasses.length ? lightClasses : darkClasses;
                const inferiorMode = lightClasses.length > darkClasses.length ? darkClasses : lightClasses;
                const missingClasses = [];
                // choose the color-mode class array that has the most classes, thus that is not missing any classes.
                // This loop iterates over the superior-class array and would create contrary suggestions for each of the superiorClasses, because there is no check yet to consider existing inferior-classes
                for (const superior of superiorMode) {
                    // -- start: check for eliminating matchin opposite classes from creating suggestions
                    //* Filter out those color-mode classes that match (that exist for both modes)
                    // eliminate classes from both the superiorMode and inferiorMode that are indeed matching, to only keep considering truly missing classes with no opposites.
                    const inSameClassString = inferiorMode.find((inf) => inf.owner.classString === superior.owner.classString);
                    const removeDarkModifier = (input) => input === null || input === void 0 ? void 0 : input.replace('dark:', '');
                    const haveSameModifiers = removeDarkModifier((_a = inSameClassString === null || inSameClassString === void 0 ? void 0 : inSameClassString.className) === null || _a === void 0 ? void 0 : _a.replace(inSameClassString === null || inSameClassString === void 0 ? void 0 : inSameClassString.relevantClass, '')) === removeDarkModifier(superior.className.replace(superior.relevantClass, ''));
                    if (haveSameModifiers && inSameClassString)
                        continue;
                    if (DEBUG_LOGS)
                        console.log(`'${superior.className}' has no matching opposite.`);
                    // -- end: check for eliminating matchin opposite classes from creating suggestions
                    const modifiers = superior.className.replace('dark:', '').replace(superior.relevantClass, ''); // stripping e.g "bg-neutral-200" from "dark:hover:bg-neutral-200" to leave "hover:"
                    const currentColor = superior.relevantClass.split('-').slice(1).join('-'); // "red-200", "neutral-200", "white"
                    let contraryColor;
                    if (currentColor.includes('-')) {
                        const intensity = Number(currentColor
                            .split('-')[1] // [50, 100, 200, 200/80, 800, 900/90] --> remove potential opacity modifiers
                            .split('/')
                            .at(0));
                        let opacity = '';
                        if (currentColor.includes('/')) {
                            opacity = '/' + currentColor.split('/').at(1);
                        }
                        contraryColor = `${currentColor.split('-').at(0)}-${Math.abs(intensity - 900)}${opacity}`;
                    }
                    else {
                        contraryColor = currentColor === 'white' ? 'black' : 'white';
                    }
                    if (DEBUG_LOGS)
                        console.log(`Determined ${missingColorMode.toLocaleLowerCase() === 'dark' && modifiers ? 'dark:' : ''}${modifiers}${superior.utility}-${contraryColor} as missing`);
                    missingClasses.push({
                        utility: superior.utility,
                        mode: missingColorMode,
                        className: `${missingColorMode.toLocaleLowerCase() === 'dark' && modifiers ? 'dark:' : ''}${modifiers}${superior.utility}-${contraryColor}`,
                        owner: superior.owner,
                        relevantClass: `${superior.utility}-${contraryColor}`,
                    });
                }
                nodeMissingClasses.push(...missingClasses);
            }
            if (nodeMissingClasses.length === 0)
                return;
            // Group missing suggestions by the node they should edit
            const missingByOwner = new Map();
            const ownerKey = (owner) => {
                var _a, _b, _c, _d;
                // Prefer range; fall back to loc if needed
                if (owner.kind === 'helper-segment') {
                    return owner.argNode.range ? `helper:${owner.argNode.range[0]}-${owner.argNode.range[1]}` : `helper:${(_a = owner.argNode.loc) === null || _a === void 0 ? void 0 : _a.start.line}:${(_b = owner.argNode.loc) === null || _b === void 0 ? void 0 : _b.start.column}`;
                }
                // simple: attach to the attribute value (or the attribute itself)
                const val = owner.attrValue;
                 
                if (val && 'range' in val && Array.isArray(val.range)) {
                     
                    const r = val.range;
                    return `simple:${r[0]}-${r[1]}`;
                }
                return attrNode.range ? `simple:${attrNode.range[0]}-${attrNode.range[1]}` : `simple:${(_c = attrNode.loc) === null || _c === void 0 ? void 0 : _c.start.line}:${(_d = attrNode.loc) === null || _d === void 0 ? void 0 : _d.start.column}`;
            };
            for (const m of nodeMissingClasses) {
                const k = ownerKey(m.owner);
                const existing = missingByOwner.get(k);
                if (existing)
                    existing.items.push(m);
                else
                    missingByOwner.set(k, { owner: m.owner, items: [m] });
            }
            //* Emit one report per owner
            for (const { owner, items } of missingByOwner.values()) {
                // Decide where to anchor the diagnostic:
                // - helper: anchor to the specific literal in cn(...) arg (the line/segment)
                // - simple: anchor to the attribute itself
                const reportNode = owner.kind === 'helper-segment' ? owner.argNode : attrNode;
                // Optional: nicer message content – summarize utilities & modes
                const utilities = [...new Set(items.map((i) => i.utility))].join(', ');
                const modes = [...new Set(items.map((i) => i.mode))].join(', ');
                context.report({
                    node: reportNode,
                    messageId: (modes.includes('dark') ? 'missingDark' : 'missingLight'),
                    data: {
                        key: utilities,
                        // These two fields are required by your message template; we can fill them with something meaningful:
                        lightStyles: items
                            .filter((i) => i.mode === 'light')
                            .map((i) => `'${i.className}'`)
                            .join(', ') || '—',
                        darkStyles: items
                            .filter((i) => i.mode === 'dark')
                            .map((i) => `'${i.className}'`)
                            .join(', ') || '—',
                    },
                    suggest: [
                        // Add all missing for this owner (single click)
                        {
                            //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
                            desc: `Add ${utilities} classes ${items
                                .slice(0, 3)
                                .map((i) => `'${i.className}'`)
                                .join(', ')}${items.length > 4 ? ', ...' : ''} in ${owner.kind === 'helper-segment' ? 'argument' : 'className'}`,
                            fix: (fixer) => {
                                const classes = items.map((i) => i.className).join(' ');
                                return createEslintSuggestionFixer(attrNode, owner, classes, fixer, sourceCode);
                            },
                        },
                        // One suggestion per missing class
                        ...items.map((missing) => ({
                            //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
                            desc: `Add ${missing.mode}-mode ${missing.className}`,
                            fix: (fixer) => createEslintSuggestionFixer(attrNode, owner, missing.className, fixer, sourceCode),
                        })),
                    ],
                });
            }
        }
        return {
            JSXAttribute: checkClassName,
        };
    },
};
const plugin = {
    rules: {
        'require-color-mode-styles': requireColorModeStylesRule,
    },
};
export default plugin;
/** Takes in the user-options that were passed to the rule from within the eslint.config and adds default values for missing options */
function resolveOptions(user) {
    var _a, _b, _c, _d;
    return {
        utilityClasses: (_a = user === null || user === void 0 ? void 0 : user.utilityClasses) !== null && _a !== void 0 ? _a : DEFAULT_OPTIONS.utilityClasses,
        attributes: (_b = user === null || user === void 0 ? void 0 : user.attributes) !== null && _b !== void 0 ? _b : DEFAULT_OPTIONS.attributes,
        helpers: (_c = user === null || user === void 0 ? void 0 : user.helpers) !== null && _c !== void 0 ? _c : DEFAULT_OPTIONS.helpers,
        colorNames: (_d = user === null || user === void 0 ? void 0 : user.colorNames) !== null && _d !== void 0 ? _d : DEFAULT_OPTIONS.colorNames,
    };
}
