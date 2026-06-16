<script setup lang="ts">
import type { CardPropertyInfo, Position } from '@/types/card/cardInfo'
import { switchCard } from '@/utils/switch-card'
import { computed } from 'vue'

const props = defineProps<{
  position: Position
  superSubProperties: {
    subPropertyOf: { value: Record<string, string[]> }
    superPropertyOf: { value: Record<string, string[]> }
  }
  cardInfo: Record<Position, CardPropertyInfo>
  propertyDataCards: Array<{ about: string }>
}>()
const emit = defineEmits<{
  'update:cardInfo': [value: typeof props.cardInfo]
}>()

/**
 * Switch the current card to the selected subProperties or superProperties.
 */
const switchPropertyCard = (aboutValue: string) => {
  const updated = switchCard(aboutValue, props.position, props.propertyDataCards, props.cardInfo)

  if (updated) {
    emit('update:cardInfo', updated as Record<Position, CardPropertyInfo>)
  }
}

/**
 * Available subProperties and superProperties for the current entity.
 */
const subProperties = computed(
  () => props.superSubProperties.subPropertyOf.value[props.position] || [],
)
const superProperties = computed(
  () => props.superSubProperties.superPropertyOf.value[props.position] || [],
)
</script>

<template>
  <h2>SuperProperties & SubProperties</h2>
  <div class="property-classes my-scroll">
    <button
      v-for="sub in subProperties"
      :key="sub"
      @click="switchPropertyCard(sub)"
      class="hierarchy-btn sub"
    >
      ↑ {{ sub }}
    </button>

    <div class="current">{{ cardInfo[position].about }}</div>

    <button
      v-for="sup in superProperties"
      :key="sup"
      @click="switchPropertyCard(sup)"
      class="hierarchy-btn super"
    >
      ↓ {{ sup }}
    </button>
  </div>
</template>
