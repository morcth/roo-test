import { createApp } from 'vue'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

// Create app mount point
document.body.innerHTML = '<div id="app"></div>'

// Mock the App component
vi.mock('../App.vue', () => ({
  default: {
    // Mock the component's export
    render: vi.fn(),
  },
}))

// Mock pinia
vi.mock('pinia', () => ({
  createPinia: vi.fn(),
}))

// Mock Trie and fetch
vi.mock('../lib/trie', () => ({
  Trie: class {
    insert = vi.fn()
  },
}))

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('test\ntest2'),
  } as unknown as Response),
)

describe('main.ts', () => {
  it('initializes Vue app with App component and mounts it', async () => {
    // Mock createApp to return our mock app instance
    vi.mock('vue', () => {
      const app = {
        mount: vi.fn(),
        use: vi.fn(),
        provide: vi.fn(),
      }
      return {
        createApp: vi.fn(() => app),
        defineComponent: vi.fn(),
      }
    })

    // Dynamically import main.ts to trigger its execution after mocks are set up
    await import('../main')

    // Assert that createApp was called with the mocked App component
    // We need to import the mocked App component to check against it
    const App = (await import('../App.vue')).default
    expect(createApp).toHaveBeenCalledWith(App)

    // Verify the mount selector is correct by checking the mock implementation
    expect(createApp).toHaveBeenCalled()
    const mockApp = (createApp as Mock).mock.results[0].value
    expect(mockApp.mount).toHaveBeenCalledWith('#app')
  })
})
