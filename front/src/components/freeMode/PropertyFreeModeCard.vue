<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'
import { getColor } from '@/utils/get-color-types'
import PropertySuperpropertiesSubpropertiesFreeMode from './PropertySuperpropertiesSubpropertiesFreeMode.vue'
import { getSubProperties, getSuperProperties } from '@/composables/useSuperSubProperties'
import { filteredPropertyCardsByBranch } from '@/composables/useSelectedCards'
import BranchesFilter from '@/components/challenge/BranchesFilter.vue'

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
  filteredCard?: CardInfo[]
  onDragStart: (card: CardInfo) => void
  initialIndex?: number
  position: string
}>()

const propertyBranches = ref({
  domain: ['entity'],
  range: ['entity'],
})
/**
 * Carte actuellement affichée en mode libre
 * (quand on clique sur subclass/superclass)
 */
const currentFreeCard = ref<CardPropertyInfo | null>(null)

const filteredCards = computed<CardPropertyInfo[]>(() => {
  let cards: CardPropertyInfo[] = props.propertyDataCards

  if (propertyBranches.value.domain?.includes('entity') === false) {
    cards = filteredPropertyCardsByBranch(
      props.entityDataCards,
      propertyBranches.value.domain,
      cards,
      'domain',
    )
  }

  if (propertyBranches.value.range?.includes('entity') === false) {
    cards = filteredPropertyCardsByBranch(
      props.entityDataCards,
      propertyBranches.value.range,
      cards,
      'range',
    )
  }

  return cards
})

const currentCard = computed(() => {
  return filteredCards.value[currentIndex.value] ?? filteredCards.value[0] ?? null
})

watch(
  () => filteredCards.value,
  () => {
    currentIndex.value = 0
    currentFreeCard.value = null
  },
)

const currentIndex = ref(props.initialIndex ?? 0)

defineEmits<{
  (
    e: 'update:branches',
    value: {
      domain?: string[]
      range?: string[]
    },
  ): void
}>()

const showScopeNote = ref(false)

/**
 * Carte réellement affichée
 * -> soit la carte du slider
 * -> soit la carte sélectionnée
 */
const displayedCard = computed(() => {
  return currentFreeCard.value ?? currentCard.value
})

const handlePropertyColor = (side: 'domain' | 'range') => {
  const entityAbout = currentCard.value?.[side]

  const entity = props.entityDataCards.find((e) => e.about === entityAbout)

  return entity ? getColor(entity.branch) : '#ccc'
}

const handlePrevious = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0)

  /**
   * reset du mode libre
   */
  currentFreeCard.value = null
}

const handleNext = () => {
  currentIndex.value = Math.min(currentIndex.value + 1, props.propertyDataCards.length - 1)

  /**
   * reset du mode libre
   */
  currentFreeCard.value = null
}

const handleSliderChange = (value: number) => {
  currentIndex.value = value

  /**
   * reset du mode libre
   */
  currentFreeCard.value = null
}

const subProperties = computed(() => {
  if (!displayedCard.value) return []
  return getSubProperties(displayedCard.value.about, props.propertyDataCards ?? [])
})

const superProperties = computed(() => {
  if (!displayedCard.value) return []
  return getSuperProperties(displayedCard.value.about, props.propertyDataCards ?? [])
})

const selectCard = (aboutValue: string) => {
  const newCard = filteredCards.value.find((c) => c.about === aboutValue)

  if (!newCard) return

  currentFreeCard.value = newCard
}
</script>

<template>
  <div class="carousel-container">
    <div class="property">
      <!-- LEFT FILTER -->
      <BranchesFilter
        v-if="position === 'aside'"
        :model-value="propertyBranches.domain"
        @update:model-value="propertyBranches.domain = $event"
        orientation="vertical-left"
      />

      <div
        class="property-card"
        draggable="true"
        @dragstart.stop="onDragStart({ ...displayedCard, kind: 'property' } as CardInfo)"
      >
        <!-- DOMAIN BUTTON -->
        <button class="vertical-button vertical-left" :style="handlePropertyColor('domain')">
          <span>Domain</span>
          <p>{{ displayedCard?.domain }}</p>
        </button>

        <!-- CENTER CONTENT -->
        <div class="card-content">
          <!-- Scope Note -->
          <div v-if="showScopeNote" class="scope-note-text">
            <p>{{ currentCard?.comment }}</p>
            <button @click="showScopeNote = false">Close</button>
          </div>

          <!-- Normal Content -->
          <template v-else>
            <div class="property card-name">
              <span class="property prefix">
                {{ displayedCard?.id }}
              </span>
              <span class="property name">
                {{ displayedCard?.labels.en }}
              </span>
            </div>
            <PropertySuperpropertiesSubpropertiesFreeMode
              v-if="displayedCard"
              :superProperties="superProperties"
              :subProperties="subProperties"
              :currentCard="displayedCard"
              @select="selectCard"
              :propertyDataCards="propertyDataCards"
            />
            <div class="scope-note" v-if="position === 'aside'">
              <button v-if="displayedCard?.comment" @click="showScopeNote = true">
                Scope Note
              </button>
            </div>
          </template>
        </div>

        <!-- RANGE BUTTON -->
        <button class="vertical-button vertical-right" :style="handlePropertyColor('range')">
          <p>{{ displayedCard?.range }}</p>
          <span>Range</span>
        </button>
      </div>

      <!-- RIGHT FILTER -->
      <BranchesFilter
        v-if="position === 'aside'"
        :model-value="propertyBranches.range"
        @update:model-value="propertyBranches.range = $event"
        orientation="vertical-right"
      />
    </div>

    <!-- SLIDER -->
    <div class="range" v-if="position === 'aside'">
      <button type="button" @click="handlePrevious">-</button>

      <input
        type="range"
        min="0"
        :max="filteredCards.length - 1"
        class="slider"
        :value="currentIndex"
        @input="handleSliderChange(Number(($event.target as HTMLInputElement).value))"
      />

      <div class="slider-buttons" @click="handleNext">
        <button type="button">+</button>
      </div>
    </div>

    <!-- COUNTER -->
    <div v-if="position === 'aside'" class="number">
      {{ filteredCards.length }}/{{ filteredCards.length }}
    </div>
  </div>
</template>
