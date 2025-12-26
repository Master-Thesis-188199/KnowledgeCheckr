import collectClassnames from './collectClassnames.js';
import createEslintSuggestionFixer from './createEslintSuggestionFixer.js';
import evaluateClassname from './evaluateClassname.js';
const ENABLE_DEBUG_LOGS = false;
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
        const options = resolveOptions((_a = context.options) === null || _a === void 0 ? void 0 : _a[0]);
        function checkClassName(attrNode) {
            var _a, _b;
            const attrName = (_b = (_a = attrNode.name) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toString();
            if (!attrName || !options.attributes.includes(attrName))
                return;
            const classEntries = collectClassnames(attrNode.value, options.helpers);
            if (classEntries.length === 0)
                return;
            const byUtility = bucketColorClassesByUtility(classEntries, options);
            const missingClasses = computeMissingClasses(byUtility);
            if (missingClasses.length === 0)
                return;
            const missingByOwner = groupMissingByOwner(attrNode, missingClasses);
            for (const { owner, items } of missingByOwner.values()) {
                const reportNode = owner.kind === 'helper-segment' ? owner.argNode : attrNode;
                const reportInfo = buildReportInfo(items);
                context.report({
                    node: reportNode,
                    messageId: reportInfo.messageId,
                    data: {
                        key: reportInfo.utilities,
                        lightStyles: reportInfo.lightStyles,
                        darkStyles: reportInfo.darkStyles,
                    },
                    suggest: buildSuggestions({
                        attrNode,
                        owner,
                        items,
                        sourceCode,
                    }),
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
/**
 * Evaluate all extracted class entries and bucket them by Tailwind utility prefix and mode.
 *
 * Example output structure:
 * - key: "bg"
 * - value: { light: [...], dark: [...] }
 *
 * We only keep classes that `evaluateClassname(...)` deems relevant (i.e. color-related
 * according to configured `utilityClasses` + `colorNames`).
 *
 * @param entries Output from `collectClassnames` (class strings + ownership info)
 * @param options Normalized rule options
 */
function bucketColorClassesByUtility(entries, options) {
    var _a;
    const buckets = new Map();
    for (const { className, owner } of entries) {
        const evaluated = evaluateClassname(className, {
            utilityClasses: options.utilityClasses,
            colorNames: options.colorNames,
        });
        if (!evaluated)
            continue;
        const withOwner = Object.assign(Object.assign({}, evaluated), { owner });
        const existing = (_a = buckets.get(withOwner.utility)) !== null && _a !== void 0 ? _a : { light: [], dark: [] };
        existing[withOwner.mode].push(withOwner);
        buckets.set(withOwner.utility, existing);
    }
    return buckets;
}
/**
 * Compute all missing mode classes across all utilities in a node.
 *
 * A utility is considered "balanced" when `light.length === dark.length`.
 * Otherwise, we consider the larger side the "source of truth" and derive missing
 * suggestions for the smaller side.
 *
 * Important:
 * - This function returns *suggested* missing classes; it does not directly report.
 * - Deduplication / grouping by owner happens later.
 *
 * @param byUtility Map from utility => { light, dark }
 */
function computeMissingClasses(byUtility) {
    const allMissing = [];
    for (const [utility, { light, dark }] of byUtility.entries()) {
        if (light.length === dark.length)
            continue;
        const missingMode = light.length > dark.length ? 'dark' : 'light';
        const superior = light.length > dark.length ? light : dark;
        const inferior = light.length > dark.length ? dark : light;
        allMissing.push(...computeMissingForUtility({
            utility,
            missingMode,
            superior,
            inferior,
        }));
    }
    return allMissing;
}
/**
 * Compute missing classes for a single utility ("bg", "text", etc).
 *
 * Strategy:
 * - Iterate the side that has more classes (`superior`).
 * - For each class, check if there's an opposite in `inferior` with:
 *   - the same owner.classString AND
 *   - the same modifier chain (variants) when ignoring `dark:`
 * - If no opposite exists, synthesize a suggestion for the missing mode by:
 *   - preserving the variant chain
 *   - deriving an "opposite" color token (see `computeOppositeColorToken`)
 *
 * @returns An array of synthetic color classes to add.
 */
function computeMissingForUtility(args) {
    const missing = [];
    for (const sup of args.superior) {
        if (hasMatchingOppositeInSameClassString({ superior: sup, inferior: args.inferior })) {
            continue;
        }
        const variantPrefix = extractVariantPrefix(sup.className, sup.relevantClass);
        const currentColorToken = extractColorToken(sup.relevantClass);
        const oppositeColorToken = computeOppositeColorToken(currentColorToken);
        // Our "missing" dark suggestions should usually be prefixed with `dark:`.
        // However, if the class has no variants (variantPrefix === ''), adding `dark:`
        // might create awkward duplicates depending on how evaluateClassname treats base classes.
        const needsDarkPrefix = args.missingMode === 'dark' && variantPrefix.length > 0;
        const darkPrefix = needsDarkPrefix ? 'dark:' : '';
        const newRelevantClass = `${sup.utility}-${oppositeColorToken}`;
        const newClassName = `${darkPrefix}${variantPrefix}${newRelevantClass}`;
        if (ENABLE_DEBUG_LOGS) {
            console.log(`Missing ${args.missingMode}: '${newClassName}' (from '${sup.className}')`);
        }
        missing.push({
            utility: sup.utility,
            mode: args.missingMode,
            className: newClassName,
            relevantClass: newRelevantClass,
            owner: sup.owner,
        });
    }
    return missing;
}
/**
 * Determine whether a given "superior" class already has an opposite in the "inferior"
 * list for the *same* class string segment.
 *
 * Why we need this:
 * - A JSX attribute can contain multiple class string segments (e.g. `cn(cond && "…", "…")`).
 * - We only want to compare within the same owner.classString segment, otherwise we'd
 *   incorrectly assume a dark class elsewhere covers a light class here (or vice versa).
 *
 * Matching criteria:
 * - same `owner.classString`
 * - same variant prefix chain when ignoring `dark:` (e.g. `hover:focus:`)
 */
function hasMatchingOppositeInSameClassString(args) {
    const inSameClassString = args.inferior.find((inf) => inf.owner.classString === args.superior.owner.classString);
    if (!inSameClassString)
        return false;
    const superiorPrefix = stripDarkPrefix(extractVariantPrefix(args.superior.className, args.superior.relevantClass));
    const inferiorPrefix = stripDarkPrefix(extractVariantPrefix(inSameClassString.className, inSameClassString.relevantClass));
    return superiorPrefix === inferiorPrefix;
}
/**
 * Remove a `dark:` modifier from the given string.
 *
 * This is intentionally shallow (single replace) because:
 * - we only ever need to normalize the *leading* `dark:` modifier for comparison
 * - Tailwind variant chains are left-to-right; we treat `dark:` as a distinct modifier
 */
function stripDarkPrefix(input) {
    return input.replace('dark:', '');
}
/**
 * Extract the "variant prefix" that comes before the relevant class.
 *
 * Example:
 * - fullClassName:  "dark:hover:bg-neutral-200"
 * - relevantClass:  "bg-neutral-200"
 * - result:         "hover:"
 *
 * This is used to preserve the same variant chain when generating suggestions.
 */
function extractVariantPrefix(fullClassName, relevantClass) {
    return stripDarkPrefix(fullClassName).replace(relevantClass, '');
}
/**
 * Extract the "color token" from a Tailwind relevant class.
 *
 * Example:
 * - relevantClass: "bg-neutral-200"
 * - returns:       "neutral-200"
 *
 * This assumes the evaluated class shape: `${utility}-${colorToken}`.
 */
function extractColorToken(relevantClass) {
    return relevantClass.split('-').slice(1).join('-');
}
/**
 * Compute an "opposite" color token to suggest for the missing mode.
 *
 * Behavior:
 * - Palette tokens (e.g. "neutral-200" or "neutral-200/80") are mirrored around 900:
 *   - 200 -> 700, 100 -> 800, 900 -> 0 (rare; but we follow the math)
 * - Opacity segments are preserved: "neutral-200/80" -> "neutral-700/80"
 * - Special non-palette tokens flip where it makes sense:
 *   - "white" <-> "black"
 * - Unknown or non-numeric intensities are left unchanged to avoid generating nonsense.
 *
 * Note:
 * This “opposite” heuristic is opinionated. If you want different behavior (e.g. map
 * 100->900), change it here and the rest of the rule remains stable.
 */
function computeOppositeColorToken(colorToken) {
    if (colorToken.includes('-')) {
        const [colorName, intensityPart] = colorToken.split('-', 2);
        const [rawIntensity, rawOpacity] = intensityPart.split('/', 2);
        const intensity = Number(rawIntensity);
        const opacitySuffix = rawOpacity ? `/${rawOpacity}` : '';
        if (!Number.isFinite(intensity))
            return colorToken;
        return `${colorName}-${Math.abs(intensity - 900)}${opacitySuffix}`;
    }
    if (colorToken === 'white')
        return 'black';
    if (colorToken === 'black')
        return 'white';
    return colorToken;
}
/**
 * Group missing class suggestions by their "owner".
 *
 * Why:
 * - In simple cases, fixes apply to the JSX attribute value.
 * - In helper calls (cn/tw), fixes should apply to the specific segment (argument node)
 *   that produced the missing class.
 *
 * Grouping ensures we:
 * - report one diagnostic per “edit location”
 * - provide suggestions that are relevant to that location
 */
function groupMissingByOwner(attrNode, missing) {
    const map = new Map();
    for (const item of missing) {
        const key = getOwnerKey(attrNode, item.owner);
        const existing = map.get(key);
        if (existing)
            existing.items.push(item);
        else
            map.set(key, { owner: item.owner, items: [item] });
    }
    return map;
}
/**
 * Build a stable key for a fix “anchor”.
 *
 * Rules:
 * - Helper segments: key off the helper argument node (range if available, else loc).
 * - Simple attributes: prefer the attribute value node, else fall back to the attribute.
 *
 * Rationale:
 * - `range` is stable and precise for mapping edits.
 * - `loc` is a fallback for environments/parsers where range isn’t populated.
 */
function getOwnerKey(attrNode, owner) {
    var _a, _b, _c, _d, _e, _f;
    if (owner.kind === 'helper-segment') {
        const r = owner.argNode.range;
        if (r)
            return `helper:${r[0]}-${r[1]}`;
        const loc = (_a = owner.argNode.loc) === null || _a === void 0 ? void 0 : _a.start;
        return `helper:${(_b = loc === null || loc === void 0 ? void 0 : loc.line) !== null && _b !== void 0 ? _b : 0}:${(_c = loc === null || loc === void 0 ? void 0 : loc.column) !== null && _c !== void 0 ? _c : 0}`;
    }
    const val = owner.attrValue;
    if (val === null || val === void 0 ? void 0 : val.range)
        return `simple:${val.range[0]}-${val.range[1]}`;
    if (attrNode.range)
        return `simple:${attrNode.range[0]}-${attrNode.range[1]}`;
    const loc = (_d = attrNode.loc) === null || _d === void 0 ? void 0 : _d.start;
    return `simple:${(_e = loc === null || loc === void 0 ? void 0 : loc.line) !== null && _e !== void 0 ? _e : 0}:${(_f = loc === null || loc === void 0 ? void 0 : loc.column) !== null && _f !== void 0 ? _f : 0}`;
}
/**
 * Build human-friendly report metadata from a set of missing class suggestions.
 *
 * This function only prepares display strings / message choice; it does not
 * contain rule logic.
 *
 * Assumptions:
 * - All `items` for a given report generally share a missing mode.
 * - If not, we still choose the first item’s mode for the `messageId` so the report
 *   remains deterministic.
 */
function buildReportInfo(items) {
    var _a, _b;
    const missingMode = (_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.mode) !== null && _b !== void 0 ? _b : 'light';
    const messageId = missingMode === 'dark' ? 'missingDark' : 'missingLight';
    const utilities = [...new Set(items.map((i) => i.utility))].join(', ');
    const lightStyles = items
        .filter((i) => i.mode === 'light')
        .map((i) => `'${i.className}'`)
        .join(', ') || '—';
    const darkStyles = items
        .filter((i) => i.mode === 'dark')
        .map((i) => `'${i.className}'`)
        .join(', ') || '—';
    return { messageId, utilities, lightStyles, darkStyles };
}
/**
 * Build ESLint suggestions for a given owner group.
 *
 * Output:
 * - One “bulk add” suggestion that appends all missing classes at once.
 * - One suggestion per missing class (fine-grained).
 *
 * Fix implementation:
 * - Delegates to `createEslintSuggestionFixer` which knows how to edit:
 *   - a simple JSX attribute value OR
 *   - a helper segment node (cn/tw argument)
 *
 * Keeping this logic centralized means:
 * - diagnostics stay readable
 * - suggestion formats remain consistent
 */
function buildSuggestions(args) {
    const { attrNode, owner, items, sourceCode } = args;
    const utilities = [...new Set(items.map((i) => i.utility))].join(', ');
    const sample = items
        .slice(0, 3)
        .map((i) => `'${i.className}'`)
        .join(', ');
    const suffix = items.length > 4 ? ', ...' : '';
    const addAllSuggestion = {
        // @ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.  && utility-function name like "cn" on `owner.callExpression`
        desc: `Add-All ${items.length} classes (utility-types: ${utilities}) within ${owner.kind === 'helper-segment' ? owner.callExpression.callee.name + '-argument' : 'className'}`,
        fix: (fixer) => {
            const classesToAdd = items.map((i) => i.className).join(' ');
            return createEslintSuggestionFixer(attrNode, owner, classesToAdd, fixer, sourceCode);
        },
    };
    const perClassSuggestions = items.map((missing) => ({
        // @ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
        desc: `Add ${missing.mode}-mode ${missing.className}`,
        fix: (fixer) => createEslintSuggestionFixer(attrNode, owner, missing.className, fixer, sourceCode),
    }));
    return [addAllSuggestion, ...perClassSuggestions];
}
