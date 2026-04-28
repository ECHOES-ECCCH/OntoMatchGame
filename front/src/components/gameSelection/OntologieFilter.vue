<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { computed, onMounted, watchEffect } from 'vue'

import scenarioCatalog from '@/assets/json/scenariiCatalog.json'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const scenarii = scenarioCatalog.scenarii ?? []

const uniqueOntologyTags = computed(() => {
  return [...new Set(scenarii.flatMap((s) => s.ontologyTags || []))].sort()
})

function updateValue(value: string) {
  emit('update:modelValue', value)
}

// watchEffect(() => {
//   const tags = uniqueOntologyTags.value

//   if (tags.length && !selectedOntology.value) {
//     selectedOntology.value = tags.includes('CIDOC CRM') ? 'CIDOC CRM' : tags[0]
//   }
// })
</script>

<template>
  <div class="ontology-filter">
    <h3>
      {{ langStore.t('static-text.GameSelectionScene.gameselection-scene-ontology-label') }}
    </h3>
    <hr />
    <ul>
      <li v-for="(tag, i) in uniqueOntologyTags" :key="i">
        <input
          type="radio"
          :id="tag"
          name="ontology"
          :value="tag"
          :checked="tag === modelValue"
          @change="updateValue(tag)"
        />
        <label :for="tag">{{ tag }}</label>
      </li>
    </ul>
  </div>
</template>
