import { Any } from '@/types'

/**
 * Simplifies the creation of parameterized cypress test cases with generic test-case parameters
 * @param parameters An `Array` of parameters which will be provided to the respective test-function iteratively.
 * @param test The function that is called with the respective parameters. Note the test-case (`it`) is not yet used, so that users can customize the test.
 */
export function ParameterizedTest<T extends Any[] = unknown[]>(parameters: T, test: (props: T[number]) => void): void {
  parameters.forEach((props) => {
    test(props)
  })
}
