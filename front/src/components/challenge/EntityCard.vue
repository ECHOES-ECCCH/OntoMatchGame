<script setup lang="ts">
import { computed } from 'vue'
import { langStore } from '@/stores/lang.store'
import type { Branch, BranchName } from '@/types/card/branch'
import type {
  CardInfo,
  Position,
  CardPositionInfo,
  CurrentIndexes,
  EntityPosition,
} from '@/types/card/cardInfo'
import BranchesFilter from './BranchesFilter.vue'
import EmptyCard from './EmptyCard.vue'
import EntitySuperclassesSubclasses from './EntitySuperclassesSubclasses.vue'
import { getColor } from '@/utils/get-color-types'
import { colors } from '@/assets/cards/colors'
import { useSuperSubClasses } from '@/composables/useSuperSubClasses'

const props = defineProps<{
  data: {
    type: string
    position: EntityPosition
    cards: CardInfo[] | 'no card'
    totalCards: number
  }
  branches: Record<EntityPosition, string[]>
  cardInfo: Record<Position, CardInfo>
  currentIndexes: CurrentIndexes
  entityDataCards: CardInfo[]
  handlePrevious: (position: Position, cards: CardInfo[]) => void
  handleNext: (position: Position, cards: CardInfo[]) => void
  handleSliderChange: (position: Position, value: number, cards: CardInfo[]) => void
}>()

const emit = defineEmits<{
  'update:cardInfo': [newCardInfo: CardPositionInfo]
}>()

const superSubClasses = useSuperSubClasses(props.cardInfo, props.entityDataCards)

const getIcon = (branch: BranchName | null | undefined) => {
  if (!branch) return colors.entity.icon
  return colors[branch]?.icon ?? colors.entity.icon
}

const handleCardInfoUpdate = (newCardInfo: CardPositionInfo) => {
  emit('update:cardInfo', newCardInfo)
}

const isEmpty = computed(() => {
  return !props.data.cards || (Array.isArray(props.data.cards) && props.data.cards.length === 0)
})

const isNoCard = computed(() => {
  return props.data.cards === 'no card'
})
</script>

<template>
  <EmptyCard v-if="isEmpty" />

  <div v-else-if="isNoCard">
    <div class="empty-card-entity">
      <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
    </div>
    <BranchesFilter
      :model-value="branches[data.position as Position]"
      @update:model-value="branches[data.position as Position] = $event"
    />
  </div>

  <div v-else class="carousel-container">
    <div
      class="entity-card"
      :class="{
        wrong: Array.isArray(data.cards)
          ? !data.cards.some((c) => c?.id === cardInfo[data.position as Position].id)
          : false,
      }"
      :style="{ '--card-color': getColor(cardInfo[data.position as Position].branch) }"
    >
      <div class="card-name">
        <div>
          <span class="prefix">{{ cardInfo[data.position as Position].id }}</span>
          <span class="name">{{ cardInfo[data.position as Position].labels.en }}</span>
        </div>
        <span class="image-card">
          <img :src="getIcon(cardInfo[data.position as Position].branch ?? null)" />
        </span>
      </div>

      <EntitySuperclassesSubclasses
        :position="data.position"
        :cardInfo="cardInfo"
        @update:cardInfo="handleCardInfoUpdate"
        :superSubClasses="superSubClasses"
        :entityDataCards="entityDataCards"
      />

      <div class="scope-note">Scope Note</div>
    </div>

    <BranchesFilter
      :model-value="branches[data.position as Position]"
      @update:model-value="branches[data.position as Position] = $event"
    />

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

    <div
      class="number"
      :class="{ active: index === currentIndexes[data.position as Position] }"
      v-for="(card, index) in data.cards"
      :key="index"
    >
      {{ (data.cards as CardInfo[]).length }}/{{ data.totalCards }}
    </div>
  </div>
</template>
