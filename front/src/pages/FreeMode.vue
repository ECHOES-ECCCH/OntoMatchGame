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

import type { CardInstances } from '@/types/card/cardInfo'
import instances from '@/assets/img/instances.jpg'
import InstructionsModal from '@/components/freeMode/InstructionsModal.vue'
import SaveAsModal from '@/components/freeMode/SaveAsModal.vue'
import BoardsRecordedModal from '@/components/freeMode/BoardsRecordedModal.vue'
import { updateFreeModeBoard, isUpdateFreeModeBoardLoading } from '@/services/freemode.service'
import { langStore } from '@/stores/lang.store'

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
const modal = ref(false)
const instanceModal = ref(false)
const fullscreen = ref(false)
const instructionsModal = ref(false)
const { nodes, edges, nodeTypes, onDragStart, onDrop, onSelectionChange, resetFlow } =
  useFreeModeFlow()
const showSidebar = ref(true)
const layoutRef = ref()
const entityBranches = ref(['entity'])
const { zoomIn, zoomOut } = useVueFlow('free-mode-flow')
const { exportFlow, importFlow } = useFreeModeBoard()
const { freeModeBoardData, currentBoard } = useFreeModeBoard()

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

const selectedOntology = ref('CIDOC CRM')
const saveAs = ref(false)
const openBoards = ref(false)

watch(
  selectedOntology,
  (newValue) => {
    loadCard(newValue)
    resetFlow()
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

const filteredCard = computed(() => {
  if (!entityDataCards.value?.length) return []
  return filteredEntityCardsByBranch(entityDataCards.value, entityBranches.value)
})

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

const saveCurrentBoard = async () => {
  console.log('passe ici')
  if (!currentBoard.value) return

  const flow = freeModeBoardData(selectedOntology.value)

  await updateFreeModeBoard({
    ...currentBoard.value,
    ontologyName: selectedOntology.value,
    freemodeData: flow,
  })
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
            :propertyDataCards="propertyDataCards"
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

        <!-- TOUJOURS VISIBLE -->
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
          </div>
          <Background variant="dots" :gap="18" :size="1" color="#ccc" />
          <MiniMap />
          <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="false" />
        </VueFlow>
      </div>
    </div>
  </div>
</template>
