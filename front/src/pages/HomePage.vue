<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { userHistory, isHistoryLoading, shouldReloadHistory } from '@/composables/useUserHistory'
import { langStore } from '@/stores/lang.store'
import { useUserInformations } from '@/stores/userInformations.store'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ResetModal from '@/components/ResetModal.vue'
import { ref } from 'vue'
import { resetGame, isResetLoading } from '@/services/reset.service'

const user = useUserInformations()

const modal = ref(false)

const handleModal = (displayModal: boolean) => {
  modal.value = displayModal
}

const handleReset = () => {
  if (user.userInfo.userId) {
    resetGame(user.userInfo.userId)
  }
  handleModal(false)
  shouldReloadHistory.value = true
}
</script>

<template>
  <div v-if="user.isUserInfoLoading || isHistoryLoading">
    <PagesLoader />
  </div>
  <div class="menu" v-else>
    <ResetModal
      v-if="modal === true"
      :handleModal="handleModal"
      :handleReset="handleReset"
      :isResetLoading="isResetLoading"
    />
    <MainHeader />
    <h1>
      {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-welcometitle-text') }}
      {{ user.userInfo.userName }}
    </h1>
    <ul>
      <li>
        <router-link to="/challenge">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continue-text') }}
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continuebutton-text') }}
          {{ userHistory?.scenarioName }} {{ userHistory?.chapterName }}
        </router-link>
      </li>
      <li>
        <router-link to="/scenario">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-choosebutton-label') }}
        </router-link>
      </li>
      <li>
        <router-link to="/statistics">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-statistics-label') }}
        </router-link>
      </li>
      <li>
        <router-link to="/free-mode">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-freemode-label') }}
        </router-link>
      </li>
      <li>
        <router-link to="/ranking">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
        </router-link>
      </li>
      <li>
        <button @click="handleModal(true)">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.menu {
  position: relative;
}
</style>
