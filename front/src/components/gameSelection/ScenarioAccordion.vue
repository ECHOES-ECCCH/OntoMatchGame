<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Accordion from '@/components/TemplateAccordion.vue'
import { createSession } from '@/services/sessions.service'
import { isResetProgressionLoading, resetProgression } from '@/services/reset.service'
import { userStats, isUsersStatsLoading } from '@/composables/useUserStats'
import { useUserInformations } from '@/stores/userInformations.store'
import { getChapterProgression, isChapterStarted } from '@/utils/chapters-progression'
import type { Chapter, Scenario } from '@/types/game-selection'
import PagesLoader from '../loader/PagesLoader.vue'
import ButtonLoader from '../loader/ButtonLoader.vue'
import reset from '@/assets/img/reset.svg'
import { selectedOntology } from '@/utils/game-selection-filters'

const userStore = useUserInformations()
defineProps<{
  scenario: Scenario[]
}>()

const router = useRouter()

function goToChallenge(scenario: Scenario, chapter: Chapter) {
  handleCreateSessionData(scenario['scenario-title'], chapter['chapter-filename'])
  // router.push({
  //   path: '/challenge',
  //   query: {
  //     ontology: selectedOntology.value,
  //     scenario: scenario['scenario-title'],
  //     chapterName: chapter['chapter-title'],
  //     challengeId: 1,
  //   },
  // })
}

const isFullyLoaded = computed(() => {
  return (
    !userStore.isUserInfoLoading &&
    !isUsersStatsLoading.value &&
    (userStats.value !== null || !userStore.userInfo.userId)
  )
})

const handleCreateSessionData = (scenario: string, chapter: string) => {
  createSession({
    userId: userStore.userInfo.userId,
    scenarioTitle: scenario,
    chapterTitle: chapter,
  })
}
</script>

<template>
  <div v-if="!isFullyLoaded" style="padding: 20px; text-align: center">
    <PagesLoader />
  </div>

  <Accordion v-else :itemsCount="scenario.length">
    <template #header="{ index, active }">
      <div class="scenario">
        <div class="scenario-title">
          <span
            ><h4>{{ scenario[index]?.['scenario-title'] }}</h4>
            <p>{{ scenario[index]?.['scenario-description'] }}</p></span
          >
          <button>{{ active ? '-' : '+' }}</button>
        </div>

        <div class="tag">
          <ul>
            <li v-for="(domainTag, i) in scenario[index]?.domainTags" :key="i">
              {{ domainTag }}
            </li>
            <li v-for="(authorTag, i) in scenario[index]?.authorTags" :key="i">
              {{ authorTag }}
            </li>
            <li v-for="(ontologyTag, i) in scenario[index]?.ontologyTags" :key="i">
              {{ ontologyTag }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #content="{ index }">
      <ul>
        <li v-for="(chapter, i) in scenario[index]?.chapters" :key="i">
          <div class="chapter-name">
            {{ chapter['chapter-title'] }}
            <p>{{ chapter['chapter-description'] }}</p>
          </div>
          <div class="chapter-action">
            <span
              >{{ getChapterProgression(chapter, scenario[index]?.['scenario-title']) || 0 }}%</span
            >
            <router-link
              :to="{
                path: '/challenge',
                query: {
                  ontology: selectedOntology,
                  scenario: scenario[index]?.['scenario-title'],
                  chapterName: chapter['chapter-title'],
                },
              }"
            >
              <button
                class="play-challenge"
                title="Play"
                v-if="isChapterStarted(chapter, scenario[index]?.['scenario-title'])"
              >
                ►
              </button>
              <button
                class="play-challenge"
                title="Play"
                v-else
                @click="goToChallenge(scenario[index]!, chapter)"
              >
                ►
              </button>
            </router-link>
            <ButtonLoader v-if="isResetProgressionLoading" />
            <button
              class="reset-challenge"
              v-else
              :disabled="isResetProgressionLoading"
              @click="
                scenario[index] &&
                chapter &&
                resetProgression({
                  userId: userStore.userInfo.userId,
                  currentScenario: scenario[index]?.['scenario-title'],
                  currentChapter: chapter['chapter-filename'],
                })
              "
            >
              <img :src="reset" alt="reset" title="reset" />
            </button>
          </div>
        </li>
      </ul>
    </template>
  </Accordion>
</template>
