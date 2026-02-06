<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import type { ChapterStats } from '@/types/chapter'

defineProps<{
  chapterStats: ChapterStats | null
}>()
</script>

<template>
  <div class="chapter-info">
    <h2>{{ langStore.t('static-text.BoardScene.boardscene-scene-challenge-text') }}</h2>
    <div>{{ chapterStats?.scenarioName }} {{ chapterStats?.chapterName }}</div>
    <div>Score {{ chapterStats?.score }} / {{ chapterStats?.maxPossibleScore }}</div>
  </div>
</template>
