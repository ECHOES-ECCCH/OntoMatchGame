<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { ref } from 'vue'

const filters = ref({
  theme: [
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicarcheology-text'),
      selected: true,
    },
    {
      name: langStore.t(
        'static-text.GameSelectionScene.gameselection-scene-topicarchitecture-text',
      ),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicarchive-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicart-text'),
      selected: true,
    },
    {
      name: langStore.t(
        'static-text.GameSelectionScene.gameselection-scene-topicconservation-text',
      ),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicethnology-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topichistory-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topiclinguistic-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicliterature-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicoldbook-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicmuseum-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicmusicology-text'),
      selected: true,
    },
  ],
  language: [
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-language2-text'),
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-language1-text'),
      selected: true,
    },
  ],
})

const handleSelectedFilters = (category: 'theme' | 'language', name: string, selected: boolean) => {
  const target = filters.value[category].find((f) => f.name === name)

  if (target) {
    target.selected = selected
  }
}
</script>

<template>
  <aside>
    <div>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-domain-label') }}
      <ul v-for="(filter, i) in filters.theme" :key="i">
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
      <ul v-for="(filter, i) in filters.language" :key="i">
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
