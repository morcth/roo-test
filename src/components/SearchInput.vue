<script setup lang="ts">
import { useSearchStore } from '../stores/search'
import ValidationService from '../lib/validation'
import { ref } from 'vue'

const searchQuery = defineModel<string>('searchQuery')
const emit = defineEmits<{
  (e: 'input'): void
  (e: 'results', value: string): void
}>()
const store = useSearchStore()
const isInvalid = ref(false)
const errorMessage = ref('')
function handleInput(event: Event) {
  console.log('Input event:', event.type, 'Value:', searchQuery.value)
  processInput()
}

function handleComposition(event: CompositionEvent) {
  console.log('Composition event:', event.type, 'Value:', searchQuery.value)
  if (event.type === 'compositionend') {
    processInput()
  }
}

function handleChange() {
  console.log('Change event. Value:', searchQuery.value)
  processInput()
}

function processInput() {
  const value = searchQuery.value
  if (!value) {
    isInvalid.value = false
    return
  }

  const validation = new ValidationService()
  const charCheck = validation.validateChars(value)
  isInvalid.value = !charCheck.valid
  errorMessage.value = charCheck.message

  if (charCheck.valid) {
    const lengthCheck = validation.validateLength(value)
    if (lengthCheck.valid) {
      store.setInput(value)
      emit('input')
      emit('results', value)
    }
  }
}
</script>

<template>
  <div class="search-container">
    <label for="search-input" class="sr-only">Search</label>
    <input
      id="search-input"
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      @compositionstart="handleComposition"
      @compositionend="handleComposition"
      @change="handleChange"
      aria-label="Search"
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? 'error-message' : undefined"
      data-testid="search-input"
      class="search-input"
    />
    <transition name="fade">
      <div
        v-if="isInvalid"
        id="error-message"
        role="alert"
        aria-live="assertive"
        data-testid="error-message"
        class="error-message"
      >
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.search-container {
  margin: 1rem 0;
}

.search-input {
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}
</style>
