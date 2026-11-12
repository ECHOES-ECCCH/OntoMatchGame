<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { useSelectedXML } from '@/stores/cards.store'
import EntityFreeModeCard from '@/components/freeMode/EntityFreeModeCard.vue'
import OntologyModal from '@/components/freeMode/OntologyModal.vue'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import PropertyFreeModeCard from '@/components/freeMode/PropertyFreeModeCard.vue'
import InstancesFreeModeCard from '@/components/freeMode/InstancesFreeModeCard.vue'
import InstancesModal from '@/components/freeMode/InstancesModal.vue'
import InstructionsModal from '@/components/freeMode/InstructionsModal.vue'
import SaveAsModal from '@/components/freeMode/SaveAsModal.vue'
import BoardsRecordedModal from '@/components/freeMode/BoardsRecordedModal.vue'
import { toggleFullscreen } from '@/utils/togglefullscreen'
import { useFreeModeFlow } from '@/composables/useFreeModeFlow'
import { filteredEntityCardsByBranch } from '@/composables/useSelectedCards'
import { useFreeModeBoard } from '@/composables/useFreeModeBoard'
import fullscreenLogo from '@/assets/img/fullscreen.svg'
import edit from '@/assets/img/edit.svg'
import closeMenu from '@/assets/img/close-arrow.svg'
import imp from '@/assets/img/importB.svg'
import exp from '@/assets/img/exportB.svg'
import instructions from '@/assets/img/instructions.svg'
import saveas from '@/assets/img/saveas.svg'
import save from '@/assets/img/save.svg'
import open from '@/assets/img/open.svg'
import backDoor from '@/assets/img/back-door.svg'
import instances from '@/assets/img/instances.jpg'
import type { CardInfo, CardInstances, CardPropertyInfo } from '@/types/card/cardInfo'
import { updateFreeModeBoard, isUpdateFreeModeBoardLoading } from '@/services/freemode.service'
import { langStore } from '@/stores/lang.store'

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
const modal = ref(false)
const instanceModal = ref(false)
const fullscreen = ref(false)
const instructionsModal = ref(false)
const {
  nodes,
  edges,
  nodeTypes,
  onDragStart,
  onDrop,
  onSelectionChange: onFlowSelectionChange,
  onNodeDragStop,
  resetFlow,
} = useFreeModeFlow()
const showSidebar = ref(true)
const layoutRef = ref()
const entityBranches = ref(['entity'])
const { zoomIn, zoomOut } = useVueFlow('free-mode-flow')
const { exportFlow, importFlow } = useFreeModeBoard()
const { freeModeBoardData, currentBoard, errorImportFlow, validatePropertiesCompleteness } =
  useFreeModeBoard()

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

const selectedOntology = ref('CIDOC CRM')
const saveAs = ref(false)
const openBoards = ref(false)

/**
 * Reload cards when ontology changes and reset flow
 */
watch(
  selectedOntology,
  (newValue) => {
    loadCard(newValue)
    resetFlow()
    currentBoard.value = null
  },
  { immediate: true },
)

const handleOntologyModal = (display: boolean) => {
  modal.value = display
}

const handleInstanceModal = (display: boolean) => {
  instanceModal.value = display
}

const handleInstructionsModal = () => {
  instructionsModal.value = true
}

const handleSaveAsModal = () => {
  saveAs.value = true
}

const handleOpenBoards = () => {
  openBoards.value = true
}

const toArray = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : [])

/**
 * Lookup "about" -> list of DIRECT children (entities that have this "about"
 * in their own subClasses). This is the reverse of subClasses.
 */
const directChildrenByAbout = computed(() => {
  const map = new Map<string, string[]>()

  ;(entityDataCards.value ?? []).forEach((e: any) => {
    const parents = Array.isArray(e.subClasses) ? e.subClasses : []
    parents.forEach((parentAbout: string) => {
      const existing = map.get(parentAbout) ?? []
      existing.push(e.about)
      map.set(parentAbout, existing)
    })
  })

  return map
})

/**
 * Checks whether a property is allowed for an entity, taking into account
 * its DIRECT parents (subClasses) and its DIRECT children (reverse lookup),
 * without traversing any further up or down the hierarchy.
 *
 * Special rule: if the entity has an empty subClasses list, it is a root class ->
 * all properties are allowed for it.
 */
