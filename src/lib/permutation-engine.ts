import { Trie, TrieNode } from './trie'
import { LRUCache } from './cache'
import { DependencyTracker } from './dependency-tracker'

export class PermutationEngine {
  private readonly trie: Trie
  private readonly cache: LRUCache<string, string[]> = new LRUCache(100)
  private readonly dependencyTracker: DependencyTracker = new DependencyTracker()

  constructor(trie: Trie) {
    this.trie = trie
    this.dependencyTracker.getDependencies(this.constructor)
  }

  /**
   * Generates all valid permutations of the input characters
   * that exist in the trie dictionary
   * @param input - The input characters to permute
   * @returns Array of valid permutations
   */
  generatePermutations(input: string): string[] {
    if (!input || typeof input !== 'string') {
      throw new Error('Input must be a non-empty string')
    }

    const cached = this.cache.get(input)
    if (cached) {
      return cached
    }

    const result: string[] = []
    const chars = input.toLowerCase().split('')
    const visited = new Array(chars.length).fill(false)

    const backtrack = (current: string[], node: TrieNode) => {
      if (node.isEndOfWord) {
        const word = current.join('')
        if (word.length >= 3 && word !== input && !result.includes(word)) {
          result.push(word)
        }
      }

      for (let i = 0; i < chars.length; i++) {
        if (!visited[i]) {
          const char = chars[i]
          if (node.children.has(char)) {
            visited[i] = true
            current.push(char)
            backtrack(current, node.children.get(char)!)
            current.pop()
            visited[i] = false
          }
        }
      }
    }

    backtrack([], this.trie.getRoot())
    this.cache.set(input, result)
    return result
  }

  getCacheMetrics() {
    return this.cache.getMetrics()
  }

  hasPerformanceAlert(): boolean {
    return this.cache.hasPerformanceAlert()
  }
}
