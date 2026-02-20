<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import type { ChapterStats } from '@/types/chapter'

defineProps<{
  chapterStats: ChapterStats | null
}>()
</script>

<template>
  <div class="chapter-info">
    <div>
      <h2>{{ langStore.t('static-text.BoardScene.boardscene-scene-challenge-text') }}</h2>
      <span>{{ chapterStats?.scenarioName }}</span>
      <span>{{ chapterStats?.chapterName }}</span>
    </div>
    <div class="challenge-score">
      <span>Score</span>
      <span>{{ chapterStats?.score }} / {{ chapterStats?.maxPossibleScore }}</span>
    </div>
  </div>
</template>
