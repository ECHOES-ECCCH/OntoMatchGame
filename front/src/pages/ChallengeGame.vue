<script setup lang="ts">
import { useChapterData } from '@/composables/useChapter'
import FooterChallenge from '@/components/footer/FooterChallenge.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ChallengeInstruction from '@/components/challenge/ChallengeInstruction.vue'
import ChallengeInfo from '@/components/challenge/ChallengeInfo.vue'

const { chapterData, chapterStats, isLoadingChapter } = useChapterData()
</script>

<template>
  <PagesLoader v-if="isLoadingChapter" />
  <section v-else>
    <ChallengeInfo :chapterStats="chapterStats" />
    <ChallengeInstruction :chapterData="chapterData" />
  </section>
  <FooterChallenge />
</template>
