import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    input: '',
    isLoading: false,
  }),
  actions: {
    setInput(value: string) {
      this.input = value
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
  },
})
