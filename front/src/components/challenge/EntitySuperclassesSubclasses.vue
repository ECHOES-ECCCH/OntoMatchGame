<script setup lang="ts">
import type { Position } from '@/types/card/cardInfo'
import { computed } from 'vue'

const props = defineProps<{
  position: string
  superSubClasses: {
    subClassOf: { value: Record<string, string[]> }
    superClassOf: { value: Record<string, string[]> }
  }
  cardInfo: {
    eleft: { about: '' }
    emiddle: { about: '' }
    eright: { about: '' }
  }
  entityDataCards: Array<{ about: string }>
}>()

const emit = defineEmits<{
  'update:cardInfo': [value: typeof props.cardInfo]
}>()

const switchCard = (aboutValue: string) => {
  const newCard = props.entityDataCards.find((c) => c.about === aboutValue)

  if (newCard) {
    const updatedCardInfo = {
      ...props.cardInfo,
      [props.position]: newCard,
    }
    emit('update:cardInfo', updatedCardInfo)
  }
}

const subClasses = computed(() => props.superSubClasses.subClassOf.value[props.position] || [])
const superClasses = computed(() => props.superSubClasses.superClassOf.value[props.position] || [])
</script>

<template>
  <h2>SubClasses & SuperClasses</h2>
  <div class="entity-classes my-scroll">
    <button v-for="sub in subClasses" :key="sub" @click="switchCard(sub)" class="hierarchy-btn sub">
      ↑ {{ sub }}
    </button>

    <div class="current">{{ cardInfo[position as Position].about }}</div>

    <button
      v-for="sup in superClasses"
      :key="sup"
      @click="switchCard(sup)"
      class="hierarchy-btn super"
    >
      ↓ {{ sup }}
    </button>
  </div>
</template>
