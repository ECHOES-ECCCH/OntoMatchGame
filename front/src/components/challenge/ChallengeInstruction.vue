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

  const marker = 'Pour ce défi'
  // const marker = 'For this challenge'

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
    <div v-if="showInstruction" class="instructions">
      {{ console.log(chapterData) }}

      <div class="chapter-progress">
        <p>{{ chapterData?.Title }}</p>
        <span>{{ chapterStats.lastChallengeId }} / {{ chapterStats.maxChallengeCount }}</span>
      </div>
      <p>{{ chapterData?.Explanation }}</p>
      <p>{{ firstText }} {{ secondText }}</p>
    </div>
    <div class="instructions-title" @click="emit('update:showInstruction', !props.showInstruction)">
      <
    </div>
  </div>
</template>
