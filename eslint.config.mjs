import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
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
    },
  }),
  {
    plugins: {
      'server-only-first': serverOnlyPlugin,
    },
    rules: {
      'server-only-first/server-only-first': 'error',
    },
  },
]

export default eslintConfig
