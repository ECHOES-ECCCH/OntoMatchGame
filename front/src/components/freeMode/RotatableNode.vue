<template>
  <div class="node-root">
    <div class="node" :style="{ transform: `rotate(${rotation}deg)` }">
      {{ data.label }}

      <div class="rotate-handle" @pointerdown="startRotate" />
      <img @pointerdown="startRotate" :src="rotate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import rotate from '@/assets/img/rotate.svg'

type NodeData = {
  label: string
  rotation?: number
}

const props = defineProps<{
  id: string
  data: NodeData
}>()

const { updateNodeData } = useVueFlow()

const rotation = ref(props.data.rotation || 0)

let rotating = false
let center = { x: 0, y: 0 }
let startAngle = 0
let startRotation = 0

/* --------------------
   ANGLE (STABLE LOCAL)
---------------------*/
const getAngle = (e: PointerEvent) => Math.atan2(e.clientY - center.y, e.clientX - center.x)

/* --------------------
   START
---------------------*/
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

    rotation.value = startRotation + delta
  }

  const stop = () => {
    rotating = false

    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', stop)
    window.removeEventListener('pointercancel', stop)

    updateNodeData(props.id, {
      ...props.data,
      rotation: rotation.value,
    })
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', stop)
  window.addEventListener('pointercancel', stop)
}
</script>

<style>
.node-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node {
  width: 120px;
  height: 60px;
  background: lightcoral;
  border-radius: 8px;
  position: relative;
  user-select: none;
  transform-origin: center;
  will-change: transform;
  transition:
    box-shadow 0.15s ease,
    outline 0.15s ease;
}

/* ✨ état sélectionné Vue Flow */
.vue-flow__node.selected .node {
  outline: 2px solid #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.rotate-handle {
  position: absolute;
  top: -25px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #333;
  border-radius: 50%;
  transform: translateX(-50%);
  cursor: grab;
}
</style>
