<script setup lang="ts">
import Accordion from '@/components/TemplateAccordion.vue'
import type { Scenario } from '@/types/game-selection'

defineProps<{
  scenario: Scenario[]
}>()
</script>

<template>
  <Accordion :itemsCount="scenario.length">
    <template #header="{ index }">
      <h3>{{ scenario[index]?.['scenario-title'] }}</h3>
      <p>{{ scenario[index]?.['scenario-description'] }}</p>
      <div>
        <ul>
          <li v-for="(domainTag, i) in scenario[index]?.domainTags" :key="i">{{ domainTag }}</li>
          <li v-for="(authorTag, i) in scenario[index]?.authorTags" :key="i">{{ authorTag }}</li>
          <li v-for="(ontologyTag, i) in scenario[index]?.ontologyTags" :key="i">
            {{ ontologyTag }}
          </li>
        </ul>
      </div>
    </template>

    <template #content="{ index }">
      <ul>
        <li v-for="(chapter, i) in scenario[index]?.chapters" :key="i">
          {{ chapter['chapter-title'] }}
          {{ chapter['chapter-description'] }}
        </li>
      </ul>
    </template>
  </Accordion>
</template>
