<script setup lang="ts">
import { userHistory, isHistoryLoading, shouldReloadHistory } from '@/composables/useUserHistory'
import { langStore } from '@/stores/lang.store'
import { useUserInformations } from '@/stores/userInformations.store'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ResetModal from '@/components/ResetModal.vue'
import { computed, onMounted, ref } from 'vue'
import { resetGame, isResetLoading, resetProgression } from '@/services/reset.service'
import FooterHome from '@/components/footer/FooterHome.vue'
import { getChapterProgression } from '@/utils/chapters-progression'
import { fetchUserStats } from '@/composables/useUserStats'

const user = useUserInformations()

const modal = ref(false)
const lastChallenge = ref()
const handleModal = (displayModal: boolean) => {
  modal.value = displayModal
}

const handleReset = async () => {
  if (user.userInfo.userId) {
    await resetGame(user.userInfo.userId)
    await fetchUserStats(user.userInfo.userId)
    await resetProgression({
      userId: user.userInfo.userId,
      currentScenario: userHistory?.value?.scenarioName,
      currentChapter: userHistory?.value?.chapterName,
    })
  }
  handleModal(false)
  shouldReloadHistory.value = true
}

onMounted(() => {
  lastChallenge.value = computed(() => {
    return userHistory?.value.historyId ? true : false
  })
})
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
  </div>

  <section class="homepage">
    <div class="homepage-content">
      <h2>
        {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-welcometitle-text') }}
        {{ user.userInfo.userName }}
      </h2>
      <ul class="menu">
        <li class="menu-challenge">
          <router-link
            :to="{
              path: '/challenge',
              query: {
                scenario: userHistory?.['scenarioName'],
                chapterName: userHistory?.['chapterName'],
              },
            }"
            v-if="userHistory?.historyId"
          >
            <div class="last-challenge">
              <div>
                <p>
                  {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continue-text') }}
                </p>

                <p>
                  {{ userHistory?.scenarioName }} / {{ userHistory?.chapterName }} /
                  {{ userHistory?.challengeId }}
                </p>
                <progress
                  :value="getChapterProgression(userHistory, userHistory?.scenarioName) || 0"
                  max="100"
                ></progress>
                <span class="percent"
                  >{{ getChapterProgression(userHistory, userHistory?.scenarioName) || 0 }}%
                </span>
              </div>
              <div>
                <button>
                  ►
                  {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continuebutton-text') }}
                </button>
              </div>
            </div>
          </router-link>
          <div class="no-session" v-else>
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-nocontinue-text') }}
          </div>
        </li>
        <li class="menu-scenario">
          <router-link to="/game-selection">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-choosebutton-label') }}
            <button>►</button>
          </router-link>
        </li>
        <li v-if="userHistory?.historyId" class="menu-statistics">
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

        <li v-if="userHistory?.historyId" class="menu-ranking">
          <router-link to="/ranking">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
            <button>►</button>
          </router-link>
        </li>
        <li v-else class="menu-ranking no-session">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
        </li>
        <li @click="handleModal(true)" v-if="userHistory?.historyId" class="menu-reset-game">
          <button>
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
          </button>
        </li>
        <li v-else class="menu-reset-game no-session">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-reset-label') }}
        </li>
      </ul>
    </div>
  </section>
  <FooterHome />
</template>

<style></style>
