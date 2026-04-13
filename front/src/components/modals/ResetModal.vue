<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import ButtonLoader from '../loader/ButtonLoader.vue'

defineProps({
  handleResetModal: Function,
  handleReset: Function,
  isResetLoading: Boolean,
})
</script>

<template>
  <div class="modal-container">
    <div class="modal-content">
      <div>
        <p>{{ langStore.t('static-text.ResetGameScene.resetgame-scene-title-text') }}</p>
        <p>{{ langStore.t('static-text.ResetGameScene.resetgame-scene-subtitle-text') }}</p>
      </div>
      <div class="button">
        <button :disabled="isResetLoading" @click="handleResetModal?.(false)">
          {{ langStore.t('static-text.ResetGameScene.resetgame-scene-cancelbutton-text') }}
        </button>
        <button @click="handleReset?.()">
          <ButtonLoader
            v-if="isResetLoading"
            :text="langStore.t('static-text.ResetGameScene.resetgame-scene-waitingmessage-label')"
          />

          <span v-else>
            {{ langStore.t('static-text.ResetGameScene.resetgame-scene-deletebutton-text') }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
