import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import enforceLoggerPlugin from './config/eslint_rules/enforce-logger-usages.mjs'
import requireColorModeStyles from './config/eslint_rules/color-mode-styles/require-color-mode-styles.js'
import serverOnlyPlugin from './config/eslint_rules/server-only-first.mjs'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-children-prop': 0,
      'react-hooks/exhaustive-deps': 0,
      '@typescript-eslint/ban-ts-comment': 'warn',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
        },
      ],
    },
  },
  {
    plugins: {
      'server-only-first': serverOnlyPlugin,
      'enforce-logger-usage': enforceLoggerPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'require-color-modes': requireColorModeStyles,
    },

    rules: {
      'enforce-logger-usage/no-console-in-server-or-async': 'warn',
      'enforce-logger-usage/no-logger-in-client-modules': 'error',

      'server-only-first/server-only-first': 'error',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^server-only$', '^\\u0000', '^react$', '^next$', '^@?\\w', '^@/', '^\\.\\.(?:/.*)?$', '^\\./(?=.*/).*$', '^\\.(?!/?$)', '^\\./?$']],
        },
      ],

      'import/first': 'error',
      'unused-imports/no-unused-imports': 'warn',

      'require-color-modes/require-color-mode-styles': [
        'warn',
        {
          utilityClasses: ['bg', 'text', 'border', 'ring', 'shadow', 'from', 'via', 'to', 'fill', 'outline'],
          attributes: ['className', 'class', 'triggerClassname', 'indicatorClasses'],
          helpers: ['cn', 'tw', 'clsx'],
          colorNames: ['ring', 'ring-hover', 'ring-subtle'],
        },
      ],
    },
  },
])

export default eslintConfig
