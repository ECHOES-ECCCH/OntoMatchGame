<script setup lang="ts">
import { watch } from 'vue'
import { langStore } from '@/stores/lang.store'
import {
  domainLabels,
  selectedDomains,
  allDomainCodes,
  allLanguages,
  selectedLanguages,
} from '@/utils/game-selection-filters'
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
            {{ domainLabels[code as keyof typeof domainLabels] ?? code }}
          </label>
        </li>
      </ul>
    </div>
    <div class="language-filter">
      <h3>
        {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-language-label') }}
      </h3>
      <hr />
      <ul>
        <li v-for="lang in allLanguages" :key="lang">
          <input type="checkbox" :id="lang" :value="lang" v-model="selectedLanguages" />
          <label :for="lang">{{ lang }}</label>
        </li>
      </ul>
    </div>
  </aside>
</template>
