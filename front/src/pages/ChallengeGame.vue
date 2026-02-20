<script setup lang="ts">
import { useChapterData } from '@/composables/useChapter'
import FooterChallenge from '@/components/footer/FooterChallenge.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ChallengeInstruction from '@/components/challenge/ChallengeInstruction.vue'
import ChallengeInfo from '@/components/challenge/ChallengeInfo.vue'
import ChallengeCards from '@/components/challenge/ChallengeCards.vue'
import { ref } from 'vue'

const { chapterData, chapterStats, isLoadingChapter } = useChapterData()

const showInstruction = ref(true)
</script>

<template>
  <PagesLoader v-if="isLoadingChapter" />
  <section class="challenge">
    <ChallengeInfo :chapterStats="chapterStats" />
    <div class="challenge-game">
      <ChallengeInstruction
        :chapterData="chapterData"
        :chapterStats="chapterStats"
        v-model:showInstruction="showInstruction"
      />
      <ChallengeCards :showInstruction="showInstruction" />
    </div>
  </section>
  <FooterChallenge />
</template>
