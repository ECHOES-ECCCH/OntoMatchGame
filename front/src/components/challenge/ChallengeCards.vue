<script setup lang="ts">
import { onMounted } from 'vue'
import { useSelectedXML } from '@/stores/cards.store'
import PagesLoader from '../loader/PagesLoader.vue'
import MainCards from './MainCard.vue'
import InstancesCards from './InstancesCards.vue'

defineProps<{
  showInstruction: boolean
}>()

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
onMounted(() => {
  loadCard()
})
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div v-else :class="showInstruction ? 'cards-container' : 'cards-container expand'">
    <MainCards :entityDataCards="entityDataCards" :propertyDataCards="propertyDataCards" />
    <InstancesCards />
  </div>
</template>
