<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { computed, onMounted, ref, watch } from 'vue'
import { leaderboard, isLeaderboardLoading, fetchRanking } from '@/composables/useLeaderboard'
import LeaderBoardAccordion from '@/components/leaderBoard/LeaderBoardAccordion.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import MainFooter from '@/components/footer/MainFooter.vue'
import OntologieFilter from '@/components/gameSelection/OntologieFilter.vue'

const selectedLanguageScenario = ref('Français')
const selectedOntology = ref('')

onMounted(() => {
  fetchRanking()
})

const getLanguage = (name: string) =>
  leaderboard.value?.languages?.find((l) => l.languageName === name)

const filterByOntology = (language: ReturnType<typeof getLanguage>) => {
  if (!language) return null
  if (!selectedOntology.value) return language

  return {
    ...language,
    scenarii: {
      scenario: language.scenarii.scenario.filter((s) => s.ontologyName === selectedOntology.value),
    },
  }
}

const frLeaderboard = computed(() => filterByOntology(getLanguage('Français')))
const enLeaderboard = computed(() => filterByOntology(getLanguage('English'))) // à vérifier selon la valeur exacte dans l'API

const availableOntologies = computed(() => {
  const language = getLanguage(selectedLanguageScenario.value)
  return language?.scenarii?.scenario?.map((s) => s.ontologyName) ?? []
})

// Default filtered value
watch(
  availableOntologies,
  (ontologies) => {
    if (!ontologies.length) return

    if (!selectedOntology.value) {
      selectedOntology.value = ontologies[0] ?? ''
      return
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="isLeaderboardLoading"><PagesLoader /></div>
  <section v-else-if="leaderboard?.languages?.length" class="leaderboard">
    <div class="leaderboard-header">
      <h2>{{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-title-text') }}</h2>
      <div class="leaderboard-toggle" :class="{ en: selectedLanguageScenario === 'English' }">
        <div class="slider"></div>
        <button
          :class="{ active: selectedLanguageScenario === 'Français' }"
          @click="selectedLanguageScenario = 'Français'"
        >
          {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-frenchbutton-label') }}
        </button>
        <button
          :class="{ active: selectedLanguageScenario === 'English' }"
          @click="selectedLanguageScenario = 'English'"
        >
          {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-englishbutton-label') }}
        </button>
      </div>
    </div>
    <div class="leaderboard-content">
      <aside>
        <OntologieFilter v-model="selectedOntology" :ontologies="availableOntologies" />
      </aside>
      <LeaderBoardAccordion
        v-if="frLeaderboard"
        v-show="selectedLanguageScenario === 'Français'"
        :leaderboard="frLeaderboard"
      />
      <LeaderBoardAccordion
        v-if="enLeaderboard"
        v-show="selectedLanguageScenario === 'English'"
        :leaderboard="enLeaderboard"
      />
    </div>
  </section>
  <MainFooter />
</template>
