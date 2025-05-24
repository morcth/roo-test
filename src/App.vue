<template>
  <div style="text-align: left">
    <SearchInput v-model="baseWord" @results="handleResults" />
    <SearchResults :results="permutations" :metrics="metrics" data-testid="search-results" />
    <div data-testid="trie-visualization"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import SearchInput from './components/SearchInput.vue'
import SearchResults from './components/SearchResults.vue'
import type { Trie } from './lib/trie'
import { PermutationEngine } from './lib/permutation-engine'

const baseWord = ref('')
const permutations = ref<string[]>([])
const trie = inject<Trie>('trie')!

const permutationEngine = new PermutationEngine(trie)
const metrics = ref(permutationEngine.getCacheMetrics())

function handleResults(query: string) {
  baseWord.value = query
  if (query) {
    permutations.value = permutationEngine.generatePermutations(query)
    metrics.value = permutationEngine.getCacheMetrics()
  } else {
    permutations.value = []
    metrics.value = { hits: 0, misses: 0, evictions: 0 }
  }
}
</script>
