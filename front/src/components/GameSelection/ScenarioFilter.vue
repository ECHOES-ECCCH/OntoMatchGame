<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { handleSelectedFilters, selectedFilters } from '@/utils/game-selection-filters'
</script>

<template>
  <aside>
    <div class="theme-filter">
      <h3>{{ langStore.t('static-text.GameSelectionScene.gameselection-scene-domain-label') }}</h3>
      <hr />
      <ul v-for="(filter, i) in selectedFilters.theme" :key="i">
        <li>
          <input
            type="checkbox"
            :id="filter.name"
            :checked="filter.selected"
            @change="handleSelectedFilters('theme', filter.name, !filter.selected)"
          />
          <label :for="filter.name">{{ filter.name }}</label>
        </li>
      </ul>
    </div>
    <div class="language-filter">
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
    </div>
  </aside>
</template>