const isPropertyAllowedForEntity = (property: CardPropertyInfo, entity: CardInfo) => {
  if (!property || !entity) return false

  const parents = entity.subClasses
  const isRoot =
    !parents ||
    (Array.isArray(parents) && parents.length === 0) ||
    (typeof parents === 'object' && !Array.isArray(parents) && Object.keys(parents).length === 0)

  if (isRoot) return true

  const directParents: string[] = Array.isArray(parents) ? parents : []
  const directChildren: string[] = directChildrenByAbout.value.get(entity.about) ?? []
  const relevantAbouts = [entity.about, ...directParents, ...directChildren]

  const allowed = [...toArray(property.domain), ...toArray(property.range)]
  return relevantAbouts.some((about) => allowed.includes(about))
}

const activePropertyCard = ref<CardPropertyInfo | null>(null)
const activeEntityCard = ref<CardInfo | null>(null)
const selectedEntityIds = ref<string[]>([])
const selectedEntityCards = ref<CardInfo[]>([])

/**
 * Filter entity cards based on selected branches
 */
const filteredCard = computed(() => {
  if (!entityDataCards.value?.length) return []

  // 1. Existing branch filter
  let result = filteredEntityCardsByBranch(entityDataCards.value, entityBranches.value)

  // 2. Additional filter by property selected on the board (with inheritance)
  if (activePropertyCard.value) {
    result = result.filter((entity) => isPropertyAllowedForEntity(activePropertyCard.value, entity))
  }

  return result
})

/**
 * Filter property cards based on the selected entity/entities on the board
 */
const filteredProperties = computed(() => {
  if (!propertyDataCards.value?.length) return propertyDataCards.value ?? []

  // Multiple entities selected -> union of properties valid for each (with inheritance)
  if (selectedEntityCards.value.length >= 2) {
    return propertyDataCards.value.filter((property) =>
      selectedEntityCards.value.some((entity) => isPropertyAllowedForEntity(property, entity)),
    )
  }

  // A single selected entity (with inheritance)
  if (activeEntityCard.value) {
    return propertyDataCards.value.filter((property) =>
      isPropertyAllowedForEntity(property, activeEntityCard.value!),
    )
  }

  return propertyDataCards.value
})

/**
 * Currently selected instance (default fallback)
 */
const currentInstance = ref({
  Id: 'I1',
  Title: 'Hôtellerie de Marmoutier',
  Label: '',
  ImageName: instances,
})

const onSelectInstance = (instance: CardInstances) => {
  currentInstance.value = instance
  instanceModal.value = false
}

const propertyCompletionError = ref<string | null>(null)
const connectionError = ref<string | null>(null)
let connectionErrorTimeout: ReturnType<typeof setTimeout> | null = null

/**
 * Shows a connection error message for a few seconds, then hides it automatically.
 */
const showConnectionError = (message: string) => {
  connectionError.value = message
  if (connectionErrorTimeout) clearTimeout(connectionErrorTimeout)
  connectionErrorTimeout = setTimeout(() => {
    connectionError.value = null
  }, 4000)
}

/**
 * Save current board state to backend
 */
const saveCurrentBoard = async () => {
  if (!currentBoard.value) return

  const error = validatePropertiesCompleteness()
  if (error) {
    propertyCompletionError.value = error
    return
  }

  propertyCompletionError.value = null

  const flow = freeModeBoardData(selectedOntology.value)

  await updateFreeModeBoard({
    ...currentBoard.value,
    ontologyName: selectedOntology.value,
    freemodeData: flow,
  })
}

const onSelectionChange = (params: any) => {
  onFlowSelectionChange(params)
}

/**
 * Handles a click on a board card:
 * - property: filters the entities (domain/range)
 * - entity: adds to the selection with Shift/Cmd, otherwise replaces it
 *  */
