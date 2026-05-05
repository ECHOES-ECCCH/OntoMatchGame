<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { langStore } from '@/stores/lang.store'
import StatisticsAccordion from '@/components/statistics/StatisticsAccordion.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import MainFooter from '@/components/footer/MainFooter.vue'
import { userStats, isUsersStatsLoading } from '@/composables/useUserStats'
import stats from '@/assets/img/stats.svg'
import OntologieFilter from '@/components/gameSelection/OntologieFilter.vue'

const selectedOntology = ref('')

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

const filteredStats = computed(() => {
  if (!selectedOntology.value) return userStats.value

  return userStats.value.filter(
    (item) =>
      item.ontologyName?.toLowerCase().trim() === selectedOntology.value.toLowerCase().trim(),
  )
})

// Filtre ontologie
watch(
  userStats,
  (newStats) => {
    if (!newStats.length) return

    const stillExists = newStats.some((item) => item.ontologyName === selectedOntology.value)

    if (!stillExists) {
      selectedOntology.value = newStats[0].ontologyName
    }
  },
  { immediate: true },
)
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
          <div class="statistics-title">
            <img :src="stats" />
            <p>{{ langStore.t('static-text.StatsScene.statsscene-scene-grandtotallabel-text') }}</p>
          </div>
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
      <div class="statistics-content">
        <aside><OntologieFilter v-model="selectedOntology" /></aside>
        <StatisticsAccordion :userStats="filteredStats" />
      </div>
    </div>
  </section>
  <MainFooter />
</template>
