/**
 * Represents a node in the Trie data structure
 */
export class TrieNode {
  /**
   * A map of characters to child TrieNodes.
   */
  public readonly children: Map<string, TrieNode> = new Map()
  /**
   * Indicates if the node marks the end of a word.
   */
  public isEndOfWord: boolean = false
}

/**
 * Trie data structure for efficient string storage and retrieval
 */
export class Trie {
  private readonly root: TrieNode = new TrieNode()

  /**
   * Inserts a word into the trie.
   * @param word - The word to insert.
   */
  insert(word: string): void {
    let currentNode = this.root

    for (const char of word) {
      currentNode = this.getOrCreateChild(currentNode, char)
    }

    currentNode.isEndOfWord = true
  }

  /**
   * Gets or creates a child node for a given character.
   * @param node - The current node.
   * @param char - The character for which to get or create a child node.
   * @returns The child node.
   */
  private getOrCreateChild(node: TrieNode, char: string): TrieNode {
    if (!node.children.has(char)) {
      node.children.set(char, new TrieNode())
    }
    return node.children.get(char) as TrieNode
  }

  /**
   * Searches for a complete word in the trie
   * @param word - The word to search for
   * @returns True if the word exists in its entirety, false otherwise
   * @example
   * const trie = new Trie()
   * trie.insert('apple')
   * trie.search('app') // false
   * trie.search('apple') // true
   * @complexity O(n) where n = word length
   */
  search(word: string): boolean {
    const node = this.traversePrefix(word)
    return node !== null && node.isEndOfWord
  }

  /**
   * Checks if any word in the trie starts with the given prefix
   * @param prefix - The character sequence to search for
   * @returns Boolean indicating prefix presence
   * @complexity O(n) where n = prefix length
   */
  prefixSearch(prefix: string): boolean {
    return this.traversePrefix(prefix) !== null
  }

  /**
   * Common node traversal helper for prefix operations
   * @param str - String to traverse
   * @returns Terminal node or null if not found
   * @complexity O(n) where n = input length
   */
  private traversePrefix(str: string): TrieNode | null {
    let currentNode: TrieNode | null = this.root
    for (const char of str) {
      if (!currentNode?.children.has(char)) return null
      currentNode = currentNode.children.get(char)!
    }
    return currentNode
  }

  /**
   * Deletes a word from the trie
   * @param word - The word to delete
   * @returns True if word was found and deleted, false otherwise
   */
  delete(word: string): boolean {
    let current = this.root
    const path: Array<[TrieNode, string]> = []

    // Track deletion path
    for (const char of word) {
      if (!current.children.has(char)) return false
      path.push([current, char])
      current = current.children.get(char)!
    }

    if (!current.isEndOfWord) return false

    // Remove word marker and clean up orphan nodes
    current.isEndOfWord = false

    // Remove nodes with no children and no word endings
    while (path.length > 0 && current.children.size === 0 && !current.isEndOfWord) {
      const [parent, char] = path.pop()!
      parent.children.delete(char)
      current = parent
    }

    return true
  }

  /**
   * Deletes a word from the trie
   * @complexity Time: O(n) where n = word length, Space: O(1)
   */

  /**
   * Gets the root node of the trie
   * @returns The root TrieNode
   */
  getRoot(): TrieNode {
    return this.root
  }
}
