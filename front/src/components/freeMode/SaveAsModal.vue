<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { useFreeModeBoard } from '@/composables/useFreeModeBoard'
import {
  createFreeModeBoard,
  isCreateFreeModeBoardLoading,
  isError,
} from '@/services/freemode.service'
import { ref } from 'vue'
const { freeModeBoardData } = useFreeModeBoard()

const props = defineProps<{
  open: boolean
  ontology: string
}>()
const boardName = ref('')

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const closeModal = () => {
  emit('update:open', false)
  isError.value = false
  boardName.value = ''
}

const handleSaveAs = async () => {
  if (!boardName.value.trim()) return

  const freeModeData = freeModeBoardData(props.ontology)

  if (!freeModeData) return

  const result = await createFreeModeBoard({
    title: boardName.value.trim(),
    ontologyName: props.ontology,
    ...freeModeData,
  })

  if (result) {
    closeModal()
  }
}
</script>

<template>
  <div v-if="open" class="modal-container">
    <div class="modal-content save-as-modal">
      <div class="save-as">
        <h3>
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-save-as-modal') }}
        </h3>
        <input
          type="text"
          id="boardName"
          name="boardName"
          v-model="boardName"
          :placeholder="langStore.t('static-text.FreeModeScene.freemode-scene-save-as-placeholder')"
          required
        />
        <div class="error-request" v-if="isError">
          {{ langStore.t('static-text.FreeModeScene.freemode-scene-save-as-error') }}
        </div>
        <div class="button">
          <button @click="closeModal">
            {{ langStore.t('static-text.ResetGameScene.resetgame-scene-cancelbutton-text') }}
          </button>
          <button :disabled="!boardName.trim().length" @click="handleSaveAs">
            <ButtonLoader
              v-if="isCreateFreeModeBoardLoading"
              :text="langStore.t('static-text.SigninScene.signin-scene-waitingmessage-text')"
            />
            <span v-else>{{
              langStore.t('static-text.FreeModeScene.freemode-scene-save-text')
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
