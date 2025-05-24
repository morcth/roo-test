export interface CacheMetrics {
  hits: number
  misses: number
  evictions: number
  alertThreshold?: number
}

export class LRUCache<K, V> {
  private readonly maxSize: number
  private readonly cache: Map<K, V>
  private metrics: CacheMetrics
  private alertThreshold: number

  constructor(maxSize: number = 100, alertThreshold: number = 0.9) {
    this.maxSize = maxSize
    this.cache = new Map()
    this.metrics = { hits: 0, misses: 0, evictions: 0 }
    this.alertThreshold = alertThreshold
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!
      this.cache.delete(key)
      this.cache.set(key, value)
      this.metrics.hits++
      return value
    }
    this.metrics.misses++
    return undefined
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
        this.metrics.evictions++
      }
    }
    this.cache.set(key, value)
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics, alertThreshold: this.alertThreshold }
  }

  hasPerformanceAlert(): boolean {
    const total = this.metrics.hits + this.metrics.misses
    if (total === 0) return false
    const hitRate = this.metrics.hits / total
    return hitRate < this.alertThreshold
  }
}
