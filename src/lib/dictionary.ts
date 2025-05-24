import { Trie } from './trie'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

/**
 * Loads dictionary files into a Trie structure line by line using streams
 * @throws {Error} When file is not found
 */
export class DictionaryLoader {
  /**
   * Loads dictionary file and constructs Trie
   * @param filePath Path to dictionary file
   * @returns Promise resolving to populated Trie
   * @throws {Error} When file is not found or read error occurs
   * @complexity Time: O(n) (n = file size), Space: O(m) (m = word count)
   */
  async load(filePath: string): Promise<Trie> {
    const trie = new Trie()
    try {
      const stream = createReadStream(filePath, 'utf-8')
      const rl = createInterface({ input: stream })

      for await (const line of rl) {
        if (line) trie.insert(line)
      }

      return trie
    } catch (err) {
      throw new Error(
        `Failed to load dictionary: ${err instanceof Error ? err.message : 'Unknown error'}`,
      )
    }
  }
}
