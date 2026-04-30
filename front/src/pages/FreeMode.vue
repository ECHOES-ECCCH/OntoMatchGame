<template>
  <div class="layout" ref="layoutRef">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div
        v-for="item in items"
        :key="item.id"
        class="card"
        draggable="true"
        @dragstart="onDragStart(item)"
      >
        {{ item.label }}
      </div>
      <!-- <div class="carousel-container">
        <div class="entity-card">
          <div class="scope-note-text" v-show="showScopeNote">
            <button @click="showScopeNote = false">Close</button>
          </div>
          <div v-show="!showScopeNote" class="card-inner">
            <div class="card-name">
              <div>
                <span class="prefix">{{ cardInfo[totalCards.position as Position].id }}</span>
                <span class="name">{{ cardInfo[totalCards.position as Position].labels.en }}</span>
              </div>
              <span class="image-card">
                <img
                  v-for="icon in getIcon(cardInfo[totalCards.position as Position].branch)"
                  :key="icon"
                  :src="icon"
                />
              </span>
            </div>

            <div class="card-content">
              <EntitySuperclassesSubclasses
                :position="totalCards.position"
                :cardInfo="cardInfo"
                @update:cardInfo="handleCardInfoUpdate"
                :superSubClasses="superSubClasses"
                :entityDataCards="entityDataCards"
              />
              <div class="scope-note">
                <button
                  v-if="cardInfo[totalCards.position as Position].comment"
                  @click="showScopeNote = !showScopeNote"
                >
                  Scope Note
                </button>
              </div>
            </div>
          </div>
        </div> -->

      <!-- <BranchesFilter
          :model-value="branches[totalCards.position as Position]"
          @update:model-value="
            $emit('update:branches', {
              position: totalCards.position as EntityPosition,
              value: $event,
            })
          "
          orientation="horizontal"
        />

        <div class="range">
          <button
            :disabled="showSolution"
            type="button"
            :style="showSolution && 'cursor: not-allowed'"
            @click="handlePrevious(totalCards.position as Position, totalCards.cards as CardInfo[])"
          >
            -
          </button>
          <input
            type="range"
            min="0"
            :max="(totalCards.cards as CardInfo[])?.length - 1"
            class="slider"
            :style="showSolution && 'cursor: not-allowed'"
            :value="currentIndexes[totalCards.position]"
            @input="
              handleSliderChange(
                totalCards.position,
                Number(($event.target as HTMLInputElement).value),
                totalCards.cards as CardInfo[],
              )
            "
            :disabled="showSolution"
          />
          <div class="slider-buttons">
            <button
              :style="showSolution && 'cursor: not-allowed'"
              :disabled="showSolution"
              type="button"
              @click="handleNext(totalCards.position as Position, totalCards.cards as CardInfo[])"
            >
              +
            </button>
          </div>
        </div>

        <div
          class="number"
          :class="{ active: index === currentIndexes[totalCards.position as Position] }"
          v-for="(card, index) in totalCards.cards"
          :key="index"
        >
          {{ (totalCards.cards as CardInfo[]).length }}/{{ totalCards.totalCards }}
        </div>
      </div> -->
    </aside>

    <!-- FLOW -->
    <div class="flow-wrapper" @drop="onDrop" @dragover.prevent>
      <!-- <button class="fullscreen-btn" @click="toggleFullscreen">⛶</button> -->
      <button class="fullscreen-btn" @click="toggleFullscreen">
        <img :src="fullscreen" alt="fullscreen" />
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
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import fullscreen from '@/assets/img/fullscreen.svg'
const { entityDataCards, propertyDataCards, loadCard, isDataCardsLoading } = useSelectedXML()

import RotatableNode from '@/components/freeMode/RotatableNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { useSelectedXML } from '@/stores/cards.store'

/* --------------------
   STATE
---------------------*/
const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const selectedNodes = ref<string[]>([])

const layoutRef = ref<HTMLElement | null>(null)

let draggedItem: any = null

/* --------------------
   NODE TYPES
---------------------*/
const nodeTypes = {
  rotatable: markRaw(RotatableNode),
}

/* --------------------
   SIDEBAR
---------------------*/
const items = ref([
  { id: 'a', label: '📦 Bloc A' },
  { id: 'b', label: '🧱 Bloc B' },
  { id: 'c', label: '⚡ Bloc C' },
])

const onDragStart = (item: any) => {
  draggedItem = item
}

/* --------------------
   VUE FLOW
---------------------*/
const { screenToFlowCoordinate, removeNodes } = useVueFlow()

/* --------------------
   DROP
---------------------*/
const onDrop = (event: DragEvent) => {
  event.preventDefault()
  if (!draggedItem) return

  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  })

  nodes.value.push({
    id: crypto.randomUUID(),
    type: 'rotatable',
    position,
    data: {
      label: draggedItem.label,
      rotation: 0,
    },
  })

  draggedItem = null
}

/* --------------------
   SELECTION
---------------------*/
const onSelectionChange = ({ nodes: sel }: any) => {
  selectedNodes.value = sel.map((n: any) => n.id)
}

/* --------------------
   ROTATE GROUP
---------------------*/
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

/* --------------------
   KEYBOARD
---------------------*/
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Delete') {
    removeNodes(selectedNodes.value)
  }

  if (e.shiftKey && e.key.toLowerCase() === 'r') {
    rotateGroup(15)
  }
}

window.addEventListener('keydown', onKeyDown)

/* --------------------
   FULLSCREEN
---------------------*/
const toggleFullscreen = async () => {
  const el = layoutRef.value
  if (!el) return

  if (!document.fullscreenElement) {
    await el.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
  background: #1e1e1e;
}

.sidebar {
  width: 200px;
  background: #222;
  color: white;
  padding: 10px;
}

.card {
  background: #444;
  padding: 10px;
  margin-bottom: 10px;
  cursor: grab;
  border-radius: 6px;
}

.flow-wrapper {
  flex: 1;
  height: 100vh;
  position: relative;
  background: #f5f5f5;
}

.fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 6px 10px;
}

.vue-flow__panel.right {
  background-color: darkgray;
}
</style>
