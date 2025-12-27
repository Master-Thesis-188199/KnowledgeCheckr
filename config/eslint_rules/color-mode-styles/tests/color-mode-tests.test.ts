import tsParser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/utils/ts-eslint'
import { requireColorModeStylesRule } from '../require-color-mode-styles.js'

const ruleTester = new RuleTester({
  //@ts-expect-error The `languageOptions` is not defined in the `RuleTester` types even though it exists.
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('color-mode-styles rule', requireColorModeStylesRule, {
  valid: [
    // /* ... */
    {
      code: `
    const A = () => (
      <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" />
    )
    `,
    },
    {
      code: `
    const A = () => (
      <div className="ring-2 dark:ring-4" />
    )
    `,
    },
    {
      code: `
    const A = ({ isEmpty }) => (
      <div
        className={cn(
          "bg-neutral-200 dark:bg-neutral-800",
          isEmpty && "dark:text-neutral-100 text-neutral-900"
        )}
      />
    )
    `,
    },
  ],
  invalid: [],
})
