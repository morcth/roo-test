import { vi } from 'vitest'
import { DictionaryLoader } from '../lib/dictionary'

vi.mock('node:fs', () => {
  const mockReadStream = {
    on: vi.fn(),
    pipe: vi.fn(),
  }
  const mockFs = {
    createReadStream: vi.fn().mockReturnValue(mockReadStream),
  }
  return {
    ...mockFs,
    default: mockFs,
  }
})

vi.mock('node:readline', () => {
  const mockInterface = {
    [Symbol.asyncIterator]: vi.fn().mockReturnValue(['test', 'testing', 'team'][Symbol.iterator]()),
  }
  const mockReadline = {
    createInterface: vi.fn().mockReturnValue(mockInterface),
  }
  return {
    ...mockReadline,
    default: mockReadline,
  }
})

describe('DictionaryLoader', () => {
  it('loads valid dictionary file into trie', async () => {
    const { createReadStream } = await import('node:fs')
    const { createInterface } = await import('node:readline')

    const loader = new DictionaryLoader()
    const trie = await loader.load('dictionary.txt')

    expect(createReadStream).toHaveBeenCalledWith('dictionary.txt', 'utf-8')
    expect(createInterface).toHaveBeenCalledWith({
      input: createReadStream('dictionary.txt', 'utf-8'),
    })
    expect(trie.search('test')).toBe(true)
    expect(trie.search('testing')).toBe(true)
    expect(trie.search('team')).toBe(true)
    expect(trie.search('invalid')).toBe(false)
  })
})
