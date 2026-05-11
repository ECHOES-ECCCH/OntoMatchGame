<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import close from '@/assets/img/close.svg'
import PartnersLogo from './PartnersLogo.vue'

defineProps({
  handleCreditsModal: Function,
})
</script>

<template>
  <div class="modal-container infos-modal">
    <div class="modal-content infos-modal-content">
      <div class="infos">
        <PartnersLogo />
        <button @click="handleCreditsModal?.(false)"><img :src="close" alt="close" /></button>
        <div class="more-infos">
          <p>
            {{ langStore.t('static-text.FullCreditsScene.fullcredits-scene-masa-text') }}
          </p>
          <a href=" https://masa.hypotheses.org/" target="_blank"> https://masa.hypotheses.org/</a>
        </div>
        <div class="more-infos">
          <p>
            {{ langStore.t('static-text.FullCreditsScene.fullcredits-scene-originalgame-text') }}
          </p>
        </div>
        <div class="more-infos">
          <p>
            {{
              langStore.t('static-text.FullCreditsScene.fullcredits-scene-digitalgameproducer-text')
            }}
          </p>
        </div>
      </div>
      <div class="info-back">
        <button @click="handleCreditsModal?.(false)">
          {{ langStore.t('static-text.Footer.footer-backbutton') }}
        </button>
      </div>
    </div>
  </div>
</template>
