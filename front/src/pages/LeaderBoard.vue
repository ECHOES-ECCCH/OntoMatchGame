<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { onMounted, ref } from 'vue'
import { leaderboard, isLeaderboardLoading, fetchRanking } from '@/composables/useLeaderboard'
import LeaderBoardAccordion from '@/components/leaderBoard/LeaderBoardAccordion.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'

const selectedLanguageScenario = ref('fr')

onMounted(() => {
  fetchRanking()
})
</script>

<template>
  <div v-if="isLeaderboardLoading"><PagesLoader /></div>
  <section v-if="leaderboard?.languages" class="leaderboard">
    <h2>{{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-title-text') }}</h2>
    <div class="leaderboard-toggle" :class="{ en: selectedLanguageScenario === 'en' }">
      <div class="slider"></div>

      <button
        :class="{ active: selectedLanguageScenario === 'fr' }"
        @click="selectedLanguageScenario = 'fr'"
      >
        {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-frenchbutton-label') }}
      </button>

      <button
        :class="{ active: selectedLanguageScenario === 'en' }"
        @click="selectedLanguageScenario = 'en'"
      >
        {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-englishbutton-label') }}
      </button>
    </div>
    <LeaderBoardAccordion
      v-if="leaderboard?.languages?.[0]"
      v-show="selectedLanguageScenario === 'fr'"
      :leaderboard="leaderboard.languages[0]"
    />
    <LeaderBoardAccordion
      v-if="leaderboard?.languages?.[1]"
      v-show="selectedLanguageScenario === 'en'"
      :leaderboard="leaderboard?.languages?.[1]"
    />
  </section>
</template>
