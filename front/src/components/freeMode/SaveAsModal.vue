<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import close from '@/assets/img/close.svg'
import { useFreeModeBoard } from '@/composables/useFreeModeBoard'
const { freeModeBoardData } = useFreeModeBoard()

const props = defineProps<{
  open: boolean
  ontology: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const closeModal = () => {
  emit('update:open', false)
}

const handleSaveAs = () => {
  const freeModeData = freeModeBoardData(props.ontology)

  console.log(freeModeData)
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <div class="modal-content">
      <div class="save-as">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-save-as-modal') }}
        </h3>
        <hr />
        <input
          type="text"
          :placeholder="langStore.t('static-text.FreeModeScene.freemode-scene-save-as-placeholder')"
        />
        <div class="button">
          <button @click="closeModal">
            {{
              langStore.t('static-text.ResetGameScene.resetgame-scene-cancelbutton-text')
            }}</button
          ><button @click="handleSaveAs">
            {{ langStore.t('static-text.FreeModeScene.freemode-scene-save-text') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
