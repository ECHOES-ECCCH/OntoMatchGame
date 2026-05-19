<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { useSelectedXML } from '@/stores/cards.store'
import EntityFreeModeCard from '@/components/freeMode/EntityFreeModeCard.vue'
import OntologyModal from '@/components/freeMode/OntologyModal.vue'
import { toggleFullscreen } from '@/utils/togglefullscreen'
import { useFreeModeFlow } from '@/composables/useFreeModeFlow'
import fullscreenLogo from '@/assets/img/fullscreen.svg'
import edit from '@/assets/img/edit.svg'
import closeMenu from '@/assets/img/close-arrow.svg'
import { filteredEntityCardsByBranch } from '@/composables/useSelectedCards'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import PropertyFreeModeCard from '@/components/freeMode/PropertyFreeModeCard.vue'

const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
const modal = ref(false)
const selectedOntology = ref('CIDOC CRM')
const fullscreen = ref(false)
const { nodes, edges, nodeTypes, onDragStart, onDrop, onSelectionChange, resetFlow } =
  useFreeModeFlow()
const showSidebar = ref(true)
const layoutRef = ref()
const entityBranches = ref(['entity'])

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

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

const filteredCard = computed(() => {
  if (!entityDataCards.value?.length) return []
  return filteredEntityCardsByBranch(entityDataCards.value, entityBranches.value)
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
          fit-view-on-init
          :selection-on-drag="true"
          :multi-selection-key="'Shift'"
          @selection-change="onSelectionChange"
          :node-types="nodeTypes"
        >
          <Background variant="dots" :gap="18" :size="1" color="#ccc" />
          <MiniMap />
          <Controls />
        </VueFlow>
      </div>
    </div>
  </div>
</template>
