import { Trie } from '../lib/trie.ts'

describe('Trie', () => {
  describe('insert()', () => {
    it('insert("test") makes word searchable', () => {
      const trie = new Trie()

      trie.insert('test')

      expect(trie.search('test')).toBe(true)
    })
  })

  describe('search()', () => {
    it('returns true for existing words', () => {
      const trie = new Trie()
      trie.insert('test')

      expect(trie.search('test')).toBe(true)
    })
  })

  describe('prefixSearch()', () => {
    it('returns true for matching prefixes', () => {
      const trie = new Trie()
      trie.insert('test')
      trie.insert('testing')
      trie.insert('team')

      expect(trie.prefixSearch('tes')).toBe(true)
      expect(trie.prefixSearch('tea')).toBe(true)
      expect(trie.prefixSearch('')).toBe(true)
      expect(trie.prefixSearch('test')).toBe(true)
      expect(trie.prefixSearch('testing')).toBe(true)
      expect(trie.prefixSearch('team')).toBe(true)
      expect(trie.prefixSearch('nonexistent')).toBe(false)
    })
  })

  describe('delete()', () => {
    it('removes existing word from trie', () => {
      const trie = new Trie()
      trie.insert('test')

      expect(trie.search('test')).toBe(true)
      trie.delete('test')
      expect(trie.search('test')).toBe(false)
    })
  })
})
