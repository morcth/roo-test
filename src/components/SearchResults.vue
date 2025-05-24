<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSearchStore } from '../stores/search'
import type { CacheMetrics } from '../lib/cache'

const store = useSearchStore()
const currentPage = ref(1)
const itemsPerPage = 10

const props = defineProps<{
  results: string[]
  metrics: CacheMetrics
}>()

const filteredResults = computed(() => {
  const searchTerm = store.input.toLowerCase()
  const filtered = props.results.filter((r) => r.toLowerCase() !== searchTerm)
  return filtered
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredResults.value.slice(start, end)
})

const hasResults = computed(() => filteredResults.value.length > 0)

const showPagination = computed(() => filteredResults.value.length > itemsPerPage)
</script>

<template>
  <div id="search-results" aria-live="off" role="list">
    <div v-if="store.isLoading" class="loading">Loading...</div>
    <div class="metrics" v-if="metrics" data-testid="cache-metrics">
      Cache hits: {{ metrics?.hits || 0 }} | Misses: {{ metrics?.misses || 0 }}
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="hasResults">
        <h3>Results:</h3>
        <ul>
          <li v-for="result in paginatedResults" :key="result" aria-selected="false">
            {{ result }}
          </li>
        </ul>
      </div>
      <div v-else>No results found</div>
    </transition>
    <div class="pagination pagination-controls" v-if="showPagination">
      <button @click="currentPage--" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage * itemsPerPage >= filteredResults.length"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
#search-results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f8f8;
  color: #333;
  justify-items: start;
  width: 100%;
}

@media (min-width: 768px) {
  #search-results {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading {
  padding: 1rem;
  text-align: center;
  color: #333;
  grid-column: 1 / -1;
}

.metrics {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #333;
  grid-column: 1 / -1;
}

ul {
  grid-column: 1 / -1;
  width: 100%;
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.75rem 1.25rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  color: #333;
  transition: all 0.2s ease;
  cursor: pointer;
}

li:hover {
  background-color: #f0f7ff;
  border-color: #b8d8ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  grid-column: 1 / -1;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f7ff;
  border-color: #b8d8ff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
