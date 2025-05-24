export type SanitizationType = 'UserText' | 'APIpayload'

/*
// Simple Benchmark Decorator (commented out for now)
function Benchmark(
  target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(input: string, type: SanitizationType) => string>,
) {
  const originalMethod = descriptor.value!

  descriptor.value = function (input: string, type: SanitizationType) {
    const start = performance.now()
    const result = originalMethod.call(this, input, type)
    const duration = performance.now() - start
    console.log(`Method "${propertyKey}" executed in ${duration.toFixed(2)}ms`)
    return result
  }

  return descriptor
}
*/

export class SanitizationService {
  sanitize(input: string, type: SanitizationType): string {
    if (type === 'UserText') {
      return input
        .replace(/[\x00-\x1F]/g, '') // Remove non-printable characters
        .trim()
        .replace(/\s+/g, ' ') // Collapse whitespace
    }
    return input
  }
}
