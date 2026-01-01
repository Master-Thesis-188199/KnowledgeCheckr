/**
 * This utility function collects the classname / classname-arguments from both static className attributes and dynamic className attributes when using utility functions like `cn`.
 * More importanntely, this function collects the respective className informations while preserving the owner-information of the retrieved className.
 * This way suggestions about missing classes can be made for e.g the specific className attribute within utility functions like "cn".
 *
 * For static className:
 *   - returns one OwnerSimple with all classes split.
 *
 * For helper calls (cn/tw):
 *   - returns one OwnerHelperSegment per literal/template/logical-right-literal argument
 *   - each segment has its own classString, which we split into classNames.
 */
export default function collectClassnames(attrValue, helperNames) {
    const entries = [];
    if (!attrValue)
        return entries;
    // className="foo bar"
    if (attrValue.type === 'Literal' && typeof attrValue.value === 'string') {
        const classString = attrValue.value;
        const classNames = classString
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean);
        const owner = {
            kind: 'simple',
            attrValue,
            classString,
        };
        for (const cls of classNames) {
            entries.push({ className: cls, owner });
        }
        return entries;
    }
    if (attrValue.type === 'JSXExpressionContainer') {
        const expr = attrValue.expression;
        // className={'foo bar'}
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
            const classString = expr.value;
            const classNames = classString
                .split(/\s+/)
                .map((t) => t.trim())
                .filter(Boolean);
            const owner = {
                kind: 'simple',
                attrValue,
                classString,
            };
            for (const cls of classNames) {
                entries.push({ className: cls, owner });
            }
            return entries;
        }
        // className={`foo bar`} (no interpolations)
        if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
            const classString = expr.quasis.map((q) => q.value.cooked || '').join('');
            const classNames = classString
                .split(/\s+/)
                .map((t) => t.trim())
                .filter(Boolean);
            const owner = {
                kind: 'simple',
                attrValue,
                classString,
            };
            for (const cls of classNames) {
                entries.push({ className: cls, owner });
            }
            return entries;
        }
        // className={cn("...", "...")} or className={tw("...", "...")}
        if (expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && helperNames.includes(expr.callee.name)) {
            const callExpression = expr;
            callExpression.arguments.forEach((arg, index) => {
                // argument: "foo bar"
                if (arg.type === 'Literal' && typeof arg.value === 'string') {
                    const classString = arg.value;
                    const classNames = classString
                        .split(/\s+/)
                        .map((t) => t.trim())
                        .filter(Boolean);
                    const owner = {
                        kind: 'helper-segment',
                        callExpression,
                        argNode: arg,
                        classString,
                    };
                    for (const cls of classNames) {
                        entries.push({ className: cls, owner });
                    }
                    return;
                }
                // argument: `foo bar`
                if (arg.type === 'TemplateLiteral' && arg.expressions.length === 0) {
                    const classString = arg.quasis.map((q) => q.value.cooked || '').join('');
                    const classNames = classString
                        .split(/\s+/)
                        .map((t) => t.trim())
                        .filter(Boolean);
                    const owner = {
                        kind: 'helper-segment',
                        callExpression,
                        argNode: arg,
                        classString,
                    };
                    for (const cls of classNames) {
                        entries.push({ className: cls, owner });
                    }
                    return;
                }
                // argument: cond && "foo bar"
                if (arg.type === 'LogicalExpression' && arg.right.type === 'Literal' && typeof arg.right.value === 'string') {
                    const literal = arg.right;
                    const classString = literal.value;
                    const classNames = classString
                        .split(/\s+/)
                        .map((t) => t.trim())
                        .filter(Boolean);
                    const owner = {
                        kind: 'helper-segment',
                        callExpression,
                        argNode: literal,
                        classString,
                    };
                    for (const cls of classNames) {
                        entries.push({ className: cls, owner });
                    }
                    return;
                }
                // other arg shapes are ignored
            });
            return entries;
        }
    }
    return entries;
}
