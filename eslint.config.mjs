import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import serverOnlyPlugin from './config/eslint_rules/server-only-first.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
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
  }),
  {
    plugins: {
      'server-only-first': serverOnlyPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'server-only-first/server-only-first': 'error',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^server-only$', '^\\u0000', '^react$', '^next$', '^@?\\w', '^@/', '^\\.\\.(?:/.*)?$', '^\\./(?=.*/).*$', '^\\.(?!/?$)', '^\\./?$']],
        },
      ],

      'import/first': 'error',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
]

export default eslintConfig
