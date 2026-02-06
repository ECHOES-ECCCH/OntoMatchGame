<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChapterData } from '@/types/chapter'

const props = defineProps<{
  chapterData: ChapterData | null
}>()

const showInstruction = ref(true)

const statement = computed(() => {
  const statement = props.chapterData?.Statement
  if (!statement) return { before: '', after: '' }

  const marker = 'Pour ce défi'
  const index = statement.indexOf(marker)

  return index === -1
    ? { before: statement.trim(), after: '' }
    : {
        before: statement.slice(0, index).trim(),
        after: statement.slice(index).trim(),
      }
})

const firstText = computed(() => statement.value.before)
const secondText = computed(() => statement.value.after)
</script>

<template>
  <div
    class="challenge-instructions"
    :class="showInstruction ? 'challenge-instructions' : 'hide-challenge-instructions'"
  >
    <div class="instructions-title" @click="showInstruction = !showInstruction">
      Instruction et aides ▼
    </div>
    <div v-if="showInstruction" class="instructions">
      <p>{{ chapterData?.Title }}</p>
      <p>{{ chapterData?.Explanation }}</p>
      <p>{{ firstText }} {{ secondText }}</p>
    </div>
  </div>
</template>
