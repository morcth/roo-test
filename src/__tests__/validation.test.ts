import ValidationService from '../lib/validation'

describe('ValidationService', () => {
  let service: ValidationService

  beforeEach(() => {
    service = new ValidationService()
  })

  describe('validateLength', () => {
    it('should return invalid for empty string', () => {
      const result = service.validateLength('')
      expect(result.valid).toBe(false)
      expect(result.message).toBeTruthy()
    })

    it('should return valid for non-empty string', () => {
      const result = service.validateLength('test')
      expect(result.valid).toBe(true)
    })
  })

  describe('validateChars', () => {
    it('should return invalid for non-alphanumeric chars', () => {
      const result = service.validateChars('test!')
      expect(result.valid).toBe(false)
      expect(result.message).toBeTruthy()
    })

    it('should return valid for alphanumeric chars', () => {
      const result = service.validateChars('test123')
      expect(result.valid).toBe(true)
    })
  })
})
