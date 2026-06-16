<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import FooterChallenge from '@/components/footer/FooterChallenge.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ChallengeInstruction from '@/components/challenge/ChallengeInstruction.vue'
import ChallengeInfo from '@/components/challenge/ChallengeInfo.vue'
import ChallengeCards from '@/components/challenge/ChallengeCards.vue'
import ChallengeCompleted from '@/components/challenge/ChallengeCompleted.vue'
import { splitStatement } from '@/utils/statement'
import { useSelectedXML } from '@/stores/cards.store'
import { showSolution } from '@/composables/useSolution'

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()

const { isComplete, reset } = useChallengeChecker()
const { chapterData, chapterStats, isLoadingChapter } = useChapterData()

const statement = computed(() => splitStatement(chapterData.value?.Statement))
const secondText = computed(() => statement.value.after)

const showInstruction = ref(true)
const showExplanation = ref(false)
const gameRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

/**
 * Reload cards whenever chapter stats change.
 * Avoid reloading when solution mode is active.
 */
watch(
  () => chapterStats.value,
  (stats) => {
    if (!stats) return

    // Do nothing if solution mode is active
    if (showSolution.value) return

    entityDataCards.value = []
    propertyDataCards.value = []

    // Do nothing if solution mode is active
    loadCard(stats.ontologyName)
    reset()
  },
  { immediate: true },
)

/**
 * Indicates whether the completion modal is visible.
 */
const showCompleted = ref(false)

/**
 * Trigger completion modal when challenge is completed.
 */
watch(isComplete, (val) => {
  if (val) showCompleted.value = true
})

/**
 * Closes the completion modal.
 */
function closeCompleted() {
  showCompleted.value = false
}

const toggleFullscreen = async () => {
  const el = gameRef.value
  if (!el) return

  if (!document.fullscreenElement) {
    await el.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

/**
 * Syncs local fullscreen state with browser fullscreen changes.
 */
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <PagesLoader v-if="isLoadingChapter" />
  <div class="challenge-container" ref="gameRef">
    <ChallengeCompleted
      v-if="showCompleted"
      :chapterStats="chapterStats"
      :chapterData="chapterData"
      @close="closeCompleted"
    />
    <section v-if="chapterData && !isLoadingChapter" class="challenge">
      <ChallengeInfo :chapterStats="chapterStats" v-if="!isFullscreen" />

      <div class="challenge-order" v-if="!showInstruction && secondText">{{ secondText }}</div>
      <div class="challenge-explanation" v-if="showExplanation">
        {{ chapterData?.Explanation }}
      </div>
      <div class="challenge-game">
        <ChallengeInstruction
          :chapterData="chapterData"
          :chapterStats="chapterStats"
          v-model:showInstruction="showInstruction"
          v-model:showExplanation="showExplanation"
        />
        <ChallengeCards
          :showInstruction="showInstruction"
          :entityDataCards="entityDataCards"
          :propertyDataCards="propertyDataCards"
          :isDataCardsLoading="isDataCardsLoading"
        />
      </div>
    </section>
    <FooterChallenge
      :entityDataCards="entityDataCards"
      :propertyDataCards="propertyDataCards"
      @toggle-fullscreen="toggleFullscreen"
    />
  </div>
</template>
