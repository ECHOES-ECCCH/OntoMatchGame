<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  userHistory,
  isHistoryLoading,
  shouldReloadHistory,
  userOntology,
} from '@/composables/useUserHistory'
import router from '@/router'
import discover from '@/assets/img/discover.svg'
import { fetchUserStats } from '@/composables/useUserStats'
import { langStore } from '@/stores/lang.store'
import { useUserInformations } from '@/stores/userInformations.store'
import PagesLoader from '@/components/loader/PagesLoader.vue'
import ResetModal from '@/components/modals/ResetModal.vue'
import InfosModal from '@/components/modals/InfosModal.vue'
import FooterHome from '@/components/footer/FooterHome.vue'
import CreditsModal from '@/components/modals/CreditsModal.vue'
import { getChapterProgression } from '@/utils/chapters-progression'
import { resetGame, isResetLoading, resetProgression } from '@/services/reset.service'
import { createSession } from '@/services/sessions.service'

const user = useUserInformations()

const modal = ref(false)
const infosModal = ref(false)
const creditsModal = ref(false)
const selectedLanguage = computed(() => langStore.state.language)
const userStore = useUserInformations()

const lastChallenge = ref()

const handleResetModal = (display: boolean) => {
  modal.value = display
  infosModal.value = false
  creditsModal.value = false
}

const handleInfosModal = (display: boolean) => {
  infosModal.value = display
  creditsModal.value = false
  modal.value = false
}

const handleCreditsModal = (display: boolean) => {
  creditsModal.value = display
  infosModal.value = false
  modal.value = false
}

const chapterTitle = computed(() =>
  selectedLanguage.value === 'fr' ? 'Base des ontologies' : 'Ontology basics',
)
/**
 * Reset user progression:
 * - Reset backend game state
 * - Refresh stats
 * - Reset progression tracking
 */
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
  handleResetModal(false)
  shouldReloadHistory.value = true
}

/**
 * Determine if user has an existing session (run once on mount)
 */
onMounted(() => {
  lastChallenge.value = computed(() => {
    return userHistory?.value.historyId ? true : false
  })
})

const handleCreateSessionData = (scenario: string, chapter: string) => {
  return createSession({
    userId: userStore.userInfo.userId,
    scenarioTitle: scenario,
    chapterTitle: chapter,
  })
}

/**
 * Navigate to the discover challenge and create a session
 */
async function goToChallenge(scenario: string, chapterTitle: string, chapterFilename: string) {
  await handleCreateSessionData(scenario, chapterFilename)

  router.push({
    path: '/challenge',
    query: {
      ontology: 'CIDOC CRM',
      scenario: scenario,
      chapterName: chapterTitle,
    },
  })
}
</script>

<template>
  <div v-if="user.isUserInfoLoading || isHistoryLoading">
    <PagesLoader />
  </div>
  <div class="homepage-modal" v-else>
    <ResetModal
      v-if="modal === true"
      :handleResetModal="handleResetModal"
      :handleReset="handleReset"
      :isResetLoading="isResetLoading"
    />
    <InfosModal v-if="infosModal === true" :handleInfosModal="handleInfosModal" />
    <CreditsModal v-if="creditsModal === true" :handleCreditsModal="handleCreditsModal" />
  </div>

  <section class="homepage">
    <div class="homepage-content">
      <h2>
        {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-welcometitle-text') }}
        {{ user.userInfo.userName }}
      </h2>
      <ul class="menu">
        <li v-if="!userHistory?.historyId" class="discover-game">
          <div
            @click="
              goToChallenge(
                'Marmoutier ' + selectedLanguage.toUpperCase(),
                chapterTitle,
                'Chapter1.json',
              )
            "
          >
            <p>{{ langStore.t('static-text.MainMenuScene.mainmenu-scene-discover') }}</p>
            <img :src="discover" />
          </div>
        </li>
        <li v-if="userHistory?.historyId" class="menu-challenge">
          <router-link
            :to="{
              path: '/challenge',
              query: {
                ontology: userOntology,
                scenario: userHistory?.['scenarioName'],
                chapterName: userHistory?.['chapterName'],
              },
            }"
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
                  :value="
                    getChapterProgression(userHistory, userHistory?.scenarioName, userOntology) || 0
                  "
                  max="100"
                ></progress>
                <span class="percent"
                  >{{
                    getChapterProgression(userHistory, userHistory?.scenarioName, userOntology) ||
                    0
                  }}%
                </span>
              </div>
              <div>
                <button>
                  {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-continuebutton-text') }}
                </button>
              </div>
            </div>
          </router-link>
        </li>
        <li class="menu-challenge no-session" v-else>
          <div class="no-session">
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
          <router-link to="/leader-board">
            {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
            <button>►</button>
          </router-link>
        </li>
        <li v-else class="menu-ranking no-session">
          {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-hallbutton-label') }}
        </li>
        <li @click="handleResetModal(true)" v-if="userHistory?.historyId" class="menu-reset-game">
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
  <FooterHome :handleInfosModal="handleInfosModal" :handleCreditsModal="handleCreditsModal" />
</template>
