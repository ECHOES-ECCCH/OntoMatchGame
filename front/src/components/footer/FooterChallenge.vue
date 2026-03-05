<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { isUpdateSessionLoading } from '@/services/sessions.service'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'
import checkValidation from '@/assets/img/check.svg'
import next from '@/assets/img/next.svg'
import back from '@/assets/img/back.svg'
import PagesLoader from '../loader/PagesLoader.vue'

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
}>()

const { check } = useChallengeChecker()
const { finishChallenge } = useFinishChallenge()

const handleValidation = () => {
  check(props.entityDataCards, props.propertyDataCards)
}
</script>

<template>
  <div class="footer">
    <button class="back">
      <router-link to="/home">
        <img :src="back" alt="back" />
        <span>{{ langStore.t('static-text.Footer.footer-backbutton') }}</span></router-link
      >
    </button>
    <div class="finish-challenge">
      <button class="next" @click="finishChallenge(0)">
        <img :src="next" alt="next" />

        {{ langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text') }}
      </button>
      <PagesLoader v-if="isUpdateSessionLoading" />
      <button class="validation" v-else @click="handleValidation">
        <img :src="checkValidation" alt="validation" />
        <span>{{
          langStore.t('static-text.BoardScene.boardscene-scene-validatebutton-text')
        }}</span>
      </button>
    </div>
  </div>
</template>
