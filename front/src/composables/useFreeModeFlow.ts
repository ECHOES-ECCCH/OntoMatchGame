import { ref, markRaw, onMounted, onUnmounted } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import RotatableNode from '@/components/freeMode/RotatableNode.vue'
import FreeCardNode from '@/components/freeMode/FreeCardNode.vue'

export function useFreeModeFlow() {
  const nodes = ref<any[]>([])
  const edges = ref<any[]>([])
  const selectedNodes = ref<string[]>([])

  // Reset board in progress
  const resetFlow = () => {
    nodes.value = []
    edges.value = []
    selectedNodes.value = []
    draggedItem = null
  }

  let draggedItem: any = null

  const nodeTypes = {
    'free-card': markRaw(FreeCardNode),
    rotatable: markRaw(RotatableNode),
  }

  const { screenToFlowCoordinate, removeNodes } = useVueFlow()

  const onDragStart = (card, type) => {
    draggedItem = { ...card, type }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!draggedItem) return

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    nodes.value.push({
      id: `node-${Date.now()}`, // ✅ id unique
      type: 'free-card',
      position, // ✅ position dans le flow
      data: {
        kind: draggedItem.type, // ✅ .type et non .kind
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
    resetFlow,
  }
}