const onNodeClick = ({ event, node }: any) => {
  const isMultiSelect = event?.shiftKey || event?.metaKey

  if (node.data.card.kind === 'property') {
    activePropertyCard.value = node.data.card
    selectedEntityIds.value = []
    selectedEntityCards.value = []
    activeEntityCard.value = null
  }

  if (node.data.card.kind === 'entity') {
    activePropertyCard.value = null

    if (isMultiSelect) {
      if (selectedEntityIds.value.includes(node.id)) {
        selectedEntityIds.value = selectedEntityIds.value.filter((id) => id !== node.id)
      } else {
        selectedEntityIds.value = [...selectedEntityIds.value, node.id]
      }
    } else {
      selectedEntityIds.value = [node.id]
    }

    selectedEntityCards.value = selectedEntityIds.value
      .map((id) => nodes.value.find((n: any) => n.id === id)?.data.card)
      .filter(Boolean)

    activeEntityCard.value =
      selectedEntityCards.value.length === 1 ? selectedEntityCards.value[0] : null
  }

  /**
   * Instance selection: filters the properties as if its linked entity had been
   * selected (an instance has no domain/range of its own; the domain/range of its
   * associated entity is what matters).
   */

  if (node.data.card.kind === 'instance') {
    activePropertyCard.value = null
    selectedEntityIds.value = []

    const linkedEntityNode = node.data.linkedEntityId
      ? nodes.value.find((n: any) => n.id === node.data.linkedEntityId)
      : null

    if (linkedEntityNode) {
      selectedEntityCards.value = [linkedEntityNode.data.card]
      activeEntityCard.value = linkedEntityNode.data.card
    } else {
      // Freely placed instance, not yet associated with an entity
      selectedEntityCards.value = []
      activeEntityCard.value = null
    }
  }
}

const onPaneClick = () => {
  activePropertyCard.value = null
  activeEntityCard.value = null
  selectedEntityIds.value = []
  selectedEntityCards.value = []
}

/**
 * Called when the user releases a connection drawn between two handles.
 * Validates in real time before adding the edge:
 * * the connected entity must be compatible with the property's domain/range role
 * * a property can have only one entity as its domain and one as its range
 */
