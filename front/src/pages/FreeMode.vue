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

import type { CardInstances } from '@/types/card/cardInfo'
import instances from '@/assets/img/instances.jpg'
import InstructionsFreeModeModal from '@/components/freeMode/InstructionsFreeModeModal.vue'
import SaveAsModal from '@/components/freeMode/SaveAsModal.vue'

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
const { zoomIn, zoomOut } = useVueFlow()
const { exportFlow, importFlow, freeModeBoardData } = useFreeModeBoard()

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

const selectedOntology = ref('CIDOC CRM')
const saveAs = ref(false)

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

const handleSavaAsModal = () => {
  saveAs.value = true
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
</script>

<template>
  <PagesLoader v-if="isDataCardsLoading" />
  <div class="free-mode-container">
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
    <InstructionsFreeModeModal v-model:open="instructionsModal" />
    <SaveAsModal v-model:open="saveAs" :ontology="selectedOntology" />
    <div class="layout" ref="layoutRef">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div v-if="showSidebar" class="sidebar-panel" :class="{ 'hide-sidebar': !showSidebar }">
          <div class="ontology-selected">
            <h2>CIDOC CRM</h2>

            <button v-if="!fullscreen" @click="handleOntologyModal(true)">
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
          Plein ecran <img :src="fullscreenLogo" alt="fullscreen" />
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
        >
          <div class="toolbar nodrag nopan">
            <label class="file-label"
              ><button @click="handleSavaAsModal">
                <img :src="saveas" alt="saveas" title="save as" /></button
            ></label>
            <label class="file-label"
              ><button @click="handleInstructionsModal">
                <img :src="save" alt="save" title="save" /></button
            ></label>

            <label class="file-label instruction-button"
              ><button @click="handleInstructionsModal">
                <img :src="instructions" alt="instructions" title="instructions" /></button
            ></label>

            <label class="file-label"
              ><button @click="exportFlow(selectedOntology)">
                <img :src="exp" alt="export" title="export" /></button
            ></label>

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
          <div class="board-zoom">
            <button @click="zoomIn({ duration: 200, scale: 1.3 })">+</button>

            <button @click="zoomOut({ duration: 200, scale: 1.3 })">-</button>
          </div>
        </VueFlow>
      </div>
    </div>
  </div>
</template>
