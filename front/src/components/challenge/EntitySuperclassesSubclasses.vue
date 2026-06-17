<script setup lang="ts">
import type { CardInfo, Position } from '@/types/card/cardInfo'
import { switchCard } from '@/utils/switch-card'
import { computed } from 'vue'

const props = defineProps<{
  position: string
  superSubClasses: {
    subClassOf: { value: Record<string, string[]> }
    superClassOf: { value: Record<string, string[]> }
  }
  cardInfo: Record<Position, CardInfo>
  entityDataCards: Array<{ about: string }>
}>()

const emit = defineEmits<{
  'update:cardInfo': [value: typeof props.cardInfo]
}>()

const switchEntityCard = (aboutValue: string) => {
  const updated = switchCard(aboutValue, props.position, props.entityDataCards, props.cardInfo)

  if (updated) {
    emit('update:cardInfo', updated as Record<Position, CardInfo>)
  }
}

const subClasses = computed(() => props.superSubClasses.subClassOf.value[props.position] || [])
const superClasses = computed(() => props.superSubClasses.superClassOf.value[props.position] || [])
</script>

<template>
  <div class="entity-classes-wrapper">
    <h2>SubClasses & SuperClasses</h2>
    <div class="entity-classes my-scroll">
      <button
        v-for="sub in subClasses"
        :key="sub"
        @click="switchEntityCard(sub)"
        class="hierarchy-btn sub"
      >
        ↑ {{ sub }}
      </button>

      <div class="current">{{ cardInfo[position as Position].about }}</div>

      <button
        v-for="sup in superClasses"
        :key="sup"
        @click="switchEntityCard(sup)"
        class="hierarchy-btn super"
      >
        ↓ {{ sup }}
      </button>
    </div>
  </div>
</template>
