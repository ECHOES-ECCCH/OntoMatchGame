<script setup lang="ts">
import type { CardInfo } from '@/types/card/cardInfo'

defineProps<{
  superProperties: string[]
  subProperties: string[]
  currentCard: CardInfo
  propertyDataCards: Array<{ about: string }>
}>()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <h2>SuperProperties & SubProperties</h2>
  <div class="property-classes my-scroll">
    <button
      v-for="sub in subProperties"
      :key="sub"
      class="hierarchy-btn sub"
      @click="emit('select', sub)"
    >
      ↑ {{ sub }}
    </button>

    <div class="current">{{ currentCard?.about }}</div>

    <button
      v-for="sup in superProperties"
      :key="sup"
      class="hierarchy-btn super"
      @click="emit('select', sup)"
    >
      ↓ {{ sup }}
    </button>
  </div>
</template>
