<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BranchName } from '@/types/card/branch'
import type { CardInfo } from '@/types/card/cardInfo'
import { colors } from '@/assets/cards/colors'
import EntitySuperclassesSubClassesFreeMode from './EntitySuperclassesSubClassesFreeMode.vue'
import { getSubClasses, getSuperClasses } from '@/composables/useSuperSubClasses'
import BranchesFilter from '@/components/challenge/BranchesFilter.vue'
import { getColor } from '@/utils/get-color-types'

const props = defineProps<{
  entityDataCards: CardInfo[]
  filteredCard?: CardInfo[]
  branches?: string[]
  onDragStart: (card: CardInfo) => void
  initialIndex?: number
  position: string
}>()
const activeCards = computed(() => props.filteredCard ?? props.entityDataCards)

watch(
  () => activeCards,
  () => {
    currentIndex.value = 0
    currentFreeCard.value = null
  },
)

const currentIndex = ref(props.initialIndex ?? 0)
const emit = defineEmits<{
  (e: 'update:branches', value: string[]): void
}>()

/**
 * Card currently shown from slider navigation
 */
const currentCard = computed(() => {
  return activeCards.value?.[currentIndex.value] ?? activeCards.value?.[0] ?? null
})

/**
 * Card selected via ontology hierarchy (free navigation mode)
 */
const currentFreeCard = ref<CardInfo | null>(null)

/**
 * Final displayed card (slider OR free selection)
 */
const displayedCard = computed(() => {
  return currentFreeCard.value ?? currentCard.value
})

const showScopeNote = ref(false)

const getIcon = (branches: BranchName[] | null | undefined): string[] => {
  if (!branches || branches.length === 0) {
    return [colors.entity.icon]
  }

  return branches.map((b) => colors[b]?.icon).filter((icon): icon is string => Boolean(icon))
}

const handlePrevious = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0)
  currentFreeCard.value = null
}

const handleNext = () => {
  currentIndex.value = Math.min(currentIndex.value + 1, activeCards.value.length - 1)
  currentFreeCard.value = null
}

const handleSliderChange = (value: number) => {
  currentIndex.value = value
  currentFreeCard.value = null
}

const subClasses = computed(() => {
  if (!displayedCard.value) return []
  return getSubClasses(displayedCard.value.about, activeCards.value ?? [])
})

const superClasses = computed(() => {
  if (!displayedCard.value) return []
  return getSuperClasses(displayedCard.value.about, activeCards.value ?? [])
})

const selectCard = (aboutValue: string) => {
  const newCard = activeCards.value.find((c) => c.about === aboutValue)

  if (!newCard) return

  currentFreeCard.value = newCard
}
</script>

<template>
  <div class="carousel-container">
    <div class="entity-card" v-if="displayedCard" :style="getColor(displayedCard.branch)">
      <div class="scope-note-text" v-show="showScopeNote">
        <p>{{ displayedCard.comment }}</p>
        <button @click="showScopeNote = false">Close</button>
      </div>
      <div class="card-inner">
        <div
          class="card"
          draggable="true"
          @dragstart.stop="onDragStart({ ...displayedCard, kind: 'entity' })"
        >
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
    <BranchesFilter
      v-if="position === 'aside'"
      :model-value="branches"
      @update:modelValue="emit('update:branches', $event)"
      orientation="horizontal"
    />
    <div class="range" v-if="activeCards?.length > 1 && position === 'aside'">
      <button type="button" @click="handlePrevious">-</button>

      <input
        type="range"
        min="0"
        :max="activeCards.length - 1"
        class="slider"
        :value="currentIndex"
        @input="handleSliderChange(Number(($event.target as HTMLInputElement).value))"
      />

      <button type="button" @click="handleNext">+</button>
    </div>

    <div class="number" v-if="position === 'aside'">
      {{ activeCards.length }}/{{ entityDataCards.length }}
    </div>
  </div>
</template>
