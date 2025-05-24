import { DependencyTracker } from '../lib/dependency-tracker'
import { PermutationEngine } from '../lib/permutation-engine'
import { Trie } from '../lib/trie'

describe('DependencyTracker', () => {
  it('should track imports for PermutationEngine', () => {
    const tracker = new DependencyTracker()
    const trie = new Trie()
    const engine = new PermutationEngine(trie)

    const dependencies = tracker.getDependencies(engine)
    expect(dependencies).toContain('trie')
    expect(dependencies).toContain('cache')
  })

  it('should detect circular dependencies', () => {
    const tracker = new DependencyTracker()
    const hasCircular = tracker.hasCircularDependencies()
    expect(hasCircular).toBe(false)
  })

  it('should calculate import costs', () => {
    const tracker = new DependencyTracker()
    const cost = tracker.calculateImportCost('trie')
    expect(cost).toBeGreaterThan(0)
  })
})