const onConnect = (connection: any) => {
  const { source, sourceHandle, target } = connection

  // The "source" node is always the property (domain/range handles are on the property card)
  const propertyNode = nodes.value.find((n: any) => n.id === source)
  const entityNode = nodes.value.find((n: any) => n.id === target)

  if (!propertyNode || !entityNode) return
  if (propertyNode.data.card.kind !== 'property' || entityNode.data.card.kind !== 'entity') return

  const role = sourceHandle // 'domain' or 'range'
  if (role !== 'domain' && role !== 'range') return

  // 1. Check consistency: the entity must be valid for this specific role
  const allowedForRole = toArray(propertyNode.data.card[role])
  const relevantAbouts = [
    entityNode.data.card.about,
    ...toArray(entityNode.data.card.subClasses),
    ...(directChildrenByAbout.value.get(entityNode.data.card.about) ?? []),
  ]
  const isRoot =
    !entityNode.data.card.subClasses ||
    (Array.isArray(entityNode.data.card.subClasses) &&
      entityNode.data.card.subClasses.length === 0) ||
    (typeof entityNode.data.card.subClasses === 'object' &&
      !Array.isArray(entityNode.data.card.subClasses) &&
      Object.keys(entityNode.data.card.subClasses).length === 0)

  const isValidForRole = isRoot || relevantAbouts.some((about) => allowedForRole.includes(about))

  if (!isValidForRole) {
    showConnectionError(
      `${entityNode.data.card.about} is not valid as ${role} for ${propertyNode.data.card.about}.`,
    )
    return
  }

  // 2. Check that no other entity is already connected to this same handle (domain or range)
  const alreadyConnected = edges.value.some(
    (e: any) => e.source === source && e.sourceHandle === role,
  )

  if (alreadyConnected) {
    showConnectionError(`${propertyNode.data.card.about} already has an entity as ${role}.`)
    return
  }

  const newEdge = {
    id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
    ...connection,
  }
  edges.value = [...edges.value, newEdge]
}
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div id="free-mode-flow" class="free-mode-container" ref="layoutRef">
    <OntologyModal
      v-if="modal === true"
      :handleOntologyModal="handleOntologyModal"
      v-model="selectedOntology"
    />
    <InstancesModal
      v-model:selected="currentInstance"
      v-model:open="instanceModal"
      @update:selected="onSelectInstance"
      :selectedOntology="selectedOntology"
    />
    <InstructionsModal v-model:open="instructionsModal" />
    <SaveAsModal v-model:open="saveAs" :ontology="selectedOntology" />
    <BoardsRecordedModal v-model:open="openBoards" :ontology="selectedOntology" />
    <div class="layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div v-if="showSidebar" class="sidebar-panel" :class="{ 'hide-sidebar': !showSidebar }">
          <div class="ontology-selected">
            <button class="back-door aside">
              <router-link to="/home">
                <img :src="backDoor" alt="back" title="back" />
              </router-link>
            </button>
            <h2>{{ selectedOntology }}</h2>

            <button @click="handleOntologyModal(true)">
              <img :src="edit" alt="edit" />
            </button>
          </div>
          <EntityFreeModeCard
            :entityDataCards="entityDataCards"
            :filteredCard="filteredCard"
            :branches="entityBranches"
            @update:branches="entityBranches = $event"
            :onDragStart="onDragStart"
            position="aside"
          />
          <PropertyFreeModeCard
            :entityDataCards="entityDataCards"
            :propertyDataCards="filteredProperties"
            :onDragStart="onDragStart"
            position="aside"
          />
          <InstancesFreeModeCard
            @open-instance-modal="handleInstanceModal(true)"
            :currentInstance="currentInstance"
            :onDragStart="onDragStart"
            position="aside"
          />
        </div>

        <!-- ALWAYS VISIBLE -->
        <button class="toggle-sidebar" @click="showSidebar = !showSidebar">
          <img :src="closeMenu" />
        </button>
      </aside>

      <!-- FLOW -->
      <div class="flow-wrapper" @drop="onDrop" @dragover.prevent>
        <button class="fullscreen-free-mode" @click="toggleFullscreen(layoutRef)">
          <span>{{
            langStore.t('static-text.BoardScene.boardscene-scene-footer-fullscreen-text')
          }}</span>
          <img :src="fullscreenLogo" alt="fullscreen" />
        </button>
        <div class="board-zoom nodrag nopan">
          <button @click.stop="() => zoomIn({ duration: 300 })">+</button>
          <button @click.stop="() => zoomOut({ duration: 300 })">-</button>
        </div>
        <button class="back-door">
          <router-link to="/home"> <img :src="backDoor" alt="back" title="back" /> </router-link>
        </button>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :selection-on-drag="true"
          :multi-selection-key="'Shift'"
          @selection-change="onSelectionChange"
          :default-viewport="{ zoom: 1 }"
          @node-click="onNodeClick"
          @node-drag-stop="onNodeDragStop"
          @pane-click="onPaneClick"
          @connect="onConnect"
          :nodes-selectable="true"
          :delete-key-code="['Delete', 'Backspace']"
        >
          <div class="toolbar nodrag nopan">
            <button @click="handleSaveAsModal">
              <label class="file-label"> <img :src="saveas" alt="saveas" title="save as" /></label>
            </button>
            <button
              :disabled="!currentBoard || isUpdateFreeModeBoardLoading"
              @click="saveCurrentBoard"
            >
              <label class="file-label"> <img :src="save" alt="save" title="save" /></label>
            </button>
            <button @click="handleOpenBoards">
              <label class="file-label">
                <img :src="open" alt="open" title="open existing" />
              </label>
            </button>
            <button @click="handleInstructionsModal">
              <label class="file-label instruction-button">
                <img :src="instructions" alt="instructions" title="instructions"
              /></label>
            </button>
            <button @click="exportFlow(selectedOntology)">
              <label class="file-label"> <img :src="exp" alt="export" title="export" /></label>
            </button>
            <label class="file-label">
              <input hidden type="file" accept=".json" @change="importFlow" ref="fileInput" /><img
                :src="imp"
                alt="import"
                title="import"
              />
            </label>
            <div class="board-title" v-if="currentBoard?.title">
              {{ langStore.t('static-text.FreeModeScene.freemode-scene-project') }} :
              {{ currentBoard?.title }}
            </div>
          </div>
          <Background variant="dots" :gap="18" :size="1" color="#ccc" />
          <MiniMap />
          <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="false" />
          <p class="error-import" v-if="errorImportFlow">
            {{ errorImportFlow }}
          </p>
          <p class="error-import" v-if="propertyCompletionError">
            {{ propertyCompletionError }}
          </p>
          <p class="error-import" v-if="connectionError">
            {{ connectionError }}
          </p></VueFlow
        >
      </div>
    </div>
  </div>
</template>
