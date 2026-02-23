<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChapterData, ChapterStats } from '@/types/chapter'

const props = defineProps<{
  chapterData: ChapterData | null
  chapterStats: ChapterStats
  showInstruction: boolean
}>()

const emit = defineEmits<{
  (e: 'update:showInstruction', value: boolean): void
}>()

const statement = computed(() => {
  const statement = props.chapterData?.Statement
  if (!statement) return { before: '', after: '' }

  const markers = ['Pour ce défi', 'For this challenge', 'Find classes and properties']

  let firstIndex = -1

  markers.forEach((marker) => {
    const index = statement.indexOf(marker)
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index
    }
  })

  if (firstIndex === -1) {
    return { before: statement.trim(), after: '' }
  }

  return {
    before: statement.slice(0, firstIndex).trim(),
    after: statement.slice(firstIndex).trim(),
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
    <div v-if="showInstruction" class="instructions">
      <div class="chapter-progress">
        <h3>{{ chapterData?.Title }}</h3>
        <span>{{ chapterStats.lastChallengeId }} / {{ chapterStats.maxChallengeCount }}</span>
      </div>
      <p>{{ chapterData?.Explanation }}</p>
      <p>{{ firstText }}</p>
      <p>{{ secondText }}</p>
    </div>
    <div class="instructions-title" @click="emit('update:showInstruction', !props.showInstruction)">
      <
    </div>
  </div>
</template>
