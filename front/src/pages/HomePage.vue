<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { userHistory, isHistoryLoading, shouldReloadHistory } from '@/composables/useUserHistory'
import { langStore } from '@/stores/lang.store'
import { useUserInformations } from '@/stores/userInformations.store'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ResetModal from '@/components/ResetModal.vue'
import { computed, ref } from 'vue'
import { resetGame, isResetLoading } from '@/services/reset.service'
import FooterHome from '@/components/FooterHome.vue'

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

const lastChallenge = computed(() => {
  return userHistory.value.historyId ? true : false
})
</script>

<template>
  {{ console.log(userHistory) }}
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
            <router-link to="/challenge" v-if="userHistory.historyId">
              <div class="last-challenge">
                <div>
                  <p>
                    {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continue-text') }}
                  </p>

                  <p>
                    {{ userHistory?.scenarioName }} / {{ userHistory?.chapterName }} /
                    {{ userHistory?.challengeId }}
                  </p>
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
            <div class="no-session" v-else>
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-nocontinue-text') }}
            </div>
          </li>
          <li class="menu-scenario">
            <router-link to="/scenario">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-choosebutton-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li v-if="lastChallenge" class="menu-statistics">
            <router-link to="/statistics">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-statistics-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li v-else class="menu-statistics no-session">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-statistics-label') }}
          </li>
          <li class="menu-free-mode">
            <router-link to="/free-mode">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-freemode-label') }}
              <button>►</button>
            </router-link>
          </li>

          <li v-if="lastChallenge" class="menu-ranking">
            <router-link to="/ranking">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
              <button>►</button>
            </router-link>
          </li>
          <li v-else class="menu-ranking no-session">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
          </li>
          <li v-if="lastChallenge" class="menu-reset-game">
            <button @click="handleModal(true)">
              {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
            </button>
          </li>
          <li v-else class="menu-reset-game no-session">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
          </li>
        </ul>
      </div>
    </section>
  </div>
  <FooterHome />
</template>

<style></style>
