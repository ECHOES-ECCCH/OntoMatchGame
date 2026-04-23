<script setup lang="ts">
import { computed } from 'vue'
import type { ChapterData, ChapterStats } from '@/types/chapter'
import info from '@/assets/img/info.svg'
import hint from '@/assets/img/hint.svg'
import answer from '@/assets/img/answer.svg'
import closeMenu from '@/assets/img/close-arrow.svg'
import { splitStatement } from '@/utils/statement'
import { langStore } from '@/stores/lang.store'
import { useSolution } from '@/composables/useSolution'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'

const { showSolution, frozenStats, displaySolution } = useSolution()
const { finishChallenge } = useFinishChallenge()

const props = defineProps<{
  chapterData: ChapterData | null
  chapterStats: ChapterStats
  showInstruction: boolean
  showExplanation: boolean
}>()
const emit = defineEmits<{
  (e: 'update:showInstruction', value: boolean): void
  (e: 'update:showExplanation', value: boolean): void
}>()

const firstText = computed(() => splitStatement(props.chapterData?.Statement).before)
const secondText = computed(() => splitStatement(props.chapterData?.Statement).after)

const handleDisplaySolution = () => {
  displaySolution(props.chapterStats)
  finishChallenge(0)
}
</script>

<template>
  <div class="challenge-instructions" :class="{ 'hide-challenge-instructions': !showInstruction }">
    <div class="instruction-window">
      <div class="instructions">
        <div class="chapter-progress">
          <h3>{{ chapterData?.Title }}</h3>
          <span>
            {{ (showSolution ? frozenStats : chapterStats)?.lastChallengeId }} /
            {{ (showSolution ? frozenStats : chapterStats)?.maxChallengeCount }}
          </span>
        </div>

        <p>{{ chapterData?.Explanation }}</p>
        <p>{{ firstText }}</p>
        <p>{{ secondText }}</p>
      </div>

      <div
        class="instructions-title"
        @click="emit('update:showInstruction', !props.showInstruction)"
      >
        <img :src="closeMenu" />
      </div>
    </div>

    <div class="instruction-help">
      <button
        v-if="chapterData?.Explanation"
        @click="emit('update:showExplanation', !props.showExplanation)"
        class="hint-window"
      >
        <img :src="hint" class="hint-icon" />
        <span>{{ langStore.t('static-text.BoardScene.boardscene-scene-gethint-text') }}</span>
      </button>

      <button v-if="!showSolution" @click="handleDisplaySolution" class="solution-window">
        <img :src="answer" class="solution-icon" />
        <span>{{ langStore.t('static-text.BoardScene.boardscene-scene-getanswer-text') }}</span>
      </button>
    </div>
  </div>

  <!-- Boutons quand fermé -->
  <div v-if="!showInstruction" class="hide-instructions-title">
    <span>
      {{ (showSolution ? frozenStats : chapterStats)?.lastChallengeId }} /
      {{ (showSolution ? frozenStats : chapterStats)?.maxChallengeCount }}
    </span>
    <button @click="emit('update:showInstruction', true)" class="detail">
      <img :src="info" class="info-icon" />
    </button>
    <button
      v-if="chapterData?.Explanation"
      @click="emit('update:showExplanation', !props.showExplanation)"
      class="hint"
    >
      <img :src="hint" class="hint-icon" />
    </button>

    <button v-if="!showSolution" @click="handleDisplaySolution" class="solution">
      <img :src="answer" class="solution-icon" />
    </button>
  </div>
</template>
