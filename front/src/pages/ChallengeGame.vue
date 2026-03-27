<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
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

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()

const { isComplete, reset } = useChallengeChecker()
const { chapterData, chapterStats, chapterInfo, isLoadingChapter } = useChapterData()

const statement = computed(() => splitStatement(chapterData.value?.Statement))
const secondText = computed(() => statement.value.after)

const showInstruction = ref(true)
const showExplanation = ref(false)

onMounted(() => {
  entityDataCards.value = []
  propertyDataCards.value = []

  loadCard()
  reset()
})

const showCompleted = ref(false)

watch(isComplete, (val) => {
  if (val) showCompleted.value = true
})

function closeCompleted() {
  showCompleted.value = false
}
</script>

<template>
  <PagesLoader v-if="isLoadingChapter" />
  <ChallengeCompleted
    v-if="showCompleted"
    :chapterStats="chapterStats"
    :chapterData="chapterData"
    :chapterInfo="chapterInfo"
    @close="closeCompleted"
  />
  <section v-if="chapterData && !isLoadingChapter" class="challenge">
    <ChallengeInfo :chapterStats="chapterStats" />
    <div class="challenge-order" v-if="!showInstruction && secondText">{{ secondText }}</div>
    <div class="challenge-explanation" v-if="showExplanation">{{ chapterData?.Explanation }}</div>
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
  <FooterChallenge :entityDataCards="entityDataCards" :propertyDataCards="propertyDataCards" />
</template>
