<script setup lang="ts">
import PagesLoader from '../loader/PagesLoader.vue'
import MainCards from './MainCard.vue'
import InstancesCards from './InstancesCards.vue'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'

defineProps<{
  showInstruction: boolean
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
  isDataCardsLoading: boolean
}>()
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div v-else :class="showInstruction ? 'cards-container' : 'cards-container expand'">
    <MainCards :entityDataCards="entityDataCards" :propertyDataCards="propertyDataCards" />
    <InstancesCards />
  </div>
</template>
