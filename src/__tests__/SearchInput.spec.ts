import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import SearchInput from '../components/SearchInput.vue'
import { createTestingPinia } from '@pinia/testing'

describe('SearchInput', () => {
  it('should render with required features', async () => {
    const { getByTestId } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    expect(input).toBeTruthy()
    expect(input.getAttribute('aria-label')).toBe('Search')
    expect(input).toHaveValue('')

    await user.type(input, 'test')
    expect(input).toHaveValue('test')
  })

  it('should emit search results when typing', async () => {
    const { getByTestId, emitted } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    await user.type(input, 'apple')
    const results = emitted().results as string[][]
    expect(results).toBeTruthy()
    expect(results.some((r) => r[0] === 'apple')).toBe(true)
  })

  it('should emit input events when typing', async () => {
    const { getByTestId, emitted } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    await user.type(input, 'test')
    expect(emitted().input).toBeTruthy()
  })

  it('should not emit results when input contains invalid characters', async () => {
    const { getByTestId, emitted } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    await user.type(input, 'test')
    const initialResults = emitted().results?.length || 0
    await user.type(input, '!')
    expect(emitted().results?.length).toBe(initialResults)
  })

  it('should not emit results when input is empty', async () => {
    const { getByTestId, emitted } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    await user.type(input, ' ')
    await user.clear(input)
    expect(emitted().results).toBeUndefined()
  })

  it('should show validation errors with proper ARIA attributes', async () => {
    const { getByTestId, getByText } = render(SearchInput, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const input = getByTestId('search-input')
    const user = userEvent.setup()

    await user.type(input, 'invalid!')
    const errorMessage = getByText('Only alphanumeric characters allowed')
    expect(errorMessage).toBeVisible()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
  })
})
