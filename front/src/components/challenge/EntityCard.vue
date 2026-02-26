<script setup lang="ts">
import { computed, ref } from 'vue'
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
  totalCards: {
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
  'update:branches': [{ position: Position; value: string[] }]
}>()

const showScopeNote = ref(false)

const superSubClasses = useSuperSubClasses(props.cardInfo, props.entityDataCards)

const getIcon = (branches: BranchName[] | null | undefined): string[] => {
  if (!branches || branches.length === 0) {
    return [colors.entity.icon]
  }

  return branches.map((b) => colors[b]?.icon).filter((icon): icon is string => Boolean(icon))
}

const handleCardInfoUpdate = (newCardInfo: CardPositionInfo) => {
  emit('update:cardInfo', newCardInfo)
}

const isEmpty = computed(() => {
  return (
    !props.totalCards.cards ||
    (Array.isArray(props.totalCards.cards) && props.totalCards.cards.length === 0)
  )
})

const isNoCard = computed(() => {
  return props.totalCards.cards === 'no card'
})
</script>

<template>
  <div v-if="isEmpty" class="carousel-container">
    <EmptyCard />
  </div>
  <div v-else-if="isNoCard">
    <div class="empty-card-entity">
      <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
    </div>
    <BranchesFilter
      :model-value="branches[totalCards.position as Position]"
      @update:model-value="
        $emit('update:branches', { position: totalCards.position as Position, value: $event })
      "
      orientation="horizontal"
    />
  </div>

  <div v-else class="carousel-container">
    <div
      class="entity-card"
      :class="{
        wrong: Array.isArray(totalCards.cards)
          ? !totalCards.cards.some((c) => c?.id === cardInfo[totalCards.position as Position].id)
          : false,
      }"
      :style="getColor(cardInfo[totalCards.position as Position].branch)"
    >
      <div class="scope-note-text" v-show="showScopeNote">
        <p>{{ cardInfo[totalCards.position as Position].comment }}</p>
        <button @click="showScopeNote = false">Close</button>
      </div>
      <div v-show="!showScopeNote" class="card-inner">
        <div class="card-name">
          <div>
            <span class="prefix">{{ cardInfo[totalCards.position as Position].id }}</span>
            <span class="name">{{ cardInfo[totalCards.position as Position].labels.en }}</span>
          </div>
          <span class="image-card">
            <img
              v-for="icon in getIcon(cardInfo[totalCards.position as Position].branch)"
              :key="icon"
              :src="icon"
            />
          </span>
        </div>

        <div class="card-content">
          <EntitySuperclassesSubclasses
            :position="totalCards.position"
            :cardInfo="cardInfo"
            @update:cardInfo="handleCardInfoUpdate"
            :superSubClasses="superSubClasses"
            :entityDataCards="entityDataCards"
          />

          <button @click="showScopeNote = !showScopeNote" class="scope-note">Scope Note</button>
        </div>
      </div>
    </div>

    <BranchesFilter
      :model-value="branches[totalCards.position as Position]"
      @update:model-value="
        $emit('update:branches', { position: totalCards.position as EntityPosition, value: $event })
      "
      orientation="horizontal"
    />

    <div class="range">
      <button
        type="button"
        @click="handlePrevious(totalCards.position as Position, totalCards.cards as CardInfo[])"
      >
        -
      </button>
      <input
        type="range"
        min="0"
        :max="(totalCards.cards as CardInfo[])?.length - 1"
        class="slider"
        :value="currentIndexes[totalCards.position]"
        @input="
          handleSliderChange(
            totalCards.position,
            Number(($event.target as HTMLInputElement).value),
            totalCards.cards as CardInfo[],
          )
        "
      />
      <div class="slider-buttons">
        <button
          type="button"
          @click="handleNext(totalCards.position as Position, totalCards.cards as CardInfo[])"
        >
          +
        </button>
      </div>
    </div>

    <div
      class="number"
      :class="{ active: index === currentIndexes[totalCards.position as Position] }"
      v-for="(card, index) in totalCards.cards"
      :key="index"
    >
      {{ (totalCards.cards as CardInfo[]).length }}/{{ totalCards.totalCards }}
    </div>
  </div>
</template>
