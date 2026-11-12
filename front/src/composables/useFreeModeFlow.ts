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
   * Maximum distance (in px, flow coordinates) under which an instance and
   * an entity placed near each other are considered linked.
   */
  const LINK_PROXIMITY_THRESHOLD = 220

  const getNodeCenter = (node: any) => {
    const width = node.dimensions?.width ?? 180
    const height = node.dimensions?.height ?? 120
    return {
      x: node.position.x + width / 2,
      y: node.position.y + height / 2,
    }
  }

  const distanceBetween = (a: any, b: any) => {
    const centerA = getNodeCenter(a)
    const centerB = getNodeCenter(b)
    return Math.hypot(centerA.x - centerB.x, centerA.y - centerB.y)
  }

  /**
   * Links or unlinks an instance/entity node based on its current proximity
   * to a complementary node:
   * - if already linked but too far from its partner -> unlinks both sides
   * - otherwise, looks for a new nearby, free, complementary partner -> links them
   * Called both on initial drop and after a node has been dragged on the board.
   */
  const syncLinkForNode = (nodeRef: any) => {
    const currentNode = nodes.value.find((n) => n.id === nodeRef.id)
    if (!currentNode) return

    const kind = currentNode.data.card.kind
    if (kind !== 'instance' && kind !== 'entity') return

    const targetKind = kind === 'instance' ? 'entity' : 'instance'
    const ownLinkField = kind === 'instance' ? 'linkedEntityId' : 'linkedInstanceId'
    const partnerLinkField = kind === 'instance' ? 'linkedInstanceId' : 'linkedEntityId'

    const currentPartnerId = currentNode.data[ownLinkField]

    // 1. Already linked: check whether the partner is still close enough
    if (currentPartnerId) {
      const partnerNode = nodes.value.find((n) => n.id === currentPartnerId)

      if (!partnerNode) {
        // Partner not found (deleted) -> clean up the orphaned link
        nodes.value = nodes.value.map((n) =>
          n.id === currentNode.id ? { ...n, data: { ...n.data, [ownLinkField]: undefined } } : n,
        )
      } else {
        const d = distanceBetween(currentNode, partnerNode)
        if (d <= LINK_PROXIMITY_THRESHOLD) {
          // Still close enough, nothing to do
          return
        }

        // Too far -> unlink both sides
        nodes.value = nodes.value.map((n) => {
          if (n.id === currentNode.id)
            return { ...n, data: { ...n.data, [ownLinkField]: undefined } }
          if (n.id === partnerNode.id)
            return { ...n, data: { ...n.data, [partnerLinkField]: undefined } }
          return n
        })
      }
    }

    // 2. Not (or no longer) linked -> look for a new nearby, free partner
    let closest: any = null
    let closestDistance = Infinity

    nodes.value.forEach((n) => {
      if (n.id === currentNode.id) return
      if (n.data.card.kind !== targetKind) return
      if (n.data[partnerLinkField]) return // already linked to someone else

      const d = distanceBetween(currentNode, n)
      if (d <= LINK_PROXIMITY_THRESHOLD && d < closestDistance) {
        closest = n
        closestDistance = d
      }
    })

    if (!closest) return

    nodes.value = nodes.value.map((n) => {
      if (n.id === currentNode.id) return { ...n, data: { ...n.data, [ownLinkField]: closest.id } }
      if (n.id === closest.id)
        return { ...n, data: { ...n.data, [partnerLinkField]: currentNode.id } }
      return n
    })
  }

  /**
   * Called when the user releases a node after dragging it on the board
   * (not on the initial drop from the sidebar, but when repositioning it).
   */
  const onNodeDragStop = ({ node }: any) => {
    syncLinkForNode(node)
  }

  /**
   * Reorders nodes.value so that "instance" cards are always at the end of
   * the array (and therefore rendered on top visually), without changing the
   * relative order among themselves or among the other cards.
   */
  const bringInstancesToFront = () => {
    const instanceNodes = nodes.value.filter((n: any) => n.data.card.kind === 'instance')
    const otherNodes = nodes.value.filter((n: any) => n.data.card.kind !== 'instance')
    nodes.value = [...otherNodes, ...instanceNodes]
  }

  /**
   * Handles dropping an item onto the Vue Flow canvas.
   * Converts screen coordinates into flow coordinates and creates a new node.
   * If the dropped item is an instance or entity, checks proximity to link them.
   */
  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!draggedItem) return

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'free-card',

      position,

      data: {
        kind: draggedItem.type, // entity | property | instance
        card: draggedItem,
        rotation: 0,
      },
    }

    nodes.value.push(newNode)

    if (newNode.data.card.kind === 'instance' || newNode.data.card.kind === 'entity') {
      syncLinkForNode(newNode)
    }

    // Instances must always be displayed above other cards (Vue Flow stacks
    // nodes according to their order in the array: the last ones in the
    // array are rendered on top), regardless of the order in which they were
    // placed relative to entities/properties.
    bringInstancesToFront()

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
    onNodeDragStop,
    resetFlow,
  }
}
