<script setup lang="ts">
import { nextTick } from 'vue'
import { langStore } from '@/stores/lang.store'
import { isUpdateSessionLoading } from '@/services/sessions.service'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'
import { useChapterData } from '@/composables/useChapter'
import { useSolution } from '@/composables/useSolution'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import checkValidation from '@/assets/img/check.svg'
import next from '@/assets/img/next.svg'
import back1 from '@/assets/img/back1.svg'
import PagesLoader from '../loader/PagesLoader.vue'
import fullscreen from '@/assets/img/fullscreen.svg'

const { chapterStats, chapterInfo, loadChapter } = useChapterData()

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
}>()

const { check } = useChallengeChecker()
const { finishChallenge } = useFinishChallenge()
const { showSolution, resetSolution } = useSolution()

const emit = defineEmits(['toggle-fullscreen'])

const handleFullscreen = () => {
  emit('toggle-fullscreen')
}

/**
 * Validates the current challenge by checking
 * the selected cards against the expected solution.
 */
const handleValidation = () => {
  check(props.entityDataCards, props.propertyDataCards)
}

/**
 * Loads the next challenge after displaying the solution.
 * Waits for Vue to update the UI before reloading chapter data.
 */
const handleNextAfterSolution = async () => {
  resetSolution()
  if (!chapterStats.value) return

  // Wait for Vue to apply the state update before loading
  // the next challenge to keep the DOM synchronized.
  await nextTick()

  await loadChapter(
    chapterStats.value.ontologyName,
    chapterStats.value?.chapterName,
    chapterStats.value?.scenarioName,
    chapterStats.value?.lastChallengeId,
    chapterInfo.value,
  )
  resetSolution()
}
</script>

<template>
  <div class="footer">
    <button class="back">
      <img :src="back1" alt="back" />
      <router-link to="/home">
        <span>{{ langStore.t('static-text.Footer.footer-backbutton') }}</span></router-link
      >
    </button>
    <button class="fullscreen-btn" @click="handleFullscreen">
      <img :src="fullscreen" alt="fullscreen" />{{
        langStore.t('static-text.BoardScene.boardscene-scene-footer-fullscreen-text')
      }}
    </button>
    <div class="finish-challenge">
      <button
        v-if="
          showSolution &&
          chapterStats &&
          parseInt(chapterStats?.lastChallengeId) <= parseInt(chapterStats?.maxChallengeCount)
        "
        class="next"
        @click="handleNextAfterSolution"
      >
        <img :src="next" alt="next" />
        {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
      </button>
      <button
        v-else-if="
          chapterStats &&
          parseInt(chapterStats?.lastChallengeId) < parseInt(chapterStats?.maxChallengeCount)
        "
        class="next"
        @click="finishChallenge(0)"
      >
        <img :src="next" alt="next" />
        {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
      </button>
      <PagesLoader v-if="isUpdateSessionLoading" />
      <button :disabled="showSolution" class="validation" v-else @click="handleValidation">
        <img :src="checkValidation" alt="validation" />
        <span>{{
          langStore.t('static-text.BoardScene.boardscene-scene-validatebutton-text')
        }}</span>
      </button>
    </div>
  </div>
</template>
