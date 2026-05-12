<script setup lang="ts">
import { ref, markRaw, onMounted, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import fullscreenLogo from '@/assets/img/fullscreen.svg'
import edit from '@/assets/img/edit.svg'

import RotatableNode from '@/components/freeMode/RotatableNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { useSelectedXML } from '@/stores/cards.store'
import EntityFreeModeCard from '@/components/freeMode/EntityFreeModeCard.vue'
import OntologyModal from '@/components/freeMode/OntologyModal.vue'
import EntityCardNode from '@/components/freeMode/EntityCardNode.vue'
import { toggleFullscreen } from '@/utils/togglefullscreen'
import { useFreeModeFlow } from '@/composables/useFreeModeFlow'
const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()
const modal = ref(false)
const selectedOntology = ref('CIDOC CRM')
const fullscreen = ref(false)
const { nodes, edges, nodeTypes, onDragStart, onDrop, onSelectionChange } = useFreeModeFlow()

document.addEventListener('fullscreenchange', () => {
  fullscreen.value = !!document.fullscreenElement
})

watch(
  selectedOntology,
  (newValue) => {
    loadCard(newValue)
  },
  { immediate: true },
)

const handleOntologyModal = (display: boolean) => {
  modal.value = display
}
</script>

<template>
  <div class="free-mode-container">
    <OntologyModal
      v-if="modal === true"
      :handleOntologyModal="handleOntologyModal"
      v-model="selectedOntology"
    />
    <div class="layout" ref="layoutRef">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="ontology-selected">
          <h2>CIDOC CRM</h2>
          <button v-if="!fullscreen" @click="handleOntologyModal(true)">
            <img :src="edit" alt="edit" title="Changer d'ontologie" />
          </button>
        </div>

        <EntityFreeModeCard
          :entityDataCards="entityDataCards"
          :onDragStart="onDragStart"
          position="aside"
        />
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
