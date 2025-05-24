import { Trie } from '../lib/trie'
import { PermutationEngine } from '../lib/permutation-engine'

describe('Trie Performance Benchmarks', () => {
  it('should insert 1000 words in under 50ms', () => {
    const trie = new Trie()
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`)

    const start = performance.now()
    words.forEach((word) => trie.insert(word))
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50)
  })

  it('should search for 1000 words in under 30ms', () => {
    // Arrange
    const trie = new Trie()
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`)
    words.forEach((word) => trie.insert(word))

    // Act
    const start = performance.now()
    words.forEach((word) => trie.search(word))
    const duration = performance.now() - start

    // Assert
    expect(duration).toBeLessThan(30)
  })

  it('should delete 1000 words in under 70ms', () => {
    // Arrange
    const trie = new Trie()
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`)
    words.forEach((word) => trie.insert(word))

    // Act
    const start = performance.now()
    words.forEach((word) => trie.delete(word))
    const duration = performance.now() - start

    // Assert
    expect(duration).toBeLessThan(70)
  })

  it('should generate 100 permutations in under 20ms', () => {
    // Arrange
    const trie = new Trie()
    const words = ['a', 'b', 'c', 'd', 'e']
    words.forEach((word) => trie.insert(word))
    const engine = new PermutationEngine(trie)
    const input = 'abcde'

    // Act
    const start = performance.now()
    engine.generatePermutations(input)
    const duration = performance.now() - start

    // Assert
    expect(duration).toBeLessThan(20)
  })

  it('should have 98% cache hit rate after repeated calls', () => {
    // Arrange
    const trie = new Trie()
    const words = ['a', 'b', 'c', 'd', 'e']
    words.forEach((word) => trie.insert(word))
    const engine = new PermutationEngine(trie)
    const input = 'abcde'

    // Act - Call multiple times to populate cache
    for (let i = 0; i < 100; i++) {
      engine.generatePermutations(input)
    }

    // Get metrics from cache
    const metrics = engine.getCacheMetrics()
    const hitRate = metrics.hits / (metrics.hits + metrics.misses)

    // Assert
    expect(hitRate).toBeGreaterThan(0.98)
  })

  it('should trigger alert when cache hit rate drops below 90%', () => {
    // Arrange
    const trie = new Trie()
    const words = ['a', 'b', 'c', 'd', 'e']
    words.forEach((word) => trie.insert(word))
    const engine = new PermutationEngine(trie)
    const input = 'abcde'

    // Act - Call with different inputs to reduce hit rate
    for (let i = 0; i < 50; i++) {
      engine.generatePermutations(input + i) // Unique inputs to force misses
    }

    // Get metrics from cache
    const metrics = engine.getCacheMetrics()
    const hitRate = metrics.hits / (metrics.hits + metrics.misses)

    // Assert
    expect(hitRate).toBeLessThan(0.9)
    expect(engine.hasPerformanceAlert()).toBe(true)
  })
})

describe('Permutation Engine Performance Benchmarks', () => {
  let trie: Trie
  let engine: PermutationEngine
  const testInput = 'abcdefgh'

  beforeEach(() => {
    trie = new Trie()
    // Insert all possible 3-letter combinations of testInput
    for (let i = 0; i < testInput.length; i++) {
      for (let j = 0; j < testInput.length; j++) {
        for (let k = 0; k < testInput.length; k++) {
          trie.insert(testInput[i] + testInput[j] + testInput[k])
        }
      }
    }
    engine = new PermutationEngine(trie)
  })

  it('should show ≥20% performance improvement with memoization', () => {
    // Measure without memoization (create new engine instance each time)
    let totalWithoutMemo = 0
    const runs = 100
    for (let i = 0; i < runs; i++) {
      const freshEngine = new PermutationEngine(trie)
      const start = performance.now()
      freshEngine.generatePermutations(testInput)
      totalWithoutMemo += performance.now() - start
    }
    const avgWithoutMemo = totalWithoutMemo / runs

    // Measure with memoization (reuse same engine instance)
    let totalWithMemo = 0
    for (let i = 0; i < runs; i++) {
      const start = performance.now()
      engine.generatePermutations(testInput)
      totalWithMemo += performance.now() - start
    }
    const avgWithMemo = totalWithMemo / runs

    // Calculate improvement percentage
    const improvement = ((avgWithoutMemo - avgWithMemo) / avgWithoutMemo) * 100
    expect(improvement).toBeGreaterThanOrEqual(20)
  })
})
