<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { handleSelectedFilters, selectedFilters } from '@/utils/game-selection-filters'
</script>

<template>
  <aside>
    <div>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-domain-label') }}
      <ul v-for="(filter, i) in selectedFilters.theme" :key="i">
        <li>
          <input
            type="checkbox"
            :checked="filter.selected"
            @change="handleSelectedFilters('theme', filter.name, !filter.selected)"
          />
          <label>{{ filter.name }}</label>
        </li>
      </ul>
    </div>
    <div>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-language-label') }}
      <ul v-for="(filter, i) in selectedFilters.language" :key="i">
        <li>
          <input
            type="checkbox"
            :checked="filter.selected"
            @change="handleSelectedFilters('language', filter.name, !filter.selected)"
          />
          <label>{{ filter.name }}</label>
        </li>
      </ul>
    </div>
  </aside>
</template>
