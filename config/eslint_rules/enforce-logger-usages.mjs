/**
 * Determines whether a given statement node represents a `"use server"` directive.
 *
 * A `"use server"` directive is modeled in ESTree as an `ExpressionStatement`
 * whose expression is a `Literal` node with the exact value `"use server"`.
 *
 * @param stmt - The AST node to check.
 * @returns `true` if the statement is a `"use server"` directive, otherwise `false`.
 *
 * @remarks
 * This function performs strict structural checks to avoid false positives.
 * Only true directive prologue statements are recognized. Expressions such as
 * `"use server" + something` or `foo("use server")` will not match.
 */
function isUseServerDirective(stmt) {
  return stmt && stmt.type === 'ExpressionStatement' && stmt.expression.type === 'Literal' && stmt.expression.value === 'use server'
}

/**
 * Determines whether a function body begins with a `"use server"` directive.
 *
 * Inline "server actions" in Next.js are defined by placing `"use server"`
 * as the *first statement* inside the function body. This helper inspects the
 * function body for that specific shape.
 *
 * @param body - The array of statement nodes in the function body.
 * @returns `true` if the function begins with `"use server"`, otherwise `false`.
 *
 * @remarks
 * This intentionally checks *only the first statement*, matching the semantics
 * of directive prologues in JavaScript. A `"use server"` directive appearing
 * later in the body is not meaningful and is therefore ignored.
 */
function hasUseServerDirectiveInBody(body) {
  if (!Array.isArray(body) || body.length === 0) return false
  return isUseServerDirective(body[0])
}

/**
 * Extracts a console method name (`log`, `info`, `warn`, `error`, `debug`, etc.)
 * from a `CallExpression` callee, if present.
 *
 * @param callee - The AST node representing the call target.
 * @returns The console method name if the callee is a supported `console.*` call,
 *          otherwise `null`.
 *
 * @remarks
 * - Only member expressions of the form `console.<identifier>` are supported.
 * - Computed properties (e.g., `console['log']`) are deliberately ignored to
 *   avoid false positives and overly aggressive matching.
 * - This function does not validate whether the method is allowed — it only
 *   extracts the method name if recognized.
 */
function getConsoleMethod(callee) {
  if (!callee || callee.type !== 'MemberExpression' || callee.computed || callee.object.type !== 'Identifier' || callee.object.name !== 'console' || callee.property.type !== 'Identifier') {
    return null
  }

  const method = callee.property.name
  const supportedMethods = new Set(['log', 'info', 'warn', 'error', 'debug', 'verbose'])

  return supportedMethods.has(method) ? method : null
}

/**
 * Maps a console method name (e.g., `"log"`, `"warn"`) to the appropriate
 * logger method name (e.g., `"info"`, `"warn"`).
 *
 * @param consoleMethod - A validated console method name.
 * @returns The logger method name that should replace the console method.
 *
 * @remarks
 * Default mappings reflect common logging semantics:
 *
 * - `console.log` and `console.info` → `logger.info`
 * - `console.warn`                  → `logger.warn`
 * - `console.error`                → `logger.error`
 * - `console.debug`                → `logger.debug`
 * - `console.verbose`              → `logger.verbose`
 *
 * If an unexpected method is passed, a safe fallback of `"info"` is used.
 */
function getLoggerMethod(consoleMethod) {
  switch (consoleMethod) {
    case 'log':
    case 'info':
      return 'info'
    case 'warn':
      return 'warn'
    case 'error':
      return 'error'
    case 'debug':
      return 'debug'
    case 'verbose':
      return 'verbose'
    default:
      return 'info'
  }
}

/**
 * Determines whether a given statement node represents a `"use client"` directive.
 *
 * A `"use client"` directive is modeled in ESTree as an `ExpressionStatement`
 * whose expression is a `Literal` node with the exact value `"use client"`.
 *
 * @param stmt - The AST node to check.
 * @returns `true` if the statement is a `"use client"` directive, otherwise `false`.
 *
 * @remarks
 * This mirrors {@link isUseServerDirective} but for client components. Only
 * true directive prologue statements are recognized; arbitrary expressions that
 * merely contain the string `"use client"` are ignored.
 */
