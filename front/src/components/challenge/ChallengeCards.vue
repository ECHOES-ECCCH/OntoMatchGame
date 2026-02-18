<script setup lang="ts">
import { onMounted } from 'vue'
import { useSelectedXML } from '@/stores/cards.store'
import PagesLoader from '../loader/PagesLoader.vue'
import MainCards from './MainCard.vue'

const props = defineProps<{
  showInstruction: boolean
}>()

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
onMounted(() => {
  loadCard()
})

console.log(props.showInstruction)
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div v-else :class="showInstruction ? 'cards-container' : 'cards-container expand'">
    <MainCards :entityDataCards="entityDataCards" :propertyDataCards="propertyDataCards" />
  </div>
</template>
