import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createPinia } from 'pinia'
import App from '../App.vue'
import { Trie } from '../lib/trie'

describe('App', () => {
  const pinia = createPinia()

  it('renders search input and trie visualization', () => {
    render(App, {
      global: {
        plugins: [pinia],
        provide: {
          trie: new Trie(),
        },
      },
    })

    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByTestId('trie-visualization')).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    const user = userEvent.setup()
    render(App, {
      global: {
        plugins: [pinia],
        provide: {
          trie: new Trie(),
        },
      },
    })

    const searchInput = screen.getByRole('textbox', { name: 'Search' })
    await user.type(searchInput, 'test')

    expect(searchInput).toHaveValue('test')
  })

  it('renders SearchInput and SearchResults components', () => {
    render(App, {
      global: {
        plugins: [pinia],
        provide: {
          trie: new Trie(),
        },
      },
    })

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })

  it('shows permutations when typing "test"', async () => {
    const user = userEvent.setup()
    const trie = new Trie()
    trie.insert('test')
    trie.insert('sett')
    trie.insert('tets')

    render(App, {
      global: {
        plugins: [pinia],
        provide: {
          trie,
        },
      },
    })

    await user.type(screen.getByTestId('search-input'), 'test')
    const results = screen.getAllByRole('listitem')
    expect(results).toHaveLength(2)
    expect(results.map((r) => r.textContent)).toEqual(expect.arrayContaining(['sett', 'tets']))
  })
})
