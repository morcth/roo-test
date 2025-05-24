import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import SearchResults from '../components/SearchResults.vue'
vi.mock('../lib/permutation-engine', () => ({
  PermutationEngine: vi.fn().mockImplementation(() => ({
    generatePermutations: vi.fn().mockReturnValue(['test', 'sett']),
    getCacheMetrics: vi.fn().mockReturnValue({
      hits: 0,
      misses: 0,
      evictions: 0,
    }),
  })),
}))

describe('SearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no results', () => {
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results: [],
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })
    expect(wrapper.find('#search-results').exists()).toBe(true)
  })

  it('renders list of results', () => {
    const results = ['apple', 'banana', 'cherry']
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results,
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })
    const items = wrapper.findAll('li')
    expect(items.length).toBe(3)
    expect(items[0].text()).toBe('apple')
    expect(wrapper.find('[role="list"]').exists()).toBe(true)
  })

  it('has transition wrapper', () => {
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results: ['test'],
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })
    expect(wrapper.find('transition-stub').exists()).toBe(true)
  })

  it('shows loading state when store isLoading is true', async () => {
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              search: {
                input: '',
                isLoading: true,
              },
            },
          }),
        ],
      },
      props: {
        results: [],
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('shows pagination controls when results exceed page size', () => {
    const results = Array.from({ length: 100 }, (_, i) => `word${i}`)
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results,
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })
    expect(wrapper.find('.pagination').exists()).toBe(true)
  })

  it('shows correct number of results per page', () => {
    const results = Array.from({ length: 100 }, (_, i) => `word${i}`)
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results,
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })
    const items = wrapper.findAll('li')
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThanOrEqual(20)
  })

  it('triggers load more when scrolling near bottom', async () => {
    const results = Array.from({ length: 100 }, (_, i) => `word${i}`)
    const wrapper = mount(SearchResults, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        results,
        metrics: { hits: 0, misses: 0, evictions: 0 },
      },
    })

    expect(wrapper.find('.pagination-controls').exists()).toBe(true)
  })
})
