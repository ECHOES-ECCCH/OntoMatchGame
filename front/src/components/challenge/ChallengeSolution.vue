<script setup lang="ts">
import next from '@/assets/img/next.svg'
import { langStore } from '@/stores/lang.store'
import { useChapterData } from '@/composables/useChapter'

const { chapterStats } = useChapterData()
</script>

<template>
  <div class="challenge-error-container">
    <div class="challenge-error-content">
      <button
        v-if="
          chapterStats &&
          parseInt(chapterStats.lastChallengeId) < parseInt(chapterStats.maxChallengeCount)
        "
        class="next-button"
      >
        <img :src="next" alt="Next" />
        {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
      </button>
    </div>
  </div>
</template>
