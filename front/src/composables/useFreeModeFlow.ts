import { ref, markRaw, onMounted, onUnmounted } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import RotatableNode from '@/components/freeMode/RotatableNode.vue'
import EntityCardNode from '@/components/freeMode/EntityCardNode.vue'

export function useFreeModeFlow() {
  const nodes = ref<any[]>([])
  const edges = ref<any[]>([])
  const selectedNodes = ref<string[]>([])

  let draggedItem: any = null

  const nodeTypes = {
    'entity-card': markRaw(EntityCardNode),
    rotatable: markRaw(RotatableNode),
  }

  const { screenToFlowCoordinate, removeNodes } = useVueFlow()

  const onDragStart = (item: any) => {
    draggedItem = item
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()

    if (!draggedItem) return

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    nodes.value.push({
      id: crypto.randomUUID(),
      type: 'entity-card',
      position,
      data: {
        card: draggedItem,
        rotation: 0,
      },
    })

    draggedItem = null
  }

  const onSelectionChange = ({ nodes: sel }: any) => {
    selectedNodes.value = sel.map((n: any) => n.id)
  }

  const rotateGroup = (delta: number) => {
    nodes.value = nodes.value.map((n) => {
      if (!selectedNodes.value.includes(n.id)) return n

      return {
        ...n,
        data: {
          ...n.data,
          rotation: (n.data.rotation || 0) + delta,
        },
      }
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete') {
      removeNodes(selectedNodes.value)
    }

    if (e.shiftKey && e.key.toLowerCase() === 'r') {
      rotateGroup(15)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })

  return {
    nodes,
    edges,
    nodeTypes,
    onDragStart,
    onDrop,
    onSelectionChange,
  }
}
