<script setup lang="ts">
import { onMounted } from 'vue'
import EntityCard from './EntityCard.vue'
import { useSelectedXML } from '@/stores/cards.store'
import PagesLoader from '../loader/PagesLoader.vue'
const { dataCards, load, isDataCardsLoading } = useSelectedXML()

onMounted(() => {
  load()
})
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div v-else class="cards-container">
    <EntityCard :dataCards="dataCards" />
  </div>
</template>
