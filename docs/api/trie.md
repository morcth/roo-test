# Trie API Documentation

This document provides detailed information about the Trie data structure implementation.

## `TrieNode`

Represents a node in the Trie data structure.

### Properties

- `children`: `Map<string, TrieNode>`
  A map of characters to child `TrieNode`s.
- `isEndOfWord`: `boolean`
  Indicates if the node marks the end of a word.

## `Trie`

Trie data structure for efficient string storage and retrieval.

### Properties

- `root`: `TrieNode`
  The root node of the trie.

### Methods

#### `insert(word: string): void`

Inserts a word into the trie.

##### Parameters

- `word`: `string`
  The word to insert.

##### Examples

```typescript
import { Trie } from './../lib/trie'

const trie = new Trie()
trie.insert('hello')
trie.insert('world')
```

#### `search(word: string): boolean`

Searches for a complete word in the trie.

##### Parameters

- `word`: `string`
  The word to search for.

##### Returns

- `boolean`
  `true` if the word exists in its entirety and is marked as a complete word, `false` otherwise.

##### Examples

```typescript
import { Trie } from './../lib/trie'

const trie = new Trie()
trie.insert('apple')
trie.insert('app') // 'app' is also a word
trie.insert('') // Empty string can be a word

trie.search('app') // true
trie.search('apple') // true
trie.search('apricot') // false (word not in trie)
trie.search('appl') // false (prefix, but not a complete word unless inserted)
trie.search('') // true (if empty string was inserted)
```

##### Edge Cases

- Searching for an empty string (`""`) will return `true` only if the empty string was explicitly inserted into the trie (marking the root node as the end of a word).
- Searching for a word that is a prefix of an inserted word (but not inserted itself) will return `false`.
- Searching for a word not present in the trie will return `false`.

[[#2]](../../backlog/tickets.json#2)

#### `prefixSearch(prefix: string): boolean`

Checks if any word in the trie starts with the given prefix.

##### Parameters

- `prefix`: `string`
  The character sequence to search for.

##### Returns

- `boolean`
  `true` if any word in the trie starts with the prefix, `false` otherwise.

##### Complexity

- O(n) where n = prefix length

##### Examples

```typescript
import { Trie } from './../lib/trie'

const trie = new Trie()
trie.insert('apple')
trie.insert('app')
trie.insert('apricot')

trie.prefixSearch('app') // true
trie.prefixSearch('appl') // true
trie.prefixSearch('banana') // false
trie.prefixSearch('') // true (an empty prefix matches everything)
```

##### Edge Cases

- Searching with an empty string (`""`) as the prefix will always return `true` as the root node exists and represents the empty prefix.

##### See Also

- [`traversePrefix()`](src/lib/trie.ts:94) - Internal helper function used for prefix traversal.

[[#3]](../../backlog/tickets.json#3)

#### `getOrCreateChild(node: TrieNode, char: string): TrieNode`

Gets or creates a child node for a given character.

##### Parameters

- `node`: `TrieNode`
  The current node.
- `char`: `string`
  The character for which to get or create a child node.

##### Returns

- `TrieNode`
  The child node.

##### Examples

This is a private helper method and is not intended for direct external use.

#### `delete(word: string): boolean`

Deletes a word from the trie, removing nodes that are no longer part of any other word.

##### Parameters

- `word`: `string`
  The word to delete.

##### Returns

- `boolean`
  `true` if the word was found and successfully deleted, `false` otherwise.

##### Complexity

- O(n) where n = word length

##### Description

Deletion involves traversing the trie based on the input word. If the word is found and marked as the end of a word, the `isEndOfWord` flag is set to `false`. Subsequently, the method backtracks from the end of the word towards the root, removing nodes that are no longer necessary (i.e., they have no children and are not the end of another word). This process ensures efficient memory management by cleaning up unused branches of the trie.

##### Examples

```typescript
import { Trie } from './../lib/trie'

const trie = new Trie()
trie.insert('apple')
trie.insert('app')
trie.insert('apricot')

trie.delete('apple') // true (deletes 'apple', potentially cleans up nodes)
trie.search('apple') // false
trie.search('app') // true ( 'app' remains)
trie.search('apricot') // true ('apricot' remains)

trie.delete('banana') // false (word not found)
```

##### See Also

- [`traversePrefix()`](src/lib/trie.ts:94) - Internal helper function used during deletion traversal.

[[#4]](../../backlog/tickets.json#4)
