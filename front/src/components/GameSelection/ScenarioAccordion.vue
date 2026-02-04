<script setup lang="ts">
import { computed } from 'vue'
import Accordion from '@/components/TemplateAccordion.vue'
import { createSession } from '@/services/sessions.service'
import { isResetProgressionLoading, resetProgression } from '@/services/reset.service'
import { userStats, isUsersStatsLoading } from '@/composables/useUserStats'
import { useUserInformations } from '@/stores/userInformations.store'
import { getChapterProgression, isChapterStarted } from '@/utils/chapters-progression'
import type { Scenario } from '@/types/game-selection'
import PagesLoader from '../loader/PagesLoader.vue'
import ButtonLoader from '../loader/ButtonLoader.vue'
import { shouldReloadHistory } from '@/composables/useUserHistory'

const userStore = useUserInformations()
defineProps<{
  scenario: Scenario[]
}>()

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
  <div>
    <div v-if="!isFullyLoaded" style="padding: 20px; text-align: center">
      <PagesLoader />
    </div>

    <Accordion v-else :itemsCount="scenario.length">
      <template #header="{ index }">
        <div>
          <h3>{{ scenario[index]?.['scenario-title'] }}</h3>
          <p>{{ scenario[index]?.['scenario-description'] }}</p>
          <div>
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
            {{ chapter['chapter-title'] }}
            {{ chapter['chapter-description'] }}
            <div>{{ getChapterProgression(chapter) || 0 }}%</div>

            <router-link
              :to="{
                path: '/challenge',
                query: {
                  scenario: scenario[index]?.['scenario-title'],
                  chapter: chapter['chapter-filename'],
                },
              }"
            >
              <button v-if="isChapterStarted(chapter)">Go</button>
              <button
                v-else
                @click="
                  scenario[index] &&
                  chapter &&
                  handleCreateSessionData(
                    scenario[index]['scenario-title'],
                    chapter['chapter-filename'],
                  )
                "
              >
                Go
              </button>
            </router-link>
            <ButtonLoader v-if="isResetProgressionLoading" />
            <button
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
              Reset
            </button>
          </li>
        </ul>
      </template>
    </Accordion>
  </div>
</template>
