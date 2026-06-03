<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import {
  deleteFreeModeBoardById,
  freeModeBoardLoading,
  getFreeModeBoardByName,
} from '@/services/freemode.service'
import { ref, watch } from 'vue'
import type { FreeModeBoard } from '@/types/freemode'
import PagesLoader from '../loader/PagesLoader.vue'
import deleteIcon from '@/assets/img/delete.svg'
import close from '@/assets/img/close.svg'

import ButtonLoader from '../loader/ButtonLoader.vue'

const props = defineProps<{
  open: boolean
  ontology: string
}>()

const boardData = ref<FreeModeBoard[]>([])
const deletingId = ref<string | null>(null)
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      boardData.value = (await getFreeModeBoardByName(props.ontology)) ?? []
    }
  },
)

const closeModal = () => {
  emit('update:open', false)
}

const handleDelete = async (id: string) => {
  deletingId.value = id

  await deleteFreeModeBoardById(id)

  boardData.value = boardData.value.filter((b) => b.freemodeId !== id)

  deletingId.value = null
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <PagesLoader v-if="freeModeBoardLoading" />
    <div v-else class="modal-content recorded-boards">
      <div class="header-board">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-recorded-boards-modal-title') }}
        </h3>
        <div class="close-modal">
          <button @click="closeModal">
            <img :src="close" alt="close" />
          </button>
        </div>
      </div>
      <ul>
        <div class="no-player" v-if="!boardData.length">
          {{
            langStore.t('static-text.FreeModeScene.freemode-scene-recorded-boards-modal-noboards')
          }}
        </div>
        <li class="saved-board" v-for="(board, i) in boardData" :key="i">
          {{ console.log(board) }}
          <div class="board">
            <p class="board-title">{{ board.title }}</p>
          </div>
          <div class="board-action">
            <button>
              {{
                langStore.t('static-text.FreeModeScene.freemode-scene-recorded-boards-modal-open')
              }}
            </button>
            <button @click="handleDelete(board.freemodeId)">
              <ButtonLoader v-if="deletingId === board.freemodeId" />
              <img v-else :src="deleteIcon" title="delete board" alt="delete" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
