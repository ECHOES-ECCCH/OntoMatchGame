<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'
import PagesLoader from '../loader/PagesLoader.vue'
import close from '@/assets/img/close.svg'
import { langStore } from '@/stores/lang.store'
import type { CardInstances } from '@/types/card/cardInfo'

const props = defineProps<{
  open: boolean
  selectedOntology: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:selected', value: CardInstances): void
}>()

const instances = ref<CardInstances[]>([])
const isLoading = ref(false)

const selectedScenario = ref('')
const searchInstance = ref('')

/**
 * scénarios liés à l'ontology
 */
const sortScenarios = computed(() => {
  return scenarioCatalog.scenarii.filter((s) => s.ontologyTags.includes(props.selectedOntology))
})

/**
 * filtre local des instances
 */

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD') // décompose les accents
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents

const filteredInstances = computed(() => {
  const search = normalizeText(searchInstance.value.trim())

  return instances.value.filter((instance) => {
    const matchScenario = !selectedScenario.value || instance.Scenario === selectedScenario.value

    const title = normalizeText(instance.Title || '')
    const label = normalizeText(instance.Label || '')

    const matchSearch = !search || title.includes(search) || label.includes(search)

    return matchScenario && matchSearch
  })
})

/**
 * charge toutes les instances de tous les scénarios
 */
const loadAllInstances = async () => {
  if (!props.selectedOntology) return

  isLoading.value = true

  try {
    const allInstances: CardInstances[] = []

    for (const scenario of sortScenarios.value) {
      const lang = scenario.languageTag === 'Français' ? 'fr' : 'en'

      const base = import.meta.env.BASE_URL

      const url = `${base}/json/${props.selectedOntology}/${lang}/chapter/${scenario['scenario-title']}/Instances/Instances.json`

      const res = await fetch(url)

      if (!res.ok) continue

      const data = await res.json()

      const formatted = data.map((instance: CardInstances) => ({
        ...instance,
        Scenario: scenario['scenario-title'],
        ImageName: `${base}/json/${props.selectedOntology}/${lang}/chapter/${scenario['scenario-title']}/Instances/Images/${instance.ImageName}`,
      }))

      allInstances.push(...formatted)
    }

    instances.value = allInstances
  } catch (e) {
    console.error(e)
    instances.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * ouverture modal
 */
watch(
  () => props.open,
  async (open) => {
    if (open) {
      selectedScenario.value = ''
      await loadAllInstances()
    }
  },
)

/**
 * sélection instance
 */
const selectInstance = (instance: CardInstances) => {
  emit('update:selected', {
    Id: instance.Id,
    Title: instance.Title,
    Label: instance.Label,
    ImageName: instance.ImageName,
  })

  emit('update:open', false)
}

/**
 * check URL
 */
const isUrl = (str: string) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * fermeture modal
 */
const closeModal = () => {
  searchInstance.value = ''
  emit('update:open', false)
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <div class="modal-content instance-modal">
      <!-- HEADER -->
      <div class="ontology-filter">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-text') }}
        </h3>

        <button @click="closeModal">
          <img :src="close" alt="close" />
        </button>
      </div>

      <!-- FILTER -->
      <div class="selection">
        <div class="choose-scenario">
          <select v-model="selectedScenario">
            <option value="">
              {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-available') }}
            </option>

            <option
              v-for="(scenario, index) in sortScenarios"
              :key="index"
              :value="scenario['scenario-title']"
            >
              {{ scenario['scenario-title'] }}
            </option>
          </select>
          <input
            :placeholder="
              langStore.t('static-text.FreeModeScene.freemode-scene-instances-search-input')
            "
            type="search"
            v-model="searchInstance"
          />
        </div>
      </div>

      <!-- LOADER -->
      <PagesLoader v-if="isLoading" />

      <!-- INSTANCES -->
      <div v-else class="instances content-cards">
        <ul v-if="instances.length" class="carousel-container">
          <li
            v-for="(instance, index) in filteredInstances"
            :key="index"
            class="instance-card"
            @click="selectInstance(instance)"
          >
            <div class="instance card-name">
              <span class="instance prefix">
                {{ instance.Id }}
              </span>

              <span class="instance name">
                {{ instance.Title }}
              </span>
            </div>

            <a
              v-if="isUrl(instance.Label)"
              class="instance link"
              :href="instance.Label"
              target="_blank"
            >
              {{ instance.Label }}
            </a>

            <span v-else class="instance label">
              {{ instance.Label }}
            </span>

            <img :src="instance.ImageName" :alt="instance.Title" />
          </li>
        </ul>
        <div class="instances-no-result" v-else-if="!instances.length">
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-no-result') }}
        </div>
      </div>
    </div>
  </div>
</template>
