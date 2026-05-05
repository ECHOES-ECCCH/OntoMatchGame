<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import type { ChapterStats } from '@/types/chapter'
import { onMounted, ref } from 'vue'

defineProps<{
  chapterStats: ChapterStats | null
}>()

const target = ref<HTMLElement | null>(null)

onMounted(() => {
  target.value?.scrollIntoView({ behavior: 'smooth' })
})
</script>

<template>
  <div ref="target" class="chapter-info">
    <h2>{{ langStore.t('static-text.BoardScene.boardscene-scene-challenge-text') }}</h2>
    <div>
      <span class="ontology-name">{{ chapterStats?.ontologyName }}</span>
      <div class="chapter-title">
        <span class="scenario-name">{{ chapterStats?.scenarioName }}</span>
        <span class="chapter-name">{{ chapterStats?.chapterName }}</span>
      </div>
    </div>
    <div class="challenge-score">
      <span>Score</span>
      <span>{{ chapterStats?.score }} / {{ chapterStats?.maxPossibleScore }}</span>
    </div>
  </div>
  <hr />
</template>
