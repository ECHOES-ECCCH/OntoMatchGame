<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { langStore } from '@/stores/lang.store'
import MainFooter from '@/components/MainFooter.vue'
import ScenarioAccordion from '@/components/GameSelection/ScenarioAccordion.vue'
import ScenarioFilter from '@/components/GameSelection/ScenarioFilter.vue'
import { selectedFilters } from '@/utils/game-selection-filters'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'
import { ref, watch } from 'vue'

const scenarii = scenarioCatalog.scenarii ?? []

const filteredScenarii = ref(scenarii)

watch(
  () => selectedFilters.value,
  (newFilters) => {
    filteredScenarii.value = scenarii.filter(
      (s) =>
        newFilters.language.some((filter) => s.languageTag === filter.name && filter.selected) &&
        s.domainCodes.some((tag) =>
          newFilters.theme.some((filter) => tag === filter.domainCodes && filter.selected),
        ),
    )

    // filteredScenarii.value = scenarii.filter((s) =>
    //   newFilters.language.some((filter) => s.languageTag === filter.name && filter.selected),
    // )

    console.log('filtre', newFilters.language)

    console.log('filteredScenarii', filteredScenarii)
  },
  { deep: true },
)

console.log('scenarii', scenarii)
console.log(selectedFilters.value)
</script>

<template>
  <MainHeader />
  <section>
    <ScenarioFilter />
    <div>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-listofscenarii-label') }}
      <ScenarioAccordion :scenario="filteredScenarii" />
    </div>
  </section>
  <MainFooter />
</template>
