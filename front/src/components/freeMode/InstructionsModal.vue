<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import close from '@/assets/img/close.svg'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const closeModal = () => {
  emit('update:open', false)
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <div class="modal-content instructions-modal">
      <!-- HEADER -->
      <div class="instruction-header">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-text') }}
        </h3>
        <button @click="closeModal">
          <img :src="close" alt="close" />
        </button>
      </div>

      <div class="freemode-instructions">
        <p>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-modal-selection') }}
        </p>
        <p>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-modal-rotation') }}
        </p>
        <p>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-modal-removal') }}
        </p>
        <p>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-modal-zoom') }}
        </p>
      </div>
    </div>
  </div>
</template>
