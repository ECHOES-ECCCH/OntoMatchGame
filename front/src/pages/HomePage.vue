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
  <div class="homepage-modal" v-else>
    <ResetModal
      v-if="modal === true"
      :handleModal="handleModal"
      :handleReset="handleReset"
      :isResetLoading="isResetLoading"
    />
    <MainHeader />
    <section class="homepage">
      <div class="homepage-content">
        <h2>
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-welcometitle-text') }}
          {{ user.userInfo.userName }}
        </h2>
        <ul class="menu">
          <li class="menu-challenge">
            <router-link to="/challenge">
              <div class="last-challenge">
                <div>
                  <p>{{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continue-text') }}</p>

                  <p>{{ userHistory?.scenarioName }} / {{ userHistory?.chapterName }}</p>
                </div>
                <div>
                  <button>
                    ►
                    {{
                      langStore.t('static-text.MainMenuScene.mainmenu-scene-continuebutton-text')
                    }}
                  </button>
                </div>
              </div>
            </router-link>
          </li>
          <li class="menu-scenario">
            <router-link to="/scenario">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-choosebutton-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li class="menu-statistics">
            <router-link to="/statistics">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-statistics-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li class="menu-free-mode">
            <router-link to="/free-mode">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-freemode-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li class="menu-ranking">
            <router-link to="/ranking">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li class="menu-reset-game">
            <button @click="handleModal(true)">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
            </button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style></style>
