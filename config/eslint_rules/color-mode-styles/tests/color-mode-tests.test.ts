import tsParser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/utils/ts-eslint'
import { requireColorModeStylesRule } from '../require-color-mode-styles.js'
import { createStaticClassTest } from './createTest'

const quoteString = (input: string) => `'${input}'`
const quoteJoinArray = (options: string[], seperator = ', ') => options.map(quoteString).join(seperator)
const joinArray = (options: string[], seperator = ', ') => options.join(seperator)

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
      name: 'Expect arbitrary (<utility>-[]) values to be recognized',
      code: `
    const A = () => (
      <div className="bg-[#ffffff] dark:bg-neutral-800" />
    )
    `,
    },

    {
      name: 'Expect multiple arbitrary (<utility>-[]) values to be recognized',
      code: `
    const A = () => (
      <div className="bg-[#ffffff] enabled:hover:active:ring-[#D44D35] dark:enabled:hover:active:ring-white dark:bg-neutral-800" />
    )
    `,
    },
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

    {
      name: 'Expect custom variable color-styles to be recognized',
      options: [{ colorNames: ['ring'] } as never],
      code: `const A = () => (<div className="ring-ring dark:ring-neutral-800" />)`,
    },

    {
      name: 'Expect custom variable color-styles with dashes in its name to be recognized',
      options: [{ colorNames: ['ring-hover'] } as never],
      code: `const A = () => (<div className="ring-ring-hover dark:ring-neutral-800" />)`,
    },

    {
      name: 'Expect custom variable color-styles in combiation with regular classes to be recognized',
      options: [{ colorNames: ['ring-hover'] } as never],
      code: `const A = () => (<div className="ring-ring-hover dark:ring-neutral-800 bg-neutral-200 dark:bg-neutral-700 border-white dark:border-black" />)`,
    },
  ],
  invalid: [
    {
      //* test missing dark-mode styles with NO existing opposite-class matches in static className properties
      name: 'Verify missing dark-mode classes for text and bg utility types are recognized and suggested',
      code: `const A = () => (<div className="bg-neutral-200 text-neutral-700" />)`,
      errors: [
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg', 'text']),
            missing: quoteJoinArray(['dark:bg-neutral-700', 'dark:text-neutral-200']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'text'])}`,
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
      name: 'Verify missing dark-mode classes for bg utility types are recognized and suggested (with existing color-mode styles)',
      code: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200" />)`,
      errors: [
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg']),
            missing: quoteJoinArray(['dark:bg-neutral-700']),
          },
          suggestions: [
            // {
            //   //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
            //   desc: "Add bg classes 'dark:bg-neutral-700' in className",
            //   output: `const A = () => (<div className="bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-700" />)`,
            // },
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
      name: 'Verify missing light-mode classes for text utility type is recognized and suggested (with existing color-mode styles)',
      code: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200" />)`,
      errors: [
        {
          messageId: 'missing_light',
          data: {
            key: joinArray(['text']),
            missing: quoteJoinArray(['text-neutral-700']),
          },
          suggestions: [
            // {
            //   //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
            //   desc: "Add text classes 'text-neutral-700' in className",
            //   output: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200 text-neutral-700" />)`,
            // },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add light-mode text-neutral-700',
              output: `const A = () => (<div className="bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-200 text-neutral-700" />)`,
            },
          ],
        },
      ],
    },

    createStaticClassTest({
      name: 'Verify missing dark-mode classes are detected based on variable-usage in light-mode (suggesting same variables)',
      baseClasses: ['bg-bg-hover', 'ring-ring'],
      missingClasses: ['dark:bg-bg-hover', 'dark:ring-ring'],
      errorType: 'missing_dark',
      utilities: ['bg', 'ring'],
      ruleOptions: { colorNames: ['bg-hover', 'ring'] },
    }),

    createStaticClassTest({
      name: 'Verify missing light-mode classes are detected based on variable-usage in dark-mode (suggesting same variables)',
      baseClasses: ['dark:bg-bg-hover', 'dark:ring-ring'],
      missingClasses: ['bg-bg-hover', 'ring-ring'],
      errorType: 'missing_light',
      utilities: ['bg', 'ring'],
      ruleOptions: { colorNames: ['bg-hover', 'ring'] },
    }),

    //. Dynamic classes -> utility functions like `cn`

    {
      //* test missing dark-mode styles without existing opposite-class matches in dynamic className properties (`cn`)
      name: 'Verify missing dark-mode classes for bg, text utility types are recognized and suggested in utility function `cn` (without existing color-mode styles)',
      code: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
      errors: [
        // first cn-argument
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg', 'text']),
            missing: quoteJoinArray(['dark:bg-neutral-700', 'dark:text-neutral-200']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'text'])}`,
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-700',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:bg-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:text-neutral-200',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
            },
          ],
        },

        // second cn argument
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg', 'text']),
            missing: quoteJoinArray(['dark:bg-neutral-600', 'dark:text-blue-300']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'text'])}`,
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:bg-neutral-600 dark:text-blue-300')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-600',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:bg-neutral-600')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:text-blue-300',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:text-blue-300')}/>)`,
            },
          ],
        },
      ],
    },

    {
      //* test missing dark-mode styles ** with ** existing opposite-class matches in dynamic className properties (`cn`)
      name: 'Verify missing dark-mode classes for bg, text utility types are recognized and suggested in utility function `cn` (with existing color-mode styles)',
      code: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
      errors: [
        // first cn-argument
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg']),
            missing: quoteJoinArray(['dark:bg-neutral-700']),
          },
          suggestions: [
            // {
            //   //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
            //   desc: "Add bg classes 'dark:bg-neutral-700' in argument",
            //   output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
            // },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-700',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600')}/>)`,
            },
          ],
        },

        // second cn argument
        {
          messageId: 'missing_dark',
          data: {
            key: joinArray(['bg', 'text']),
            missing: quoteJoinArray(['dark:bg-neutral-600', 'dark:text-blue-300']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'text'])}`,
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600 dark:bg-neutral-600 dark:text-blue-300')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-600',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600 dark:bg-neutral-600')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:text-blue-300',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200', isEmpty && 'bg-neutral-300 text-blue-600 dark:text-blue-300')}/>)`,
            },
          ],
        },
      ],
    },

    {
      name: 'Verify missing both dark- and light- mode classes for bg, text utility types are recognized and suggested in utility function `cn` (with existing color-mode styles)',
      code: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700')}/>)`,
      errors: [
        // first cn-argument
        {
          messageId: 'missing_both',
          data: {
            key: joinArray(['bg', 'ring']),
            missing: quoteJoinArray(['dark:bg-neutral-700', 'ring-orange-200']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'ring'])}`,
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700 dark:bg-neutral-700 ring-orange-200', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-700',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700 dark:bg-neutral-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add light-mode ring-orange-200',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700 ring-orange-200', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700')}/>)`,
            },
          ],
        },

        // second cn argument
        {
          messageId: 'missing_both',
          data: {
            key: joinArray(['bg', 'text', 'ring']),
            missing: quoteJoinArray(['dark:bg-neutral-600', 'dark:text-blue-300', 'ring-yellow-200']),
          },
          suggestions: [
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: `Add all missing classes for ${joinArray(['bg', 'text', 'ring'])}`,
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700 dark:bg-neutral-600 dark:text-blue-300 ring-yellow-200')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:bg-neutral-600',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700 dark:bg-neutral-600')}/>)`,
            },
            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add dark-mode dark:text-blue-300',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700 dark:text-blue-300')}/>)`,
            },

            {
              //@ts-expect-error Type declaration does not recognize 'desc' field, even though it exists.
              desc: 'Add light-mode ring-yellow-200',
              output: `const A = ({ isEmpty }) => (<div className={cn('bg-neutral-200 text-neutral-700 dark:text-neutral-200 dark:ring-orange-700', isEmpty && 'bg-neutral-300 text-blue-600 dark:ring-yellow-700 ring-yellow-200')}/>)`,
            },
          ],
        },
      ],
    },
  ],
})
