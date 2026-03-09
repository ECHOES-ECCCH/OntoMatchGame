<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChapterData, ChapterStats } from '@/types/chapter'
import info from '@/assets/img/info.svg'
import hint from '@/assets/img/hint.svg'
import answer from '@/assets/img/answer.svg'
import { splitStatement } from '@/utils/statement'
import closeMenu from '@/assets/img/close-arrow.svg'
import { langStore } from '@/stores/lang.store'

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

const displaySolution = () => {
  console.log('test')
}
</script>

<template>
  <div
    v-if="showInstruction"
    class="challenge-instructions"
    :class="showInstruction ? 'challenge-instructions' : 'hide-challenge-instructions'"
  >
    <div class="instruction-window">
      <div class="instructions">
        <div class="chapter-progress">
          <h3>{{ chapterData?.Title }}</h3>
          <span>{{ chapterStats.lastChallengeId }} / {{ chapterStats.maxChallengeCount }}</span>
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
        <img title="hint" :src="hint" class="hint-icon" />
        <span>{{ langStore.t('static-text.BoardScene.boardscene-scene-gethint-text') }}</span>
      </button>
      <button class="solution-window">
        <img title="solution" :src="answer" class="solution-icon" />
        <span>{{ langStore.t('static-text.BoardScene.boardscene-scene-getanswer-text') }}</span>
      </button>
    </div>
  </div>
  <div v-else class="hide-instructions-title">
    <button @click="emit('update:showInstruction', !props.showInstruction)" class="detail">
      <img
        :title="langStore.t('static-text.BoardScene.boardscene-scene-insctruction-text')"
        :src="info"
        class="info-icon"
      />
    </button>
    <button
      v-if="chapterData?.Explanation"
      @click="emit('update:showExplanation', !props.showExplanation)"
      class="hint"
    >
      <img
        :title="langStore.t('static-text.BoardScene.boardscene-scene-gethint-text')"
        :src="hint"
        class="hint-icon"
      />
    </button>
    <button @click="displaySolution" class="solution">
      <img
        :title="langStore.t('static-text.BoardScene.boardscene-scene-getanswer-text')"
        :src="answer"
        class="solution-icon"
      />
    </button>
  </div>
</template>
