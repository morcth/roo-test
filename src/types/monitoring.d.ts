declare module 'monitoring' {
  interface ErrorTracker {
    captureException(error: Error): void
    captureMessage(message: string): void
  }

  interface PerformanceHooks {
    startTransaction(name: string): void
    endTransaction(): void
  }
}
