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
import { filteredEntityCardsByBranch } from '@/composables/useSelectedCards'
import { toggleFullscreen } from '@/utils/togglefullscreen'
import { useFreeModeFlow } from '@/composables/useFreeModeFlow'
import fullscreenLogo from '@/assets/img/fullscreen.svg'
import edit from '@/assets/img/edit.svg'
import closeMenu from '@/assets/img/close-arrow.svg'
import instances from '@/assets/img/instances.jpg'

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
const modal = ref(false)
const instanceModal = ref(false)
const fullscreen = ref(false)
const { nodes, edges, nodeTypes, onDragStart, onDrop, onSelectionChange, resetFlow } =
  useFreeModeFlow()
const showSidebar = ref(true)
const layoutRef = ref()
const entityBranches = ref(['entity'])
const { zoomIn, zoomOut } = useVueFlow()

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

const selectedOntology = ref('CIDOC CRM')

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

const filteredCard = computed(() => {
  if (!entityDataCards.value?.length) return []
  return filteredEntityCardsByBranch(entityDataCards.value, entityBranches.value)
})

const onSelectInstance = (instance) => {
  currentInstance.value = instance
  instanceModal.value = false
}

const currentInstance = ref({
  Id: 'I1',
  Title: 'Hôtellerie de Marmoutier',
  Label: '',
  ImageName: instances,
})
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
    <div class="layout" ref="layoutRef">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-panel" :class="{ 'hide-sidebar': !showSidebar }">
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
          <img :src="fullscreenLogo" alt="fullscreen" />
        </button>

        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :selection-on-drag="true"
          :multi-selection-key="'Shift'"
          @selection-change="onSelectionChange"
          :node-types="nodeTypes"
          :default-viewport="{ zoom: 1 }"
          :nodes-selectable="true"
        >
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
