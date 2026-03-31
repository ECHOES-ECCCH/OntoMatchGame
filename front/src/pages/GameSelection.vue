<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import MainFooter from '@/components/footer/MainFooter.vue'
import ScenarioAccordion from '@/components/gameSelection/ScenarioAccordion.vue'
import ScenarioFilter from '@/components/gameSelection/ScenarioFilter.vue'
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
        s.domainCodes.some((tag) =>
          newFilters.theme.some((filter) => filter.selected && filter.domainCodes.includes(tag)),
        ) &&
        newFilters.language.some((filter) => filter.selected && s.languageTag === filter.language),
    )
  },
  { deep: true },
)
</script>

<template>
  <section class="game-selection">
    <h2>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-title-text') }}
    </h2>
    <div class="game-selection-container">
      <ScenarioFilter />
      <div class="scenario-accordion">
        <h3>
          {{
            langStore.t('static-text.GameSelectionScene.gameselection-scene-listofscenarii-label')
          }}
        </h3>
        <ScenarioAccordion v-if="filteredScenarii.length" :scenario="filteredScenarii" />
        <div v-else>
          {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-noscenario-text') }}
        </div>
      </div>
    </div>
  </section>
  <MainFooter />
</template>
