import type { BoardCards } from '@/types/freemode'
import { useVueFlow } from '@vue-flow/core'
import { nextTick, ref } from 'vue'
const currentBoard = ref<BoardCards | null>(null)

export function useFreeModeBoard() {
  const { nodes, edges, viewport, setNodes, setEdges, setViewport } = useVueFlow()

  type NodeKind = 'entity' | 'property' | 'instance'

  const freeModeBoardData = (ontology: string) => {
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

    const flow = {
      ZoomLevel: viewport.value?.zoom ?? 1.0,
      Entities: mapNodesByKind('entity'),
      Properties: mapNodesByKind('property'),
      Instances: mapNodesByKind('instance'),
      Edges: edges.value.map((e) => ({ ...e })),
    }

    return flow
  }

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

  const nodesInfos = async (flow: BoardCards) => {
    const createNodes = (items: any[]) =>
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

    // ✅ Ordre garanti : vider → attendre → remplir → viewport
    setNodes([])
    setEdges([])

    await nextTick()

    setNodes(nodesImported)
    setEdges(flow.Edges ?? [])

    await nextTick()

    setViewport({ x: 0, y: 0, zoom: flow.ZoomLevel ?? 1 })
  }

  const importFlow = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const text = await file.text()
    const flow = JSON.parse(text)

    return nodesInfos(flow)
  }

  const openSaveBoard = async (board: BoardCards) => {
    currentBoard.value = board
    return nodesInfos(board.freemodeData)
  }
  return { exportFlow, importFlow, freeModeBoardData, openSaveBoard, currentBoard }
}
