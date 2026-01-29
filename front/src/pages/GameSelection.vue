<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { langStore } from '@/stores/lang.store'
import MainFooter from '@/components/MainFooter.vue'
import ScenarioAccordion from '@/components/GameSelection/ScenarioAccordion.vue'
import { computed } from 'vue'
import ScenarioFilter from '@/components/GameSelection/ScenarioFilter.vue'

const scenarii = computed(() => {
  return langStore.scenarioTranslation.value?.scenarii ?? []
})
</script>

<template>
  <MainHeader />
  <section>
    <ScenarioFilter />
    <div>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-listofscenarii-label') }}
      <ScenarioAccordion :scenario="scenarii" />
    </div>
  </section>
  <MainFooter />
</template>
