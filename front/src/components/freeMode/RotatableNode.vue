<script setup lang="ts">
import { computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data: {
    label: string
    rotation?: number
  }
}>()

const { updateNodeData, getNodes } = useVueFlow('free-mode-flow')

const rotation = computed(() => props.data.rotation || 0)

let rotating = false
let center = { x: 0, y: 0 }
let startAngle = 0

const getAngle = (e: PointerEvent) => Math.atan2(e.clientY - center.y, e.clientX - center.x)

const startRotate = (e: PointerEvent) => {
  rotating = true

  const el = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = el.getBoundingClientRect()

  // 👇 Centre en coordonnées écran, corrigé avec le zoom
  center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }

  startAngle = getAngle(e)

  // 👇 Recalculer au moment du clic, pas au montage
  const selectedNodes = getNodes.value.filter((n) => n.selected)
  const initialRotations = new Map(selectedNodes.map((n) => [n.id, n.data.rotation || 0]))

  const onMove = (ev: PointerEvent) => {
    if (!rotating) return

    const currentAngle = getAngle(ev)
    const delta = (currentAngle - startAngle) * (180 / Math.PI)

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
    window.removeEventListener('pointercancel', stop)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', stop)
  window.addEventListener('pointercancel', stop)
}
</script>

<template>
  <div class="node-root">
    <div class="node-rotable" :style="{ transform: `rotate(${rotation}deg)` }">
      {{ data.label }}

      <!-- handle rotation -->
      <div class="rotate-handle" @pointerdown="startRotate" />

      <!-- DEBUG (tu peux enlever après) -->
      <div style="width: 10px; height: 10px; background: red"></div>
    </div>
  </div>
</template>
