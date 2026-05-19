<script setup lang="ts">
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import rotateIcon from '@/assets/img/rotate.svg'

import EntityFreeModeCard from '@/components/freeMode/EntityFreeModeCard.vue'
import { useSelectedXML } from '@/stores/cards.store'
import PropertyFreeModeCard from './PropertyFreeModeCard.vue'
import type { CardInfo } from '@/types/card/cardInfo'

const props = defineProps<{
  id: string
  data: {
    kind: 'entity' | 'property'
    card: CardInfo
    rotation?: number
  }
}>()

const { updateNodeData } = useVueFlow()

const rotation = ref(props.data.rotation || 0)

const startRotate = (e: PointerEvent) => {
  let rotating = true

  const el = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = el.getBoundingClientRect()

  const center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }

  const getAngle = (ev: PointerEvent) => Math.atan2(ev.clientY - center.y, ev.clientX - center.x)

  const startAngle = getAngle(e)
  const startRotation = rotation.value

  const onMove = (ev: PointerEvent) => {
    if (!rotating) return

    const delta = (getAngle(ev) - startAngle) * (180 / Math.PI)
    rotation.value = startRotation + delta

    updateNodeData(props.id, {
      ...props.data,
      rotation: rotation.value,
    })
  }

  const stop = () => {
    rotating = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', stop)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', stop)
}

const { entityDataCards, propertyDataCards } = useSelectedXML() // ← toutes les cartes
</script>

<template>
  <div class="node" :style="{ transform: `rotate(${rotation}deg)` }">
    <EntityFreeModeCard
      v-if="data.card.kind === 'entity'"
      :entityDataCards="entityDataCards"
      :initialIndex="entityDataCards.findIndex((c) => c.about === data.card.about)"
      :onDragStart="() => {}"
      position="screen"
    />
    <PropertyFreeModeCard
      v-else
      :entityDataCards="entityDataCards"
      :propertyDataCards="propertyDataCards"
      :initialIndex="propertyDataCards.findIndex((c) => c.about === data.card.about)"
      :onDragStart="() => {}"
      position="screen"
    />
    <!-- ROTATION -->
    <img class="rotate-icon" :src="rotateIcon" @pointerdown="startRotate" />
  </div>
</template>

<style scoped>
.node {
  position: relative;
  width: 160px;
  background: white;
  border-radius: 8px;
  transform-origin: center;
}

.card {
  padding: 10px;
}

.rotate-icon {
  position: absolute;
  top: -25px;
  left: 50%;
  width: 18px;
  height: 18px;
  transform: translateX(-50%);
  cursor: grab;
}
</style>
