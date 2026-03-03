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
}>()

const emit = defineEmits<{
  (e: 'update:showInstruction', value: boolean): void
}>()

const firstText = computed(() => splitStatement(props.chapterData?.Statement).after)
const secondText = computed(() => splitStatement(props.chapterData?.Statement).after)
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
      <button class="hint">
        <img title="hint" :src="hint" class="hint-icon" />
      </button>
      <button class="solution">
        <img title="solution" :src="answer" class="solution-icon" />
      </button>
      <!-- <button>
        <img title="hint" :src="hint" class="hint-icon" />{{
          langStore.t('static-text.BoardScene.boardscene-scene-gethint-text')
        }}
      </button>
      <button>
        <img title="solution" :src="answer" class="solution-icon" />{{
          langStore.t('static-text.BoardScene.boardscene-scene-getanswer-text')
        }}
      </button> -->
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
    <button class="hint">
      <img
        :title="langStore.t('static-text.BoardScene.boardscene-scene-gethint-text')"
        :src="hint"
        class="hint-icon"
      />
    </button>
    <button class="solution">
      <img
        :title="langStore.t('static-text.BoardScene.boardscene-scene-getanswer-text')"
        :src="answer"
        class="solution-icon"
      />
    </button>
  </div>
</template>
