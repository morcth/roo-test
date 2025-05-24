import { initMonitoring } from '../lib/monitoring'

describe('Production Monitoring', () => {
  it('should initialize error tracking', () => {
    process.env.VITEST = 'true'
    const monitoring = initMonitoring()
    expect(monitoring.errorTracker).toBeDefined()
  })

  it('should setup performance monitoring hooks', () => {
    process.env.VITEST = 'true'
    const monitoring = initMonitoring()
    expect(monitoring.performanceHooks).toBeDefined()
  })
})
