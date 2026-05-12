<script setup lang="ts">
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data: {
    label: string
    rotation?: number
  }
}>()

const { updateNodeData } = useVueFlow()

const rotation = ref(props.data.rotation || 0)

let rotating = false
let center = { x: 0, y: 0 }
let startAngle = 0
let startRotation = 0

const getAngle = (e: PointerEvent) => Math.atan2(e.clientY - center.y, e.clientX - center.x)

const startRotate = (e: PointerEvent) => {
  rotating = true

  const el = (e.currentTarget as HTMLElement).parentElement as HTMLElement
  const rect = el.getBoundingClientRect()

  center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }

  startAngle = getAngle(e)
  startRotation = rotation.value

  const onMove = (ev: PointerEvent) => {
    if (!rotating) return

    const currentAngle = getAngle(ev)
    const delta = (currentAngle - startAngle) * (180 / Math.PI)

    const newRotation = startRotation + delta

    rotation.value = newRotation

    updateNodeData(props.id, {
      ...props.data,
      rotation: newRotation,
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
      <div style="background: yellow; width: 20px; height: 20px"></div>

      {{ data.label }}

      <!-- handle rotation -->
      <div class="rotate-handle" @pointerdown="startRotate" />

      <!-- DEBUG (tu peux enlever après) -->
      <div style="width: 10px; height: 10px; background: red"></div>
    </div>
  </div>
</template>
