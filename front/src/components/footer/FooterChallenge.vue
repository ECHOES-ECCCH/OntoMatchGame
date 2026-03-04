<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { isUpdateSessionLoading } from '@/services/sessions.service'
import ButtonLoader from '../loader/ButtonLoader.vue'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'
const { check } = useChallengeChecker()

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
}>()

const handleValidation = () => {
  check(props.entityDataCards, props.propertyDataCards)
}
</script>

<template>
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
