<script setup lang="ts">
import next from '@/assets/img/next.svg'
import { langStore } from '@/stores/lang.store'
import retry from '@/assets/img/retry.svg'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'
import { useChapterData } from '@/composables/useChapter'

const { chapterStats } = useChapterData()

const { reset } = useChallengeChecker()
const { finishChallenge } = useFinishChallenge()
</script>

<template>
  <div class="challenge-error-container">
    <div class="challenge-error-content">
      <p class="error-title">
        {{ langStore.t('static-text.BoardScene.boardscene-scene-loosebanner-text') }}
      </p>

      <div class="buttons">
        <button class="retry-button" @click="reset">
          <img :src="retry" alt="Retry" />
          {{ langStore.t('static-text.BoardScene.boardscene-scene-retrybutton-text') }}
        </button>

        <button
          v-if="
            chapterStats &&
            parseInt(chapterStats.lastChallengeId) < parseInt(chapterStats.maxChallengeCount)
          "
          class="next-button"
          @click="finishChallenge(0)"
        >
          <img :src="next" alt="Next" />
          {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
        </button>
      </div>
    </div>
  </div>
</template>
