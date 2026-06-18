import { ref, markRaw, onMounted, onUnmounted } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import FreeCardNode from '@/components/freeMode/FreeCardNode.vue'

export function useFreeModeFlow() {
  // Reactive graph state (Vue Flow nodes + edges)
  const nodes = ref<any[]>([])
  const edges = ref<any[]>([])

  // Stores IDs of currently selected nodes in the canvas
  const selectedNodes = ref<string[]>([])

  // Temporarily stores the item being dragged before drop
  let draggedItem: any = null

  // Custom Vue Flow node types registry
  const nodeTypes = {
    'free-card': markRaw(FreeCardNode),
  }

  const { screenToFlowCoordinate, removeNodes } = useVueFlow('free-mode-flow')

  const resetFlow = () => {
    nodes.value = []
    edges.value = []
    selectedNodes.value = []
    draggedItem = null
  }

  /**
   * Called when a drag operation starts.
   * Stores the dragged card + its type for later node creation.
   */
  const onDragStart = (card: any, type: string) => {
    draggedItem = { ...card, type }
  }

  /**
   * Handles dropping an item onto the Vue Flow canvas.
   * Converts screen coordinates into flow coordinates and creates a new node.
   */
  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!draggedItem) return

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    nodes.value.push({
      id: `node-${Date.now()}`,
      type: 'free-card',

      position,

      data: {
        kind: draggedItem.type, // entity | property | instance
        card: draggedItem,
        rotation: 0,
      },
    })

    draggedItem = null
  }

  /**
   * Updates the list of selected nodes when selection changes in Vue Flow.
   */
  const onSelectionChange = ({ nodes: sel }: any) => {
    selectedNodes.value = sel.map((n: any) => n.id)
  }

  /**
   * Rotates all currently selected nodes by a given delta angle.
   */
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

  /**
   * Global keyboard shortcuts handler:
   * - Delete: removes selected nodes
   * - Shift + R: rotates selected nodes
   */
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete') {
      removeNodes(selectedNodes.value)
    }

    if (e.shiftKey && e.key.toLowerCase() === 'r') {
      rotateGroup(15)
    }
  }

  // Register global keyboard listeners on mount
  onMounted(() => window.addEventListener('keydown', onKeyDown))

  // Clean up listeners on unmount
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

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
