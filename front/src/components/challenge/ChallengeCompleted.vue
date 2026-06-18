<script setup lang="ts">
import { ref, onMounted } from 'vue'
import next from '@/assets/img/next.svg'
import { langStore } from '@/stores/lang.store'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'
import type { ChapterData, ChapterStats } from '@/types/chapter'

const props = defineProps<{
  chapterStats: ChapterStats | null
  chapterData: ChapterData | null
}>()

const emit = defineEmits(['close'])

const { finishChallenge } = useFinishChallenge()

const isLastChallenge =
  Number(props.chapterStats?.lastChallengeId) === Number(props.chapterStats?.maxChallengeCount)

onMounted(() => {
  if (!isLastChallenge) {
    interval = setInterval(() => {
      if (countdown.value > 0) countdown.value--
    }, 1000)
    timeout = setTimeout(handleFinish, 5000)
  }
})

const countdown = ref(5)
let interval: ReturnType<typeof setInterval>
let timeout: ReturnType<typeof setTimeout>

async function handleFinish() {
  clearInterval(interval)
  clearTimeout(timeout)
  emit('close')
  await finishChallenge(parseInt(String(props.chapterData?.Score ?? 0), 10))
}
</script>

<template>
  <div class="challenge-completed-container">
    <div v-if="isLastChallenge" class="challenge-completed-content">
      <p>🎉 {{ langStore.t('static-text.BoardScene.boardscene-scene-chapter-completed') }} !</p>

      <div class="score-container">
        <p class="title-score">Score</p>
        <span class="score">
          {{ parseInt(String(chapterStats?.score ?? 0), 10) + (chapterData?.Score ?? 0) }}
        </span>
      </div>
      <router-link
        :to="{
          path: '/game-selection',
        }"
      >
        <button>
          {{ langStore.t('static-text.BoardScene.boardscene-scene-change-chapter') }}
        </button>
      </router-link>
    </div>
    <div v-else class="challenge-completed-content">
      <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-winbanner-text') }}</p>
      <div class="score-container">
        <p class="title-score">Score</p>
        <span class="score">
          {{ parseInt(String(chapterStats?.score ?? 0), 10) + (chapterData?.Score ?? 0) }}
        </span>
      </div>
      <div class="next-challenge-title">
        Prochain défi dans...
        <p class="countdown">
          <span class="countdown-center">{{ countdown }}</span>
        </p>
      </div>
      <button class="next-button" @click="handleFinish">
        <img :src="next" alt="Next" />
        {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
      </button>
    </div>
  </div>
</template>
