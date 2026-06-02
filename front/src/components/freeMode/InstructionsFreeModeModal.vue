<script setup lang="ts">
import PagesLoader from '../loader/PagesLoader.vue'
import close from '@/assets/img/close.svg'
import { langStore } from '@/stores/lang.store'
import type { CardInstances } from '@/types/card/cardInfo'

const props = defineProps<{
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
    <div class="modal-content instance-modal">
      <!-- HEADER -->
      <div class="ontology-filter">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-instructions-text') }}
        </h3>

        <button @click="closeModal">
          <img :src="close" alt="close" />
        </button>
      </div>
    </div>
  </div>
</template>
