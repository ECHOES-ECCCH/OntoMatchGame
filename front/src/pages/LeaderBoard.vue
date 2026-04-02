<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { onMounted, ref } from 'vue'
import { leaderboard, isLeaderboardLoading, fetchRanking } from '@/composables/useLeaderboard'
import LeaderBoardAccordion from '@/components/leaderBoard/leaderBoardAccordion.vue'
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
    <div class="leaderboard-toggle">
      <button
        :class="selectedLanguageScenario === 'fr' && 'active'"
        class="leaderboard-french"
        @click="selectedLanguageScenario = 'fr'"
      >
        {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-frenchbutton-label') }}
      </button>
      <button
        :class="selectedLanguageScenario === 'en' && 'active'"
        class="leaderbord-toggle"
        @click="selectedLanguageScenario = 'en'"
      >
        {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-englishbutton-label') }}
      </button>
    </div>
    <LeaderBoardAccordion
      v-show="selectedLanguageScenario === 'fr'"
      :leaderboard="leaderboard.languages[0]"
    />
    <LeaderBoardAccordion
      v-show="selectedLanguageScenario === 'en'"
      :leaderboard="leaderboard?.languages?.[1]"
    />
  </section>
</template>
