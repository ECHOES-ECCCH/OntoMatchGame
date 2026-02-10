<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import type { ChapterData } from '@/types/chapter'
import { colors } from '@/assets/cards/colors.js'
import logo from '@/assets/img/logo-g.png'
import TypesFilter from './BranchesFilter.vue'
import { getColor } from '@/utils/get-color-types'
import BranchesFilter from './BranchesFilter.vue'
import { useSelectedCards } from '@/composables/useSelectedCards'
import { langStore } from '@/stores/lang.store'

const props = defineProps<{
  dataCards: { id: string }[]
}>()

const chapterStore = useChapterData()

const branches = reactive({
  eleft: ['entity'],
  emiddle: ['entity'],
  eright: ['entity'],
})

const selectedCards = useSelectedCards(chapterStore.chapterData, props.dataCards, branches)

const splitId = (id: string): { prefix: string; name: string } => {
  const match = id.match(/^(E\d+)_(.+)$/)
  if (!match) return { prefix: '', name: id }

  return {
    prefix: match[1],
    name: match[2].replace(/_/g, ' '),
  }
}

const isChapterReady = computed(() => !!chapterStore.chapterData)

const currentIndexes = computed(() => {
  return reactive(
    Object.fromEntries(selectedCards.value.map((selectedCard) => [selectedCard.position, 0])),
  )
})

const getIcon = (branch: string) => colors[branch]?.icon
</script>

<template>
  <div class="content-cards" v-if="isChapterReady">
    <div v-for="dataCards in selectedCards" :key="dataCards.position">
      <div v-if="!dataCards.cards.length" class="empty-card-entity">
        <p>OntoMatchGame</p>
        <img :src="logo" />
      </div>
      <div v-else-if="dataCards.cards === 'no card'">
        <div class="empty-card-entity">
          <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
        </div>
        <BranchesFilter
          :model-value="branches[dataCards.position]"
          @update:model-value="branches[dataCards.position] = $event"
        />
      </div>
      <div v-else class="carousel-container">
        <div
          class="entity-card"
          v-for="(card, index) in dataCards.cards"
          :key="index"
          :class="{ active: index === currentIndexes[dataCards.position] }"
          :style="{ '--card-color': getColor(card.branch) }"
        >
          <div class="card-name">
            <div>
              <span class="prefix">{{ splitId(card.about).prefix }}</span>
              <span class="name">{{ splitId(card.about).name }}</span>
            </div>
            <span class="image-card"><img :src="getIcon(card.branch ?? null)" /></span>
          </div>
        </div>
        <BranchesFilter
          :model-value="branches[dataCards.position]"
          @update:model-value="branches[dataCards.position] = $event"
        />
        <div class="range">
          <button
            type="button"
            @click="
              currentIndexes[dataCards.position] = Math.max(
                currentIndexes[dataCards.position] - 1,
                0,
              )
            "
          >
            -
          </button>
          <input
            type="range"
            min="0"
            :max="dataCards.cards?.length - 1"
            class="slider"
            :value="currentIndexes[dataCards.position]"
            @input="currentIndexes[dataCards.position] = Number($event.target.value)"
          />
          <div class="slider-buttons">
            <button
              type="button"
              @click="
                currentIndexes[dataCards.position] = Math.min(
                  currentIndexes[dataCards.position] + 1,
                  dataCards.cards.length - 1,
                )
              "
            >
              +
            </button>
          </div>
        </div>
        <div
          class="number"
          :class="{ active: index === currentIndexes[dataCards.position] }"
          v-for="(card, index) in dataCards.cards"
          :key="index"
        >
          {{ dataCards.cards.length }}/{{ dataCards.totalCards }}
        </div>
      </div>
    </div>
  </div>

  <div v-else>Aucun chapitre disponible</div>
</template>
