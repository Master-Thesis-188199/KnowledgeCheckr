/* eslint-disable import/no-anonymous-default-export */

// ESM module that exposes a single rule.
// Ensures: if `import 'server-only'` exists, it is the FIRST import to ensure a component / module can only be used on the server.
export default {
  rules: {
    'server-only-first': {
      meta: {
        type: 'problem',
        docs: { description: "Require `import 'server-only'` to be the first import" },
        fixable: 'code',
        schema: [],
        messages: {
          mustBeFirst: "`import 'server-only'` must be the first import in the file.",
          mustBeSideEffect: "`server-only` must be imported as a side-effect: `import 'server-only'`.",
        },
      },
      create(context) {
        return {
          Program(node) {
            const imports = node.body.filter((n) => n.type === 'ImportDeclaration')
            if (imports.length === 0) return

            // find `import 'server-only'`
            const serverOnly = imports.find((n) => n.source?.value === 'server-only')
            if (!serverOnly) return

            const sourceCode = context.getSourceCode()

            // Must be side-effect import (no specifiers)
            if (serverOnly.specifiers && serverOnly.specifiers.length > 0) {
              context.report({ node: serverOnly, messageId: 'mustBeSideEffect' })
              return
            }

            // Must be the first import
            const firstImport = imports[0]
            if (firstImport !== serverOnly) {
              context.report({
                node: serverOnly,
                messageId: 'mustBeFirst',
                fix(fixer) {
                  const serverText = sourceCode.getText(serverOnly)

                  // Remove existing server-only line and insert it before the first import.
                  // We keep a single newline to avoid gluing tokens.
                  return [fixer.remove(serverOnly), fixer.insertTextBefore(firstImport, serverText + '\n')]
                },
              })
            }
          },
        }
      },
    },
  },
}
