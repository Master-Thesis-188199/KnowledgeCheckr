import collectClassnames from './collectClassnames.js';
import createEslintSuggestionFixer from './createEslintSuggestionFixer.js';
import { evaluateClassnameRelevance } from './evaluateClassname.js';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
 
function log(...message) {
    if (DEBUG_LOGS)
        console.log(...message);
}
const DEFAULT_OPTIONS = {
    utilityClasses: ['bg', 'text', 'border', 'ring', 'shadow'],
    attributes: ['className', 'class'],
    helpers: ['cn', 'tw'],
    colorNames: defaultColorNames,
};
export const requireColorModeStylesRule = {
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
            missing_dark: 'Element is missing dark-mode style(s) for {{key}} ([{{missing}}]).',
            missing_light: 'Element is missing light-mode color style(s) for {{key}} ([{{missing}}]).',
            missing_both: 'Element is missing light and dark color style(s) for {{key}} ([{{missing}}]).',
        },
    },
    create(context) {
        var _a;
        const { utilityClasses, attributes: attributesToCheck, helpers: helperNames, colorNames } = resolveOptions((_a = context.options) === null || _a === void 0 ? void 0 : _a[0]);
        /**
         * Returns either the filename and the position of the partial classname for utility functions like `cn` or the full classname for static className properties.
         */
        const getClassOrigin = (owner) => { var _a, _b; return owner.kind === 'helper-segment' ? `at ${context.filename.split('/').at(-1)} ${(_a = owner.argNode.loc) === null || _a === void 0 ? void 0 : _a.start.line}:${(_b = owner.argNode.loc) === null || _b === void 0 ? void 0 : _b.start.column}` : `'${owner.classString}'`; };
        function checkClassName(attrNode) {
            const attrName = attrNode.name && attrNode.name.name.toString();
            if (!attributesToCheck.includes(attrName))
                return;
            const colorClassEntries = collectClassnames(attrNode.value, helperNames);
            if (colorClassEntries.length === 0)
                return;
            // holds only color-mode related classes
            const classEntries = [];
            // evaluate class -> strip / remove the ones that are irrelevant for this rule
            for (const entry of colorClassEntries) {
                const result = evaluateClassnameRelevance(entry, { utilityClasses, colorNames });
                // irrelevant class
                if (result === null)
                    continue;
                classEntries.push(result);
            }
            // map missing classes by owner first, then by utility to prevent finding matching classes in different arguments of utility functions like cn
            // -----
            const classEntriesByOwner = groupClassesByOwner(classEntries, getClassOrigin);
            Array.from(classEntriesByOwner.keys()).forEach((origin) => {
                if (DEBUG_LOGS) {
                    // log(
                    //   'Found classes',
                    //   origin,
                    //   classEntriesByOwner.get(origin)!.map((entry) => entry.className),
                    // )
                }
            });
            const missingClassesByOwner = new Map();
            // Iterate over each class per-owner, identify missing classes and create report
            for (const [position, classes] of classEntriesByOwner.entries()) {
                log(`Scanning for missing classes ${position.trim()}`);
                const unmatchedClasses = eliminateMatchingClasses(classes);
                const missingClasses = generateSuggestedClasses(unmatchedClasses);
                const { dark, light } = seperateColorModeClasses(missingClasses);
                // prettier-ignore
                if (dark.length > 0)
                    log(position.replace('at', '').trim(), ' is missing these dark-mode classes', dark.map((d) => d.className));
                // prettier-ignore
                if (light.length > 0)
                    log(position.replace('at', '').trim(), ' is missing these light-mode classes', light.map((d) => d.className));
                log(`Done checking ${position.replace('at', '').trim()}\n\n`);
                missingClassesByOwner.set(position, missingClasses);
                if (missingClasses.length === 0)
                    continue;
                log(`Generating report for ${missingClasses.length} missing classes.`);
                // all the classes in the loop have the same owner
                const owner = classes[0].owner;
                const reportNode = owner.kind === 'helper-segment' ? owner.argNode : attrNode;
                createReport(context, attrNode, reportNode, owner, missingClasses);
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
    var _a, _b, _c, _d, _e;
    return {
        utilityClasses: (_a = user === null || user === void 0 ? void 0 : user.utilityClasses) !== null && _a !== void 0 ? _a : DEFAULT_OPTIONS.utilityClasses,
        attributes: (_b = user === null || user === void 0 ? void 0 : user.attributes) !== null && _b !== void 0 ? _b : DEFAULT_OPTIONS.attributes,
        helpers: (_c = user === null || user === void 0 ? void 0 : user.helpers) !== null && _c !== void 0 ? _c : DEFAULT_OPTIONS.helpers,
        colorNames: (_e = (_d = user === null || user === void 0 ? void 0 : user.colorNames) === null || _d === void 0 ? void 0 : _d.concat(DEFAULT_OPTIONS.colorNames)) !== null && _e !== void 0 ? _e : DEFAULT_OPTIONS.colorNames,
    };
}
/**
 * This function takes in the collected classnames from a JSX.attribute (like className, class) and groups them by their owner.
 * This means that className arguments of utility functions like `cn` are separated by their 'argument-position' (owner).
 *
 * By grouping the gathered classNames by their owner resolves the issue of comparing classes from different (cn) arguments with each other.
 *
 * @param classEntries The collected classnames for a given attribute
 * @param getClassOrigin The function that determines the unique position / location of classNames
 * @returns
 */
function groupClassesByOwner(classEntries, getClassOrigin) {
    const classEntriesByOwner = new Map();
    classEntries.forEach((e) => {
        if (classEntriesByOwner.has(getClassOrigin(e.owner))) {
            const entries = classEntriesByOwner.get(getClassOrigin(e.owner));
            entries.push(e);
            classEntriesByOwner.set(getClassOrigin(e.owner), entries);
        }
        else {
            classEntriesByOwner.set(getClassOrigin(e.owner), [e]);
        }
    });
    return classEntriesByOwner;
}
/**
 * This utility funtion takes in an existing class that has been parsed and generates a class suggestion for the opposite color-mode.
 * @param targetMode The opposite color-mode for which the contrary class should be generated.
 * @param class The existing (evaluated) class.
 * @returns The suggested / missing class based on the existing one from the other color-mode.
 */
function generateMissingClass(_a) {
    var { className, relevantClass, utility, colorMode } = _a, rest = __rest(_a, ["className", "relevantClass", "utility", "colorMode"]);
    const targetMode = colorMode === 'dark' ? 'light' : 'dark';
    const modifiers = className.replace('dark:', '').replace(relevantClass, ''); // stripping e.g "bg-neutral-200" from "dark:hover:bg-neutral-200" to leave "hover:"
    let contraryColor;
    const [, ...colorSegments] = relevantClass.split('-').filter(Boolean);
    const evaluateSegment = (segment) => {
        const num = Number(segment.split('/')[0]);
        if (!isNaN(num))
            return 'number';
        if (segment.startsWith('[') && segment.endsWith(']'))
            return 'arbitrary';
        return 'name';
    };
    const parseColor = () => {
        if (colorSegments.length === 1 && evaluateSegment(colorSegments[0]) === 'arbitrary')
            return { type: 'arbitrary', value: colorSegments[0] };
        // regular tailwind class
        if (colorSegments.length === 2 && evaluateSegment(colorSegments[0]) === 'name' && evaluateSegment(colorSegments[1]) === 'number') {
            const intensity = colorSegments[1].split('/')[0];
            const opacity = colorSegments[1].includes('/') ? `/${colorSegments[1].split('/')[1]}` : '';
            return { type: 'tailwind', name: colorSegments[0], intensity: parseInt(intensity), opacity };
        }
        // variable-names
        if (colorSegments.every((segment) => evaluateSegment(segment) === 'name')) {
            return { type: 'variable', names: colorSegments };
        }
        throw new Error(`Unable to parse color: '${colorSegments.join('-')}'`);
    };
    const color = parseColor();
    if (color.type === 'arbitrary') {
        // re-use the same arbitrary value
        contraryColor = color.value;
    }
    else if (color.type === 'variable') {
        // black or white --> can be inverted
        if (color.names.length === 1 && color.names[0].toLowerCase() === 'white') {
            contraryColor = 'black';
        }
        else if (color.names.length === 1 && color.names[0].toLowerCase() === 'black') {
            contraryColor = 'white';
        }
        else {
            // re-use the variables
            contraryColor = color.names.join('-');
        }
    }
    else {
        // tailwind-colors
        contraryColor = `${color.name}-${Math.abs(color.intensity - 900)}${color.opacity}`;
    }
    const colorModePrefix = targetMode === 'dark' ? 'dark:' : '';
    const suggestedClass = `${colorModePrefix}${modifiers}${utility}-${contraryColor}`;
    const relevantSuggestedClass = `${utility}-${contraryColor}`;
    return Object.assign({ colorMode: targetMode, className: suggestedClass, relevantClass: relevantSuggestedClass, utility }, rest);
}
/**
 * This function takes in all the classes for from a given owner (e.g. argument of cn) and determines which classes do not have opposite classes.
 * This leaves the classes for which opposite / contrary classes for the other color-mode are to be generated / suggested.
 *
 * (identify classes that have no opposite matches, by eliminating those with opposite classes (same modifiers and same utility))
 * @param classes The classes within a given `cn` argument of simply the attribute it self when the classess originate from a static className attribute.
 * @returns An array of the classes that have no opposite-class for which suggestions should be made.
 */
function eliminateMatchingClasses(classes) {
    // note just comaring lengths could cause problems (dark:text-neutral-200 dark:hover:text-neutral-200 text-neutral-300 active:text-neutral-200)
    const missing = [];
    for (const _class of classes) {
        if (missing.includes(_class))
            continue;
        const otherClasses = classes.filter((other) => other.className !== _class.className);
        const match = otherClasses.find((other) => {
            if (_class.utility !== other.utility)
                return false;
            const modifiersA = _class.className.replace('dark:', '').replace(_class.relevantClass, '');
            const modifiersB = other.className.replace('dark:', '').replace(other.relevantClass, '');
            if (modifiersA !== modifiersB)
                return false;
            return true;
        });
        if (match) {
            // log(`[Verose]: Found opposite class for ${_class.className} --> ${match.className}`)
            continue;
        }
        missing.push(_class);
    }
    return missing;
}
function seperateColorModeClasses(classes) {
    const dark = [];
    const light = [];
    classes.forEach((cl) => (cl.className.includes('dark:') ? dark.push(cl) : light.push(cl)));
    return { dark, light };
}
function generateSuggestedClasses(classes) {
    return classes.map((_class) => generateMissingClass(_class));
}
function createReport(context, originNode, reportNode, owner, suggestedClasses) {
    const sourceCode = context.getSourceCode();
    const missingModes = [...new Set(suggestedClasses.map((s) => s.colorMode))];
    const messageId = missingModes.length > 1 ? 'missing_both' : `missing_${missingModes[0]}`;
    const missingUtilityTypes = [...new Set(suggestedClasses.map((i) => i.utility))].join(', ');
    const addAllSuggestion = {
        desc: `Add all missing classes for ${missingUtilityTypes}`,
        fix: (fixer) => {
            const classes = suggestedClasses.map((i) => i.className).join(' ');
            return createEslintSuggestionFixer(originNode, owner, classes, fixer, sourceCode);
        },
    };
    context.report({
        node: reportNode,
        messageId,
        data: {
            key: missingUtilityTypes,
            missing: suggestedClasses.map((suggested) => `'${suggested.className}'`).join(', '),
        },
        //@ts-expect-error suggest-type requires `messageId`s, but `messageId` and `desc` cannot be used at the same time; and `desc` is more flexible.
        suggest: [
            // Add all missing for this owner when there are multiple missing classes
            ...(suggestedClasses.length > 1 ? [addAllSuggestion] : []),
            // One suggestion per missing class
            ...suggestedClasses.map((missing) => ({
                desc: `Add ${missing.colorMode}-mode ${missing.className}`,
                fix: (fixer) => createEslintSuggestionFixer(originNode, owner, missing.className, fixer, sourceCode),
            })),
        ],
    });
}
