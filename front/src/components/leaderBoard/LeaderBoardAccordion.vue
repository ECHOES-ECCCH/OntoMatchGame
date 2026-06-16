<script setup lang="ts">
import Accordion from '@/components/TemplateAccordion.vue'
import { langStore } from '@/stores/lang.store'
import { useUserInformations } from '@/stores/userInformations.store'
import type { LeaderboardLanguage } from '@/types/leaderboard'
import { computed } from 'vue'

const props = defineProps<{
  leaderboard: LeaderboardLanguage
}>()

const user = useUserInformations()
const scenarios = computed(() => props.leaderboard.scenarii.scenario)

/**
 * Compute percentage score relative to maximum score
 * If score exceeds max, clamp to 100%
 */
const getRatio = (playerScore: number, maxScore: number) => {
  if (playerScore > maxScore) {
    return 100
  } else {
    return Math.round((playerScore / maxScore) * 100)
  }
}
</script>

<template>
  <div class="accordion" v-if="!scenarios.length">
    {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-noscenarioavailable-text') }}
  </div>
  <Accordion v-else :itemsCount="scenarios.length">
    <!-- HEADER -->
    <template #header="{ index, active }">
      <div class="scenario">
        <div class="scenario-title statistics-info">
          <h4>{{ scenarios[index]?.scenarioName }}</h4>
          <button>{{ active ? '-' : '+' }}</button>
        </div>
      </div>
    </template>

    <!-- CONTENT -->

    <template #content="{ index }">
      <ul>
        <hr />
        <div class="no-player" v-if="!scenarios[index]?.playerData.length">
          {{ langStore.t('static-text.LeaderBoardScene.leaderboard-scene-noplayer-text') }}
        </div>
        <li
          :class="user.userInfo.userName === player.username && 'user-ranking'"
          class="player-rank"
          v-for="(player, i) in [...(scenarios[index]?.playerData ?? [])].sort(
            (a, b) => b.score - a.score,
          )"
          :key="i"
        >
          <div class="player">
            <span :class="i + 1 <= 3 ? 'top-rank' : 'rank'">{{ i + 1 }}</span>
            <p class="player-name">{{ player.username }}</p>
          </div>
          <div class="challenge-score">
            <span class="chapter-progression">
              {{ getRatio(player.score, scenarios[index]?.maximumScore ?? 0) }} %
            </span>
            <span class="chapter-score">
              <span v-if="player.score > (scenarios[index]?.maximumScore || 0)">
                {{ scenarios[index]?.maximumScore }}
              </span>
              <span v-else>{{ player.score }}</span>
              / {{ scenarios[index]?.maximumScore }}
            </span>
          </div>
        </li>
      </ul>
    </template>
  </Accordion>
</template>
