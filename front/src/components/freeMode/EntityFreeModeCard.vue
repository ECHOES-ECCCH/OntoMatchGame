<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BranchName } from '@/types/card/branch'
import type { CardInfo } from '@/types/card/cardInfo'

import { colors } from '@/assets/cards/colors'

import EntitySuperclassesSubClassesFreeMode from './EntitySuperclassesSubClassesFreeMode.vue'

import { getSubClasses, getSuperClasses } from '@/composables/useSuperSubClasses'

const props = defineProps<{
  entityDataCards: CardInfo[]
  onDragStart: (card: CardInfo) => void
  initialIndex?: number
  position: string
}>()

const currentIndex = ref(props.initialIndex ?? 0)

const currentCard = computed(() => {
  return props.entityDataCards[currentIndex.value]
})

/**
 * Carte actuellement affichée en mode libre
 * (quand on clique sur subclass/superclass)
 */
const currentFreeCard = ref<CardInfo | null>(null)

/**
 * Carte réellement affichée
 * -> soit la carte du slider
 * -> soit la carte sélectionnée
 */
const displayedCard = computed(() => {
  return currentFreeCard.value ?? currentCard.value
})

const showScopeNote = ref(false)
console.log(showScopeNote)
const getIcon = (branches: BranchName[] | null | undefined): string[] => {
  if (!branches || branches.length === 0) {
    return [colors.entity.icon]
  }

  return branches.map((b) => colors[b]?.icon).filter((icon): icon is string => Boolean(icon))
}

const handlePrevious = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0)

  /**
   * reset du mode libre
   */
  currentFreeCard.value = null
}

const handleNext = () => {
  currentIndex.value = Math.min(currentIndex.value + 1, props.entityDataCards.length - 1)

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

const subClasses = computed(() => getSubClasses(displayedCard.value.about, props.entityDataCards))

const superClasses = computed(() =>
  getSuperClasses(displayedCard.value.about, props.entityDataCards),
)

const selectCard = (aboutValue: string) => {
  const newCard = props.entityDataCards.find((c) => c.about === aboutValue)

  if (!newCard) return

  currentFreeCard.value = newCard
}
</script>

<template>
  <div class="carousel-container">
    <div class="entity-card" v-if="displayedCard">
      <div class="scope-note-text" v-show="showScopeNote">
        <p>{{ displayedCard.comment }}</p>
        <button @click="showScopeNote = false">Close</button>
      </div>
      <div class="card-inner">
        <div class="card" draggable="true" @dragstart="onDragStart(displayedCard)">
          <div class="card-name">
            <div>
              <span class="prefix">
                {{ displayedCard.id }}
              </span>

              <span class="name">
                {{ displayedCard.labels.en }}
              </span>
            </div>

            <span class="image-card">
              <img v-for="icon in getIcon(displayedCard.branch)" :key="icon" :src="icon" />
            </span>
          </div>

          <div class="card-content">
            <EntitySuperclassesSubClassesFreeMode
              :position="position"
              :current="displayedCard.about"
              :subClasses="subClasses"
              :superClasses="superClasses"
              @select="selectCard"
            />
            <div class="scope-note" v-if="position === 'aside'">
              <button v-if="displayedCard.comment" @click="showScopeNote = !showScopeNote">
                Scope Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="range" v-if="entityDataCards.length > 1 && position === 'aside'">
      <button type="button" @click="handlePrevious">-</button>

      <input
        type="range"
        min="0"
        :max="entityDataCards.length - 1"
        class="slider"
        :value="currentIndex"
        @input="handleSliderChange(Number(($event.target as HTMLInputElement).value))"
      />

      <button type="button" @click="handleNext">+</button>
    </div>

    <div class="number" v-if="position === 'aside'">
      {{ currentIndex + 1 }}/{{ entityDataCards.length }}
    </div>
  </div>
</template>
