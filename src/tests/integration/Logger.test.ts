import { describe, expect, it } from '@jest/globals'
import logger from '@/src/lib/log/Logger'

describe('Ensure logger input / output mimics console.log: ', () => {
  let writeSpy: jest.SpyInstance

  beforeEach(() => {
    writeSpy = jest.spyOn(process.stdout, 'write')
  })

  afterEach(() => {
    writeSpy.mockRestore()
  })

  it('Verify logging simple messages mimics console.log output', () => {
    const message = 'This is a simple message...'

    console.log(message)
    logger.info(message)

    const consoleOutput = writeSpy.mock.calls[0][0].trim()
    const loggerOutput = clearJestAnnotatdLogs(removeColors(writeSpy.mock.calls[1][0])).trim()

    expect(loggerOutput).toEqual('[INFO]: ' + consoleOutput)
  })

  it('Verify logging objects mimics console.log output', () => {
    const message = JSON.stringify({ type: 'Some dummy object' }, null, 2)

    console.log(message)
    logger.info(message)

    const consoleOutput = removeWhitespaces(writeSpy.mock.calls[0][0])
    const loggerOutput = clearJestAnnotatdLogs(removeColors(removeWhitespaces(writeSpy.mock.calls[1][0])))

    console.log('ConsoleOuptut', consoleOutput)
    console.log('LoggerOuptut', loggerOutput)

    expect(loggerOutput).toEqual('[INFO]:' + consoleOutput)
  })

  it('Verify logging objects mimics console.log output', () => {
    const message = 'Created new object'
    const arg = { some: 'object' }

    console.log(message, JSON.stringify(arg, null, 2))
    logger.info(message, arg)

    const capturedConsoleOutput = removeWhitespaces(writeSpy.mock.calls[0][0])
    const capturedLoggerOutput = clearJestAnnotatdLogs(removeColors(removeWhitespaces(writeSpy.mock.calls[1][0])))

    console.log('Logger-spy: ', capturedLoggerOutput)
    console.log('Console-spy: ', capturedConsoleOutput)
    expect(capturedLoggerOutput).toEqual('[INFO]:' + capturedConsoleOutput)
  })

  it('Verify logging multiple strings mimics console.log output', () => {
    const message = 'Created new object'
    const args = ['first argument', 'second argument']

    console.log(message, ...args)
    logger.info(message, ...args)

    const capturedConsoleOutput = writeSpy.mock.calls[0][0].trim()
    const capturedLoggerOutput = clearJestAnnotatdLogs(removeColors(writeSpy.mock.calls[1][0])).trim()

    console.log('Logger-spy: ', capturedLoggerOutput)
    console.log('Console-spy: ', capturedConsoleOutput)
    expect(capturedLoggerOutput).toEqual('[INFO]: ' + capturedConsoleOutput)
  })
})

function removeWhitespaces(input: string) {
  return input.replace(/ /g, '')
}

function removeColors(input: string) {
  return input.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

/**
 * This function is needed to remove the annotation from logs printed to `process.stdout` by Jest. While logs from with test-cases can be de-annotated by re-assigning the `console` property through (`global.console = require("console")`), this can not be done very easily in other modules.
 * Hence, the jest log annotation has to be removed manually by stripping the first and last lines from the (to the `process.stdout`) printed output
 * @param stdOutput The collected output to `process.stdOut`
 * @returns The actual output without the Jest log annotations.
 */
function clearJestAnnotatdLogs(stdOutput: string) {
  if (!stdOutput.includes('console.log') && !stdOutput.includes('atConsole.log')) return stdOutput

  const cleaned = stdOutput.split('\n').slice(1, -3).join('\n')
  return cleaned
}
