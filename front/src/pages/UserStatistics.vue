<script setup lang="ts">
import { computed } from 'vue'
import { langStore } from '@/stores/lang.store'
import StatisticsAccordion from '@/components/statistics/StatisticsAccordion.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import { userStats, isUsersStatsLoading } from '@/composables/useUserStats'
import MainFooter from '@/components/footer/MainFooter.vue'

const globalTotals = computed(() => {
  return userStats.value.reduce(
    (acc, item) => {
      acc.totalScore += Number(item.score)
      acc.totalMaxScore += Number(item.maxPossibleScore)
      return acc
    },
    { totalScore: 0, totalMaxScore: 0 },
  )
})

const globalPercentage = computed(() => {
  const all = userStats.value

  let totalProgress = 0
  let count = 0

  for (const item of all) {
    const max = Number(item.maxChallengeCount || 0)
    const last = Number(item.lastChallengeId || 0)

    if (max > 0) {
      totalProgress += Math.min(last / max, 1)
      count++
    }
  }

  return count > 0 ? Math.round((totalProgress / count) * 100) : 0
})
</script>

<template>
  <section class="statistics">
    <div v-if="isUsersStatsLoading"><PagesLoader /></div>
    <div v-else class="statistics-container">
      <div class="statistics-header">
        <div>
          <h2>{{ langStore.t('static-text.StatsScene.statsscene-scene-title-text') }}</h2>
          <h3>
            {{ langStore.t('static-text.StatsScene.statsscene-scene-listscenariolabel-text') }}
          </h3>
        </div>
        <div class="statistics-total">
          <p>{{ langStore.t('static-text.StatsScene.statsscene-scene-grandtotallabel-text') }}</p>
          <div class="total-progression">
            <div class="progression">
              <p>
                {{ langStore.t('static-text.StatsScene.statsscene-scene-progressionlabel-text') }}
              </p>
              <span>{{ globalPercentage }}%</span>
            </div>
            <div class="score">
              <p>{{ langStore.t('static-text.StatsScene.statsscene-scene-scorelabel-text') }}</p>
              <span>{{ globalTotals.totalScore }} / {{ globalTotals.totalMaxScore }}</span>
            </div>
          </div>
        </div>
      </div>
      <StatisticsAccordion :userStats="userStats" />
    </div>
  </section>
  <MainFooter />
</template>
