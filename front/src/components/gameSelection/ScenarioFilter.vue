<script setup lang="ts">
import { watch } from 'vue'
import { langStore } from '@/stores/lang.store'
import { domainLabels, selectedDomains, allDomainCodes } from '@/utils/game-selection-filters'
import OntologieFilter from './OntologieFilter.vue'

defineProps<{
  scenarii: object
}>()

watch(allDomainCodes, (codes) => {
  selectedDomains.value = [...codes]
})
</script>

<template>
  <aside>
    <OntologieFilter :scenarii="scenarii" />
    <div class="theme-filter">
      <h3>{{ langStore.t('static-text.GameSelectionScene.gameselection-scene-domain-label') }}</h3>
      <hr />
      <ul>
        <li v-for="code in allDomainCodes" :key="code">
          <input type="checkbox" :id="code" :value="code" v-model="selectedDomains" />
          <label :for="code">
            {{ domainLabels[code] ?? code }}
          </label>
        </li>
      </ul>
    </div>
    <!--  <div class="language-filter">
      <h3>
        {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-language-label') }}
      </h3>
      <hr />
      <ul v-for="(filter, i) in selectedFilters.language" :key="i">
        <li>
          <input
            type="checkbox"
            :id="filter.name"
            :checked="filter.selected"
            @change="handleSelectedFilters('language', filter.name, !filter.selected)"
          />
          <label :for="filter.name">{{ filter.name }}</label>
        </li>
      </ul>
    </div> -->
  </aside>
</template>
