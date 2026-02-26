<script setup lang="ts">
import { computed, ref } from 'vue'
import EmptyCardProperty from './EmptyCardProperty.vue'
import type {
  CardInfo,
  CardPositionInfo,
  CardPropertyInfo,
  CurrentIndexes,
  EntityPosition,
  Position,
} from '@/types/card/cardInfo'
import PropertySuperpropertiesSubproperties from './PropertySuperpropertiesSubproperties.vue'
import { useSuperSubProperties } from '@/composables/useSuperSubProperties'
import { getColor } from '@/utils/get-color-types'
import BranchesFilter from './BranchesFilter.vue'
import { langStore } from '@/stores/lang.store'
import type { Branch } from '@/assets/cards/types'

const props = defineProps<{
  totalCards: {
    type: string
    position: Position
    cards: CardPropertyInfo[] | 'no card'
    totalCards: number
  }
  branches: Branch
  cardInfo: Record<Position, CardPropertyInfo>
  currentIndexes: CurrentIndexes
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
  handlePrevious: (position: Position, cards: CardInfo[]) => void
  handleNext: (position: Position, cards: CardInfo[]) => void
  handleSliderChange: (position: Position, value: number, cards: CardInfo[]) => void
}>()

const emit = defineEmits<{
  'update:cardInfo': [newCardInfo: CardPositionInfo]
  'update:branches': [{ position: string; value: string[] }]
}>()

const showScopeNote = ref(false)

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

const switchCard = (aboutValue: string, propertyPosition: Position, DR: 'domain' | 'range') => {
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
  return props.totalCards.cards === 'no card'
})

console.log(props.totalCards)
</script>

<template>
  <!-- EMPTY -->
  <div v-if="!totalCards.cards?.length" class="carousel-container">
    <EmptyCardProperty />
  </div>

  <!-- NO CARD -->
  <div v-else-if="isNoCard" class="carousel-container">
    <div class="property">
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_domain`]"
        @update:model-value="
          $emit('update:branches', { position: totalCards.position as Position, value: $event })
        "
        orientation="vertical-left"
      />
      <div class="no-card-property">
        <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
      </div>
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_range`]"
        @update:model-value="
          $emit('update:branches', { position: totalCards.position as Position, value: $event })
        "
        orientation="vertical-right"
      />
    </div>
  </div>

  <!-- NORMAL -->
  <div v-else class="carousel-container">
    <div class="property">
      <!-- LEFT FILTER -->
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_domain`]"
        @update:model-value="
          $emit('update:branches', { position: `${totalCards.position}_domain`, value: $event })
        "
        orientation="vertical-left"
      />

      <div
        class="property-card"
        :class="{
          wrong: Array.isArray(totalCards.cards)
            ? !totalCards.cards.some((c) => c?.id === cardInfo[totalCards.position as Position].id)
            : false,
        }"
      >
        <!-- DOMAIN BUTTON -->
        <button
          class="vertical-button vertical-left"
          @click="
            switchCard(
              cardInfo[totalCards.position as Position]?.domain,
              totalCards.position,
              'domain',
            )
          "
          :style="handlePropertyColor(totalCards.position, 'domain')"
        >
          <span>Domain</span>
          <p>{{ cardInfo[totalCards.position as Position].domain }}</p>
        </button>

        <!-- CENTER CONTENT -->
        <div class="card-content">
          <!-- Scope Note -->
          <div v-if="showScopeNote" class="scope-note-text">
            <p>{{ cardInfo[totalCards.position as Position].comment }}</p>
            <button @click="showScopeNote = false">Close</button>
          </div>

          <!-- Normal Content -->
          <template v-else>
            <div class="property card-name">
              <span class="property prefix">
                {{ cardInfo[totalCards.position as Position].id }}
              </span>
              <span class="property name">
                {{ cardInfo[totalCards.position as Position]?.labels.en }}
              </span>
            </div>

            <PropertySuperpropertiesSubproperties
              :position="totalCards.position"
              :cardInfo="cardInfo"
              @update:cardInfo="handleCardInfoUpdate"
              :superSubProperties="superSubProperties"
              :propertyDataCards="propertyDataCards"
            />

            <button @click="showScopeNote = true" class="scope-note">Scope Note</button>
          </template>
        </div>

        <!-- RANGE BUTTON -->
        <button
          class="vertical-button vertical-right"
          @click="
            switchCard(
              cardInfo[totalCards.position as Position]?.range,
              totalCards.position,
              'range',
            )
          "
          :style="handlePropertyColor(totalCards.position, 'range')"
        >
          <p>{{ cardInfo[totalCards.position as Position].range }}</p>
          <span>Range</span>
        </button>
      </div>

      <!-- RIGHT FILTER -->
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_range`]"
        @update:model-value="
          $emit('update:branches', { position: `${totalCards.position}_range`, value: $event })
        "
        orientation="vertical-right"
      />
    </div>

    <!-- SLIDER -->
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

    <!-- COUNTER -->
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
