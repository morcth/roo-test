export interface MonitoringService {
  errorTracker: unknown
  performanceHooks: unknown
}

export function initMonitoring(): MonitoringService {
  return {
    errorTracker: {},
    performanceHooks: {},
  }
}
