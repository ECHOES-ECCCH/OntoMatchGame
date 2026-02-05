<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import MainHeader from '@/components/MainHeader.vue'
import { useChapterData } from '@/composables/useChapter'
import { computed, ref } from 'vue'
import FooterChallenge from '@/components/footer/FooterChallenge.vue'

const { chapterData, chapterStats } = useChapterData()

const showInstruction = ref(true)

const statement = computed(() => {
  const statement = chapterData.value?.Statement
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

console.log(showInstruction.value)
</script>

<template>
  <MainHeader />
  <div class="chapter-info">
    <h2>{{ langStore.t('static-text.BoardScene.boardscene-scene-challenge-text') }}</h2>
    <div>{{ chapterStats?.scenarioName }} {{ chapterStats?.chapterName }}</div>
    <div>Score {{ chapterStats?.score }} / {{ chapterStats?.maxPossibleScore }}</div>
  </div>
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

  <FooterChallenge />
</template>
