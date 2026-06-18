<script setup lang="ts">
import { computed } from 'vue'
import Accordion from '@/components/TemplateAccordion.vue'
import { getChapterProgression } from '@/utils/chapters-progression'
import type { UserGlobalStats, UserStats } from '@/types/user-stats'
import { langStore } from '@/stores/lang.store'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'

const props = defineProps<{
  userStats: UserStats[]
}>()

const scenarii = scenarioCatalog.scenarii ?? []

/**
 * Finds a chapter in the catalog by its title.
 * Used to retrieve metadata required for progression calculation.
 */
const getChapterInfo = (chapterName: string) => {
  for (const scenario of scenarii) {
    const chapter = scenario.chapters.find((ch) => ch['chapter-title'] === chapterName)
    if (chapter) return chapter
  }
  return null
}

/**
 * Groups user statistics by scenario
 * and computes aggregated totals (score, challenges, etc.)
 */
const groupedScenarios = computed(() => {
  const grouped = props.userStats.reduce(
    (acc, item) => {
      const group =
        acc[item.scenarioName] ||
        (acc[item.scenarioName] = {
          scenarioName: item.scenarioName,
          ontologyName: item.ontologyName,
          chapters: [],
          totalMaxScore: 0,
          totalScore: 0,
          totalLastChallenge: 0,
          totalMaxChallenge: 0,
          percentage: 0,
        })

      group.chapters.push(item)
      group.totalMaxScore += Number(item.maxPossibleScore || 0)
      group.totalScore += Number(item.score || 0)
      group.totalLastChallenge += Number(item.lastChallengeId || 0)
      group.totalMaxChallenge += Number(item.maxChallengeCount || 0)

      return acc
    },
    {} as Record<string, UserGlobalStats>,
  )

  /**
   * Compute overall scenario completion percentage
   * based on challenge progression
   */
  Object.values(grouped).forEach((group: UserGlobalStats) => {
    group.percentage =
      group.totalMaxChallenge > 0
        ? Math.round((group.totalLastChallenge / group.totalMaxChallenge) * 100)
        : 0
  })

  return Object.values(grouped)
})
</script>

<template>
  <div v-if="!groupedScenarios.length">
    {{ langStore.t('static-text.StatsScene.statsscene-scene-noscenarioavailable-text') }}
  </div>
  <Accordion :itemsCount="groupedScenarios.length">
    <!-- HEADER -->
    <template #header="{ index, active }">
      <div class="scenario">
        <div class="scenario-title statistics-info">
          <h4>{{ groupedScenarios[index]?.scenarioName }}</h4>
          <button>{{ active ? '-' : '+' }}</button>
        </div>

        <div v-show="!active" class="total-scenario">
          <p>
            {{ langStore.t('static-text.StatsScene.statsscene-scene-totalscenariolabel-text') }}
          </p>

          <div class="stats">
            <div class="progress-container">
              <progress
                class="total-scenario-progress"
                :value="groupedScenarios[index]?.percentage"
                max="100"
              ></progress>
              <span class="scenario-progression">{{ groupedScenarios[index]?.percentage }}%</span>
            </div>
            <span class="scenario-score"
              >{{ groupedScenarios[index]?.totalScore }}
              /
              {{ groupedScenarios[index]?.totalMaxScore }}</span
            >
          </div>
        </div>
      </div>
    </template>

    <!-- CONTENT -->
    <template #content="{ index, active }">
      <ul>
        <li v-for="(chapter, i) in groupedScenarios[index]?.chapters" :key="i">
          <p class="chapter-name">{{ chapter.chapterName }}</p>
          <div class="stats">
            <div class="progress-container">
              <progress
                class="scenario-progress"
                :value="
                  getChapterProgression(
                    getChapterInfo(chapter.chapterName) ?? null,
                    groupedScenarios[index]?.scenarioName ?? '',
                    groupedScenarios[index]?.ontologyName ?? '',
                  ) || 0
                "
                max="100"
              ></progress>
              <span class="chapter-progression">
                {{
                  getChapterProgression(
                    getChapterInfo(chapter.chapterName) ?? null,
                    groupedScenarios[index]?.scenarioName ?? '',
                    groupedScenarios[index]?.ontologyName ?? '',
                  ) || 0
                }}%</span
              >
            </div>
            <span class="chapter-score">{{ chapter.score }} / {{ chapter.maxPossibleScore }}</span>
          </div>
        </li>
      </ul>

      <div v-show="active" class="total-scenario statistics-chapter">
        <p>
          {{ langStore.t('static-text.StatsScene.statsscene-scene-totalscenariolabel-text') }}
        </p>
        <div class="stats">
          <div class="progress-container">
            <progress
              class="total-scenario-progress"
              :value="groupedScenarios[index]?.percentage"
              max="100"
            ></progress>
            <span class="scenario-progression">{{ groupedScenarios[index]?.percentage }}%</span>
          </div>
          <span class="scenario-score"
            >{{ groupedScenarios[index]?.totalScore }}
            /
            {{ groupedScenarios[index]?.totalMaxScore }}</span
          >
        </div>
      </div>
    </template>
  </Accordion>
</template>
