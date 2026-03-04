<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { isUpdateSessionLoading } from '@/services/sessions.service'
import ButtonLoader from '../loader/ButtonLoader.vue'
const { check } = useChallengeChecker()

const handleValidation = () => {
  check()
}
</script>

<template>
  {{ console.log(isUpdateSessionLoading) }}
  <div class="footer">
    <button>
      <router-link to="/home">
        {{ langStore.t('static-text.Footer.footer-backbutton') }}</router-link
      >
    </button>
    <ButtonLoader v-if="isUpdateSessionLoading.value" />
    <button v-else @click="handleValidation">
      {{ langStore.t('static-text.BoardScene.boardscene-scene-validatebutton-text') }}
    </button>
  </div>
</template>