function isUseClientDirective(stmt) {
  return stmt && stmt.type === 'ExpressionStatement' && stmt.expression.type === 'Literal' && stmt.expression.value === 'use client'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  rules: {
    'no-console-in-server-or-async': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow console.* in async functions and in "use server" scopes; enforce using logger instead.',
        },
        schema: [],
        fixable: 'code',
        messages: {
          noConsoleInAsync: 'Avoid console.* inside async functions. Use the shared logger instead.',
          noConsoleInServer: 'Avoid console.* in server modules or functions marked with "use server". Use the shared logger instead.',
        },
      },

      create(context) {
        const functionStack = [] // track nested functions (async / server)
        let isServerModule = false

        let hasLoggerImport = false
        let firstImport = null
        let firstNode = null
        let loggerImportInserted = false // to avoid multiple inserted imports per file

        const LOGGER_IMPORT_PATH = '@/src/lib/log/Logger'
        const LOGGER_IMPORT_NAME = '_logger'
        const LOGGER_CONTEXT_AWARE_NAME = 'logger'

        function ensureImportFix(fixer) {
          // If the import already exists in original code or was already added in a previous fix,
          // don't add it again
          if (hasLoggerImport || loggerImportInserted) return null

          loggerImportInserted = true
          const importText = `import ${LOGGER_IMPORT_NAME} from '${LOGGER_IMPORT_PATH}'\n\n const ${LOGGER_CONTEXT_AWARE_NAME} = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)\n`

          if (firstImport) {
            // Put logger import before the first import
            return fixer.insertTextBefore(firstImport, importText)
          }

          if (firstNode) {
            // No imports, but there is some code – put import at very top
            return fixer.insertTextBefore(firstNode, importText)
          }

          // Extremely rare: completely empty file except for this call,
          // but if there is a call, there is a firstNode.
          return null
        }

        return {
          'Program'(node) {
            const body = node.body
            firstNode = body[0] || null

            // Detect module-level "use server" directive
            for (const stmt of body) {
              if (isUseServerDirective(stmt)) {
                isServerModule = true
                break
              }
              if (stmt.type !== 'ExpressionStatement' || stmt.expression.type !== 'Literal') {
                break // end of directive prologue
              }
            }

            // Find imports + logger import
            for (const stmt of body) {
              if (stmt.type !== 'ImportDeclaration') continue
              if (!firstImport) firstImport = stmt

              if (stmt.source && stmt.source.value === LOGGER_IMPORT_PATH) {
                const defaultSpecifier = stmt.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
                if (defaultSpecifier && defaultSpecifier.local.name === LOGGER_IMPORT_NAME) {
                  hasLoggerImport = true
                }
              }
            }
          },

          // ENTER any function
          'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression': function (node) {
            const isAsync = !!node.async
            const isServerFunction = node.body && node.body.type === 'BlockStatement' && hasUseServerDirectiveInBody(node.body.body)

            functionStack.push({
              async: isAsync,
              server: isServerFunction,
            })
          },

          // EXIT any function
          'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression:exit': function () {
            functionStack.pop()
          },

          'CallExpression'(node) {
            const consoleMethod = getConsoleMethod(node.callee)
            if (!consoleMethod) return

            const inAsync = functionStack.some((f) => f.async)
            const inServer = isServerModule || functionStack.some((f) => f.server)

            if (!inAsync && !inServer) return

            const loggerMethod = getLoggerMethod(consoleMethod)

            const reportCommon = (messageId) => {
              context.report({
                node,
                messageId,
                fix(fixer) {
                  const fixes = []

                  const callee = node.callee

                  // Replace console.* -> logger.<mapped>
                  fixes.push(fixer.replaceText(callee.object, LOGGER_CONTEXT_AWARE_NAME))
                  fixes.push(fixer.replaceText(callee.property, loggerMethod))

                  // Ensure logger import is present
                  const importFix = ensureImportFix(fixer)
                  if (importFix) {
                    fixes.push(importFix)
                  }

                  return fixes
                },
              })
            }

            if (inServer) {
              reportCommon('noConsoleInServer')
            } else if (inAsync) {
              reportCommon('noConsoleInAsync')
            }
          },
        }
      },
    },
    /**
     * Forbid importing the server-side logger into client components/modules.
     * Any file whose directive prologue contains `"use client"` is treated as
     * a client module, and importing the shared logger from
     * "@/src/lib/log/Logger" is disallowed.
     */
    'no-logger-in-client-modules': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow importing the server logger module in files marked with "use client".',
        },
        schema: [],
        messages: {
          noLoggerInClientImport: 'Do not import the server logger in client components. Use browser-safe logging instead.',
        },
      },

      create(context) {
        const LOGGER_IMPORT_PATH = '@/src/lib/log/Logger'
        let isClientModule = false

        return {
          Program(node) {
            // Detect module-level "use client" directive in the directive prologue
            for (const stmt of node.body) {
              if (isUseClientDirective(stmt)) {
                isClientModule = true
                break
              }
              if (stmt.type !== 'ExpressionStatement' || stmt.expression.type !== 'Literal') {
                // we reached the end of the directive prologue
                break
              }
            }
          },

          ImportDeclaration(node) {
            if (!isClientModule) return
            if (node.source && node.source.value === LOGGER_IMPORT_PATH) {
              context.report({
                node,
                messageId: 'noLoggerInClientImport',
              })
            }
          },
        }
      },
    },
  },
}
