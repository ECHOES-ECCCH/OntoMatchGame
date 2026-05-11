<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import close from '@/assets/img/close.svg'
import PartnersLogo from './PartnersLogo.vue'

defineProps({
  handleInfosModal: Function,
})
</script>

<template>
  <div class="modal-container infos-modal">
    <div class="modal-content infos-modal-content">
      <div class="infos">
        <PartnersLogo />
        <button @click="handleInfosModal?.(false)"><img :src="close" alt="close" /></button>
        <h2>{{ langStore.t('static-text.GoingFurtherScene.goingfurther-scene-title-text') }}</h2>
        <div class="more-infos">
          <p>
            {{
              langStore.t('static-text.GoingFurtherScene.goingfurther-scene-CidocGameWebSite-label')
            }}
          </p>
          <a href="https://www.cidoc-crm-game.org/" target="_blank"
            >https://www.cidoc-crm-game.org/</a
          >
        </div>
        <div class="more-infos">
          <p>
            {{ langStore.t('static-text.GoingFurtherScene.goingfurther-scene-youtube-label') }}
          </p>
          <a href="https://www.youtube.com/watch?v=JJX-nszOVbA" target="_blank"
            >https://www.youtube.com/watch?v=JJX-nszOVbA</a
          >
        </div>
        <div class="more-infos">
          <p>
            {{
              langStore.t(
                'static-text.GoingFurtherScene.goingfurther-scene-officialcidocwebsite-label',
              )
            }}
          </p>
          <a href="http://www.cidoc-crm.org/" target="_blank">http://www.cidoc-crm.org/</a>
        </div>
        <div class="more-infos">
          <p>
            {{ langStore.t('static-text.GoingFurtherScene.goingfurther-scene-creators-label') }}
          </p>
          <p>
            {{ langStore.t('static-text.GoingFurtherScene.goingfurther-scene-contacts-label') }}
          </p>
        </div>
      </div>
      <div class="info-back">
        <button @click="handleInfosModal?.(false)">
          {{ langStore.t('static-text.Footer.footer-backbutton') }}
        </button>
      </div>
    </div>
  </div>
</template>
