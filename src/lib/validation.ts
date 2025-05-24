class ValidationService {
  validateLength(input: string): { valid: boolean; message: string } {
    const trimmed = input.trim()
    if (trimmed.length === 0) {
      return { valid: false, message: 'Input cannot be empty' }
    }
    return { valid: true, message: '' }
  }

  validateChars(input: string): { valid: boolean; message: string } {
    if (!/^[a-zA-Z0-9]*$/.test(input)) {
      return { valid: false, message: 'Only alphanumeric characters allowed' }
    }
    return { valid: true, message: '' }
  }
}

export default ValidationService
