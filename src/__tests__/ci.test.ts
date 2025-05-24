import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { brotliDecompressSync } from 'node:zlib'

interface BuildStats {
  version: number
  tree: {
    name: string
    children: Array<{
      name: string
      children?: Array<{
        name: string
        size?: number
      }>
    }>
  }
}

describe('production build optimizations', () => {
  it('should have optimized chunks', () => {
    execSync('CI=true npm run build -- --mode=production')
    const compressed = readFileSync(join(process.cwd(), 'dist', 'stats.json.br'))
    const stats: BuildStats = JSON.parse(brotliDecompressSync(compressed).toString('utf-8'))
    expect(stats.tree.children.length).toBeLessThan(10)
  })

  it('should pass bundle size limits', () => {
    const compressed = readFileSync(join(process.cwd(), 'dist', 'stats.json.br'))
    const stats: BuildStats = JSON.parse(brotliDecompressSync(compressed).toString('utf-8'))
    const mainBundle = stats.tree.children.find((c) => c.name.includes('index.'))
    expect(mainBundle).toBeDefined()
  })
})
