import { describe, expect, it } from '@jest/globals'
import logger from '@/src/lib/log/Logger'

describe('Ensure logger input / output mimics console.log: ', () => {
  let consoleSpy: jest.SpyInstance
  let loggerSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log')
    loggerSpy = jest.spyOn(logger, 'info')
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    loggerSpy.mockRestore()
  })

  it('Verify logging simple messages mimics console.log output', () => {
    const message = 'This is a simple message...'

    console.log(message)
    expect(consoleSpy.mock.calls[0][0]).toBe(message)

    logger.info(message)
    expect(loggerSpy.mock.calls[0][0]).toBe(message)
  })

  it('Verify logging objects mimics console.log output', () => {
    const message = { type: 'Some dummy object' }

    console.log(message)
    expect(consoleSpy.mock.calls[0][0]).toBe(message)

    logger.info(message)
    expect(loggerSpy.mock.calls[0][0]).toBe(message)
  })
})
