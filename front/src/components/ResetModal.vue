<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import ButtonLoader from './loader/ButtonLoader.vue'

defineProps({
  handleModal: Function,
  handleReset: Function,
  isResetLoading: Boolean,
})
</script>

<template>
  {{ console.log(isResetLoading) }}
  <div class="container">
    <div class="modal">
      <h1>{{ langStore.t('static-text.ResetGameScene.resetgame-scene-title-text') }}</h1>
      <p>{{ langStore.t('static-text.ResetGameScene.resetgame-scene-subtitle-text') }}</p>

      <button :disabled="isResetLoading" @click="handleModal?.(false)">
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
</template>

<style>
.container {
  background-color: rgba(190, 190, 190, 0.4);
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.modal {
  width: 400px;
  height: 200px;
  background-color: white;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
