<script setup lang="ts">
import EmptyCardProperty from './EmptyCardProperty.vue'
import type { CardInfo, CurrentIndexes, Position } from '@/types/card/cardInfo'
import type { Branch } from '@/types/card/branch'
import PropertySuperpropertiesSubproperties from './PropertySuperpropertiesSubproperties.vue'

const props = defineProps<{
  data: CardInfo[]
  branches: Branch
  cardInfo: CardInfo[]
  currentIndexes: CurrentIndexes
  entityDataCards: CardInfo[]
  handlePrevious: (position: Position, cards: CardInfo[]) => void
  handleNext: (position: Position, cards: CardInfo[]) => void
  handleSliderChange: (position: Position, value: number, cards: CardInfo[]) => void
}>()
</script>

<template>
  <EmptyCardProperty v-if="!data.cards.length" />
  <div v-else class="caroussel-container">
    <div
      class="property-card"
      :class="{
        wrong: Array.isArray(data.cards)
          ? !data.cards.some((c) => c?.id === cardInfo[data.position as Position].id)
          : false,
      }"
    >
      <div class="card-name">
        <div>
          {{ cardInfo[data.position].id }}
          {{ cardInfo[data.position]?.labels.en }}
        </div>
      </div>
      <PropertySuperpropertiesSubproperties />
      <button @click="">Domain {{ cardInfo[data.position].domain }}</button>
      <button>Range {{ cardInfo[data.position].range }}</button>
    </div>
    <div class="range">
      <button
        type="button"
        @click="handlePrevious(data.position as Position, data.cards as CardInfo[])"
      >
        -
      </button>
      <input
        type="range"
        min="0"
        :max="(data.cards as CardInfo[])?.length - 1"
        class="slider"
        :value="currentIndexes[data.position]"
        @input="
          handleSliderChange(
            data.position,
            Number(($event.target as HTMLInputElement).value),
            data.cards as CardInfo[],
          )
        "
      />
      <div class="slider-buttons">
        <button
          type="button"
          @click="handleNext(data.position as Position, data.cards as CardInfo[])"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
