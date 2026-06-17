<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'
import rotateIcon from '@/assets/img/rotate.svg'
import { useSelectedXML } from '@/stores/cards.store'
import type { CardInfo } from '@/types/card/cardInfo'
import EntityFreeModeCard from '@/components/freeMode/EntityFreeModeCard.vue'
import PropertyFreeModeCard from './PropertyFreeModeCard.vue'
import InstancesFreeModeCard from './InstancesFreeModeCard.vue'

const props = defineProps<{
  id: string
  selected: boolean
  data: {
    kind: 'entity' | 'property' | 'instance'
    card: CardInfo
    rotation?: number
  }
}>()

const { updateNodeData, getNodes } = useVueFlow('free-mode-flow')
const { entityDataCards, propertyDataCards } = useSelectedXML()

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

  // Snapshot des rotations au moment du clic
  const selectedNodes = getNodes.value.filter((n) => n.selected)
  const initialRotations = new Map(selectedNodes.map((n) => [n.id, n.data.rotation || 0]))

  const onMove = (ev: PointerEvent) => {
    if (!rotating) return
    const delta = (getAngle(ev) - startAngle) * (180 / Math.PI)
    selectedNodes.forEach((node) => {
      updateNodeData(node.id, {
        ...node.data,
        rotation: (initialRotations.get(node.id) || 0) + delta,
      })
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
</script>

<template>
  <div
    class="node"
    :class="{ 'node--selected': selected }"
    :style="{ transform: `rotate(${data.rotation || 0}deg)`, transformOrigin: 'center center' }"
  >
    <EntityFreeModeCard
      v-if="data.card.kind === 'entity'"
      :entityDataCards="entityDataCards"
      :initialIndex="entityDataCards.findIndex((c) => c.about === data.card.about)"
      :onDragStart="() => {}"
      position="flow"
    />
    <PropertyFreeModeCard
      v-else-if="data.card.kind === 'property'"
      :entityDataCards="entityDataCards"
      :propertyDataCards="propertyDataCards"
      :initialIndex="propertyDataCards.findIndex((c) => c.about === data.card.about)"
      :onDragStart="() => {}"
      position="flow"
    />
    <InstancesFreeModeCard
      v-else
      :currentInstance="data.card"
      :onDragStart="() => {}"
      position="flow"
      :selected="selected"
    />
    <img class="rotate-icon" :src="rotateIcon" @pointerdown="startRotate" />
  </div>
</template>
