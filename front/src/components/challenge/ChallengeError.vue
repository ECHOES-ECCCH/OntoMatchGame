<script setup lang="ts">
import next from '@/assets/img/next.svg'
import { langStore } from '@/stores/lang.store'
import retry from '@/assets/img/retry.svg'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'

const { reset } = useChallengeChecker()
const { finishChallenge } = useFinishChallenge()
</script>

<template>
  <div class="challenge-completed-container">
    <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-loosebanner-text') }}</p>
    <button @click="reset">
      <img :src="retry" alt="Retry" />{{
        langStore.t('static-text.BoardScene.boardscene-scene-retrybutton-text')
      }}
    </button>
    <div class="challenge-completed-content">
      <button class="next-challenge" @click="finishChallenge(0)">
        <img :src="next" alt="Next" />{{
          langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text')
        }}
      </button>
    </div>
  </div>
</template>
