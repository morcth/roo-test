import { describe, it, expect } from 'vitest'
import { SanitizationService } from '../lib/sanitize'

describe('SanitizationService', () => {
  const service = new SanitizationService()

  describe('whitespace handling', () => {
    it('trims and collapses whitespace for UserText', () => {
      const input = '  hello   world  '
      const expected = 'hello world'
      const result = service.sanitize(input, 'UserText')
      expect(result).toBe(expected)
    })
  })

  describe('HTML entity handling', () => {
    it('preserves HTML entities for UserText (no escaping)', () => {
      const input = '<script>alert("xss")</script>'
      const expected = '<script>alert("xss")</script>'
      const result = service.sanitize(input, 'UserText')
      expect(result).toBe(expected)
    })
  })

  describe('non-printable characters', () => {
    it('removes non-printable characters', () => {
      const input = 'hello\u0000world\u001F'
      const expected = 'helloworld'
      const result = service.sanitize(input, 'UserText')
      expect(result).toBe(expected)
    })
  })

  describe('input type handling', () => {
    it('handles APIpayload differently than UserText', () => {
      const input = '  preserve   spaces  '
      const expected = '  preserve   spaces  '
      const result = service.sanitize(input, 'APIpayload')
      expect(result).toBe(expected)
    })
  })
})
