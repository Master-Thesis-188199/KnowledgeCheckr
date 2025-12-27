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
  invalid: [
    {
      //* test missing dark-mode styles with NO existing opposite-class matches in static className properties
      code: `const A = () => (<div className="bg-neutral-200 text-neutral-700" />)`,
      errors: [
        {
          messageId: 'missingDark',
          data: {
            key: 'bg, text',
            lightStyles: '—',
            darkStyles: "'dark:bg-neutral-700', 'dark:text-neutral-200'",
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: "Add bg, text classes 'dark:bg-neutral-700', 'dark:text-neutral-200' in className",
              output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200" />)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-700',
              output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:bg-neutral-700" />)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:text-neutral-200',
              output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200" />)`,
            },
          ],
        },
      ],
    },

    {
      //* test missing dark-mode styles with existing opposite-class matches in static className properties
      code: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200" />)`,
      errors: [
        {
          messageId: 'missingDark',
          data: {
            key: 'bg',
            lightStyles: '—',
            darkStyles: "'dark:bg-neutral-700'",
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: "Add bg classes 'dark:bg-neutral-700' in className",
              output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-700" />)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-700',
              output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-700" />)`,
            },
          ],
        },
      ],
    },

    {
      //* test missing light-mode styles with existing opposite-class matches in static className properties
      code: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200" />)`,
      errors: [
        {
          messageId: 'missingLight',
          data: {
            key: 'text',
            lightStyles: "'text-neutral-700'",
            darkStyles: '—',
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: "Add text classes 'text-neutral-700' in className",
              output: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200 text-neutral-700" />)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add light-mode text-neutral-700',
              output: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200 text-neutral-700" />)`,
            },
          ],
        },
      ],
    },
  ],
})
