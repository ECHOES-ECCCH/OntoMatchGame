<script setup lang="ts">
import EmptyCardProperty from './EmptyCardProperty.vue'
import type { CardInfo, CardPositionInfo, CurrentIndexes, Position } from '@/types/card/cardInfo'
import type { Branch } from '@/types/card/branch'
import PropertySuperpropertiesSubproperties from './PropertySuperpropertiesSubproperties.vue'
import { computed, ref } from 'vue'
import { useSuperSubProperties } from '@/composables/useSuperSubProperties'
import { getColor } from '@/utils/get-color-types'
import BranchesFilter from './BranchesFilter.vue'
import { langStore } from '@/stores/lang.store'

const props = defineProps<{
  data: CardInfo[]
  branches: Branch
  cardInfo: CardInfo[]
  currentIndexes: CurrentIndexes
  entityDataCards: CardInfo[]
  propertyDataCards
  handlePrevious: (position: Position, cards: CardInfo[]) => void
  handleNext: (position: Position, cards: CardInfo[]) => void
  handleSliderChange: (position: Position, value: number, cards: CardInfo[]) => void
}>()

const emit = defineEmits<{
  'update:cardInfo': [newCardInfo: CardPositionInfo]
}>()

const superSubProperties = useSuperSubProperties(props.cardInfo, props.propertyDataCards)
const handleCardInfoUpdate = (newCardInfo: CardPositionInfo) => {
  emit('update:cardInfo', newCardInfo)
}

const resolveEntityPosition = (propertyPosition: string, DR: 'domain' | 'range') => {
  if (DR === 'domain') {
    return propertyPosition === 'pleft' ? 'eleft' : 'emiddle'
  } else {
    return propertyPosition === 'pleft' ? 'emiddle' : 'eright'
  }
}

const switchCard = (aboutValue: string, propertyPosition, DR) => {
  const newCard = props.entityDataCards.find((c) => c.about === aboutValue)

  const resolvedPosition = resolveEntityPosition(propertyPosition, DR)

  if (newCard) {
    const updatedCardInfo = {
      ...props.cardInfo,
      [resolvedPosition]: newCard,
    }

    emit('update:cardInfo', updatedCardInfo)
  }
}

const handlePropertyColor = (propertyPosition: Position, DR: 'domain' | 'range') => {
  const resolvedPosition = resolveEntityPosition(propertyPosition, DR)
  const propertyCard = props.cardInfo[propertyPosition]
  const entityAbout = propertyCard[DR]

  const displayedEntity = props.cardInfo[resolvedPosition]

  if (displayedEntity?.about === entityAbout) {
    return getColor(displayedEntity.branch)
  }

  const entity = props.entityDataCards.find((e) => e.about === entityAbout)

  return entity ? getColor(entity.branch) : '#ccc'
}

const isNoCard = computed(() => {
  return props.data.cards === 'no card'
})
</script>

<template>
  <div v-if="!data.cards.length" class="carousel-container">
    <EmptyCardProperty />
  </div>
  <div v-else-if="isNoCard">
    <div class="empty-card-property">
      <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
      <!-- <BranchesFilter
        :model-value="branches[`${data.position}_domain`]"
        @update:model-value="branches[`${data.position}_domain`] = $event"
        orientation="vertical-left"
      />
      <BranchesFilter
        :model-value="branches[`${data.position}_domain`]"
        @update:model-value="branches[`${data.position}_domain`] = $event"
        orientation="vertical-right"
      /> -->
    </div>
  </div>
  <div v-else class="carousel-container">
    <div class="property">
      <BranchesFilter
        :model-value="branches[`${data.position}_domain`]"
        @update:model-value="branches[`${data.position}_domain`] = $event"
        orientation="vertical-left"
      />
      <div
        class="property-card"
        :class="{
          wrong: Array.isArray(data.cards)
            ? !data.cards.some((c) => c?.id === cardInfo[data.position as Position].id)
            : false,
        }"
      >
        <!-- Domain button - vertical left -->
        <button
          class="vertical-button vertical-left"
          @click="switchCard(cardInfo[data.position]?.domain, data.position, 'domain')"
          :style="handlePropertyColor(data.position, 'domain')"
        >
          <span>Domain</span>
          <p>{{ cardInfo[data.position].domain }}</p>
        </button>

        <!-- Main card content -->
        <div class="card-content">
          <div class="property card-name">
            <span class="property prefix"> {{ cardInfo[data.position].id }}</span>
            <span class="property name">{{ cardInfo[data.position]?.labels.en }}</span>
          </div>
          <PropertySuperpropertiesSubproperties
            :position="data.position"
            :cardInfo="cardInfo"
            @update:cardInfo="handleCardInfoUpdate"
            :superSubProperties="superSubProperties"
            :propertyDataCards="propertyDataCards"
          />

          <div class="scope-note">Scope Note</div>
        </div>

        <!-- Range button - vertical right -->
        <button
          class="vertical-button vertical-right"
          @click="switchCard(cardInfo[data.position]?.range, data.position, 'range')"
          :style="handlePropertyColor(data.position, 'range')"
        >
          <p>{{ cardInfo[data.position].range }}</p>
          <span>Range</span>
        </button>
      </div>
      <BranchesFilter
        :model-value="branches[`${data.position}_range`]"
        @update:model-value="branches[`${data.position}_range`] = $event"
        orientation="vertical-right"
      />
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
