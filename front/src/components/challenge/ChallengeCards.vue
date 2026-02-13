<script setup lang="ts">
import { onMounted } from 'vue'
import { useSelectedXML } from '@/stores/cards.store'
import PagesLoader from '../loader/PagesLoader.vue'
import MainCards from './MainCard.vue'
const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
onMounted(() => {
  loadCard()
})
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div v-else class="cards-container">
    <MainCards :entityDataCards="entityDataCards" :propertyDataCards="propertyDataCards" />
  </div>
</template>
