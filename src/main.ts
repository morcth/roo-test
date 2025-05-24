import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { Trie } from './lib/trie'

const app = createApp(App)
app.use(createPinia())

async function initializeApp() {
  const trie = new Trie()
  try {
    const response = await fetch('/dictionary.txt')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    const words = text.split('\n').filter((word) => word.trim() !== '')
    for (const word of words) {
      trie.insert(word.trim())
    }
    console.log('Dictionary loaded with', words.length, 'words')
  } catch (error) {
    console.error('Failed to load dictionary:', error)
    throw error // Rethrow to prevent mounting with invalid state
  }

  app.provide('trie', trie)
  app.mount('#app')
}

initializeApp()
