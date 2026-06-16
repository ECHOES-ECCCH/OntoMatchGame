import type { BoardCards, FreeModeBoard } from '@/types/freemode'
import { useVueFlow } from '@vue-flow/core'
import { nextTick, ref } from 'vue'
type BoardEntity = BoardCards['Entities'][number]
type BoardProperty = BoardCards['Properties'][number]
type BoardInstance = BoardCards['Instances'][number]

type BoardCardItem = BoardEntity | BoardProperty | BoardInstance

const currentBoard = ref<FreeModeBoard | null>(null)
const errorImportFlow = ref<string | null>(null)

export function useFreeModeBoard() {
  const { nodes, edges, viewport, setNodes, setEdges, setViewport } = useVueFlow()

  type NodeKind = 'entity' | 'property' | 'instance'

  /**
   * Extracts the current Vue Flow state and converts it into a serializable board object.
   * This is used for saving/exporting the free-mode graph.
   */
  const freeModeBoardData = (ontology: string) => {
    /**
     * Maps nodes of a specific type (entity/property/instance)
     * into a normalized export format.
     */
    const mapNodesByKind = (kind: NodeKind) => {
      return nodes.value
        .filter((n) => n?.data?.card?.kind === kind)
        .map((n) => ({
          ontology,
          Id: n.data?.card?.id ?? n.data?.card?.Id ?? n.id,
          Position: { x: n.position.x, y: n.position.y },
          Rotation: n.data?.rotation ?? 0,
          Kind: n.data?.card?.kind,
          Card: n.data?.card ? JSON.parse(JSON.stringify(n.data.card)) : null,
        }))
    }

    // Full exported flow structure
    const flow = {
      ZoomLevel: viewport.value?.zoom ?? 1.0,
      Entities: mapNodesByKind('entity'),
      Properties: mapNodesByKind('property'),
      Instances: mapNodesByKind('instance'),
      Edges: edges.value.map((e) => ({ ...e })),
    }

    return flow
  }

  /**
   * Exports the current board as a downloadable JSON file.
   */
  const exportFlow = (ontology: string) => {
    const flowData = freeModeBoardData(ontology)

    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'OMG_ExportedBoard.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Converts a saved board into Vue Flow nodes.
   * Used when importing or restoring a saved graph.
   */
  const nodesInfos = async (flow: BoardCards) => {
    /**
     * Converts raw saved items into Vue Flow node format.
     */
    const createNodes = (items: BoardCardItem[]) =>
      items
        .filter((item) => item?.Id)
        .map((item) => ({
          id: String(item.Id),
          type: 'free-card',
          position: {
            x: item.Position?.x ?? 0,
            y: item.Position?.y ?? 0,
          },
          data: {
            kind: item.Kind ?? 'entity',
            card: item.Card ?? null,
            rotation: item.Rotation ?? 0,
          },
        }))

    const nodesImported = [
      ...createNodes(flow.Entities ?? []),
      ...createNodes(flow.Properties ?? []),
      ...createNodes(flow.Instances ?? []),
    ]

    // Reset graph before applying new data to avoid layout glitches
    setNodes([])
    setEdges([])

    await nextTick()

    // Apply imported graph data
    setNodes(nodesImported)
    setEdges(flow.Edges ?? [])

    await nextTick()

    // Restore zoom and position of the viewport
    setViewport({ x: 0, y: 0, zoom: flow.ZoomLevel ?? 1 })
  }

  /**
   * Imports a board from a JSON file selected by the user.
   */
  const importFlow = async (event: Event) => {
    errorImportFlow.value = null

    try {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      const text = await file.text()
      const flow = JSON.parse(text)

      // Validation minimale
      if (
        !flow ||
        !Array.isArray(flow.Entities) ||
        !Array.isArray(flow.Properties) ||
        !Array.isArray(flow.Instances) ||
        !Array.isArray(flow.Edges)
      ) {
        throw new Error('Le fichier importé ne correspond pas au format attendu.')
      }

      await nodesInfos(flow)
    } catch (error) {
      errorImportFlow.value =
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'import."
    }
  }

  /**
   * Opens a previously saved board and loads it into the Vue Flow canvas.
   */
  const openSaveBoard = async (board: FreeModeBoard) => {
    currentBoard.value = board
    return nodesInfos(board.freemodeData)
  }
  return { exportFlow, importFlow, freeModeBoardData, openSaveBoard, currentBoard, errorImportFlow }
}
