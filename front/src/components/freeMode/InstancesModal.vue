<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { computed, onMounted, watchEffect } from 'vue'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'
import { useChapterInstances } from '@/composables/useChapterInstances'
import type { CardInstances } from '@/types/card/cardInfo'
import PagesLoader from '../loader/PagesLoader.vue'

const props = defineProps<{
  open: boolean
  selected: {
    id: string
    title: string
    label: string
    img: string
  }
  selectedOntology: string
}>()

const emit = defineEmits(['update:open', 'update:selected'])
const { loadInstances, chapterInstances, imgInstanceURL, isInstancesLoading } =
  useChapterInstances()

const sortScenarios = computed(() => {
  return scenarioCatalog.scenarii.filter((s) => s.ontologyTags.includes(props.selectedOntology))
})

const updateInstancesList = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value

  let language = scenarioCatalog.scenarii.find((s) => s['scenario-title'] === value)?.languageTag
  language = language === 'Français' ? 'fr' : 'en'

  loadInstances(props.selectedOntology, value, language)
}

const isUrl = (str: string) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

const selectInstance = (instance: CardInstances) => {
  emit('update:selected', {
    Id: instance.Id,
    Title: instance.Title,
    Label: instance.Label,
    ImageName: imgInstanceURL.value + instance.ImageName,
  })
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <div class="modal-content">
      <div class="ontology-filter">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-text') }}
        </h3>
        <div class="selection">
          <div class="choose-scenario">
            <select id="scenario" name="scenario" @change="updateInstancesList" required>
              <optgroup>
                <option value="">
                  {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-available') }}
                </option>
              </optgroup>
              <option
                v-for="(scenario, index) in sortScenarios"
                :key="index"
                :value="scenario['scenario-title']"
              >
                {{ scenario['scenario-title'] }}
              </option>
            </select>
          </div>
        </div>
        <PagesLoader v-if="isInstancesLoading" />
        <div v-else class="instances content-cards">
          <ul class="carousel-container" v-for="instance in chapterInstances" :key="instance.Id">
            <li class="instance-card" @click="selectInstance(instance)">
              <div class="instance card-name">
                <span class="instance prefix">{{ instance.Id }}</span>
                <span class="instance name">{{ instance.Title }}</span>
              </div>
              <a
                v-if="isUrl(instance.Label)"
                class="instance link"
                :href="instance.Label"
                target="_blank"
              >
                {{ instance.Label }}
              </a>
              <span v-else class="instance label">{{ instance.Label }}</span>
              <img :src="`${imgInstanceURL}${instance.ImageName}`" :alt="instance.Title" />
            </li>
          </ul>
        </div>
      </div>
      <button @click="!open">Close</button>
    </div>
  </div>
</template>
