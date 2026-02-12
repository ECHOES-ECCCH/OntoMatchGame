<script setup lang="ts">
import { useChapterData } from '@/composables/useChapter'
import FooterChallenge from '@/components/footer/FooterChallenge.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ChallengeInstruction from '@/components/challenge/ChallengeInstruction.vue'
import ChallengeInfo from '@/components/challenge/ChallengeInfo.vue'
import ChallengeCards from '@/components/challenge/ChallengeCards.vue'

const { chapterData, chapterStats, isLoadingChapter } = useChapterData()
</script>

<template>
  <PagesLoader v-if="isLoadingChapter" />
  <section>
    <ChallengeInfo :chapterStats="chapterStats" />
    <ChallengeInstruction :chapterData="chapterData" />
    <ChallengeCards />
  </section>
  <FooterChallenge />
</template>
