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
import { selectedOntology } from '@/utils/game-selection-filters'

/**
 * When the available domain codes change,
 * we automatically select all domains.
 *
 * ⚠️ This enforces a "select all by default" behavior.
 * Be careful: it can override user choices.
 */
watch(allDomainCodes, (codes) => {
  selectedDomains.value = [...codes]
})
</script>

<template>
  <aside>
    <OntologieFilter v-model="selectedOntology" />
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
