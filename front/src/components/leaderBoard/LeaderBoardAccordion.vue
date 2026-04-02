<script setup lang="ts">
import Accordion from '@/components/TemplateAccordion.vue'
import type { Leaderboard } from '@/types/leaderboard'

const props = defineProps<{
  leaderboard: Leaderboard[]
}>()

console.log('leaderboard', props.leaderboard)

const getRatio = (playerScore, maxScore) => {
  if (playerScore > maxScore) {
    return 100
  } else {
    return Math.round((playerScore / maxScore) * 100)
  }
}
</script>

<template>
  <Accordion :itemsCount="leaderboard.scenarii.scenario.length">
    <!-- HEADER -->
    <template #header="{ index, active }">
      <div class="scenario">
        <div class="scenario-title statistics-info">
          <h4>{{ leaderboard.scenarii.scenario[index]?.scenarioName }}</h4>
          <button>{{ active ? '-' : '+' }}</button>
        </div>
      </div>
    </template>

    <!-- CONTENT -->
    <template #content="{ index }">
      <ul>
        <hr />

        <li
          v-for="(player, i) in [...leaderboard.scenarii.scenario[index]?.playerData].sort(
            (a, b) => b.score - a.score,
          )"
          :key="i"
        >
          <div class="player">
            {{ i + 1 }}
            <span class="chapter-name">{{ player.username }}</span>
          </div>
          <div class="challenge-score">
            <span class="chapter-score">
              <span v-if="player.score > leaderboard.scenarii.scenario[index]?.maximumScore">{{
                leaderboard.scenarii.scenario[index]?.maximumScore
              }}</span>
              <span v-else>{{ player.score }}</span> /
              {{ leaderboard.scenarii.scenario[index]?.maximumScore }}</span
            >

            <span class="chapter-progression">
              {{ getRatio(player.score, leaderboard.scenarii.scenario[index]?.maximumScore) }} %
            </span>
          </div>
        </li>
      </ul>

      <!-- <div v-show="active" class="total-scenario statistics-chapter">
        <p>
          {{ langStore.t('static-text.StatsScene.statsscene-scene-totalscenariolabel-text') }}
        </p>
        <div>
          <span class="scenario-progression">{{ groupedScenarios[index]?.percentage }}%</span>
          <span class="scenario-score"
            >{{ groupedScenarios[index]?.totalScore }}
            /
            {{ groupedScenarios[index]?.totalMaxScore }}</span
          >
        </div> -->
      <!-- </div> -->
    </template>
  </Accordion>
</template>
