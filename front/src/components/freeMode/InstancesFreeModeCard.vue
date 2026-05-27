<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import type { CardInstances } from '@/types/card/cardInfo'


defineProps<{
  handleOntologyModal?: Function
  modelValue?: string
  currentInstance: CardInstances
  onDragStart: (instance: CardInstances) => void
  position: string
  selected?: boolean

}>()

const emit = defineEmits(['open-instance-modal'])

</script>

<template>
  <button v-if="position === 'aside'" @click="emit('open-instance-modal')">
    {{ langStore.t('static-text.FreeModeScene.freemode-scene-instances-text') }}
  </button>
  <div class="instances content-cards" :class="{ 'instances--selected': selected }" draggable="true" @dragstart.stop="onDragStart({...currentInstance, kind: 'instance'})"">
    <div class="carousel-container">
      <div class="instance-card">
        <div class="instance card-name">
          <span class="instance prefix">{{ currentInstance?.Id }}</span>
          <span class="instance name">{{ currentInstance?.Title }}</span>
        </div>
        <img :src="currentInstance?.ImageName" :alt="currentInstance?.Title" />
      </div>
    </div>
  </div>
</template>
