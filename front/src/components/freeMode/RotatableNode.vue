<script setup lang="ts">
import { computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'

/**
 * Vue Flow node props
 * - label: displayed text
 * - rotation: node rotation in degrees
 */

const props = defineProps<{
  id: string
  data: {
    label: string
    rotation?: number
  }
}>()

const { updateNodeData, getNodes } = useVueFlow('free-mode-flow')

const rotation = computed(() => props.data.rotation || 0)

/**
 * Rotation interaction state (shared across pointer events)
 */
let rotating = false
let center = { x: 0, y: 0 }
let startAngle = 0

/**
 * Compute angle between pointer and node center
 */
const getAngle = (e: PointerEvent) => Math.atan2(e.clientY - center.y, e.clientX - center.x)

/**
 * Start rotation interaction
 * - compute node center
 * - snapshot initial angles for selected nodes
 */
const startRotate = (e: PointerEvent) => {
  rotating = true

  const el = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = el.getBoundingClientRect()

  // Node center in screen coordinates
  center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }

  startAngle = getAngle(e)

  // Snapshot initial rotation of all selected nodes
  const selectedNodes = getNodes.value.filter((n) => n.selected)
  const initialRotations = new Map(selectedNodes.map((n) => [n.id, n.data.rotation || 0]))

  /**
   * Update rotation while dragging
   * Applies same delta to all selected nodes
   */
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
