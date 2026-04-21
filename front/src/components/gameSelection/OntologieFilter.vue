<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { selectedOntology } from '@/utils/game-selection-filters'
import { computed, watchEffect } from 'vue'

const props = defineProps<{
  scenarii: object
}>()

const uniqueOntologyTags = computed(() => {
  return [...new Set(props.scenarii.flatMap((s) => s.ontologyTags || []))].sort()
})

// watchEffect(() => {
//   const tags = uniqueOntologyTags.value

//   if (tags.length && !selectedOntology.value) {
//     selectedOntology.value = tags.includes('CIDOC CRM') ? 'CIDOC CRM' : tags[0]
//   }
// })
</script>

<template>
  <div class="language-filter">
    <h3>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-ontology-label') }}
    </h3>
    <hr />
    <ul>
      <li v-for="(tag, i) in uniqueOntologyTags" :key="i">
        <input type="radio" :id="tag" name="ontology" :value="tag" v-model="selectedOntology" />
        <label :for="tag">{{ tag }}</label>
      </li>
    </ul>
  </div>
</template>
