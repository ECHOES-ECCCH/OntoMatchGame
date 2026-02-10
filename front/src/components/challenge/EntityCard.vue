<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import type { ChapterData } from '@/types/chapter'
import { colors } from '@/assets/cards/colors.js'
import logo from '@/assets/img/logo-g.png'
import TypesFilter from './BranchesFilter.vue'
import { getColor } from '@/utils/get-color-types'
import BranchesFilter from './BranchesFilter.vue'
import { useSelectedCards } from '@/composables/useSelectedCards'
import { langStore } from '@/stores/lang.store'
import { useSuperSubClasses } from '@/composables/useSuperSubClasses'
import EntitySuperclassesSubclasses from './EntitySuperclassesSubclasses.vue'

const props = defineProps<{
  dataCards: { id: string }[]
}>()

const chapterStore = useChapterData()
const branches = reactive({
  eleft: ['entity'],
  emiddle: ['entity'],
  eright: ['entity'],
})

const cardInfo = reactive({
  eleft: { about: '' },
  emiddle: { about: '' },
  eright: { about: '' },
})

const selectedCards = useSelectedCards(chapterStore.chapterData, props.dataCards, branches)

const currentIndexes = reactive({
  eleft: 0,
  emiddle: 0,
  eright: 0,
})

const superSubClasses = useSuperSubClasses(cardInfo, props.dataCards)

const splitId = (id: string): { prefix: string; name: string } => {
  const match = id.match(/^(E\d+)_(.+)$/)
  if (!match) return { prefix: '', name: id }

  return {
    prefix: match[1],
    name: match[2].replace(/_/g, ' '),
  }
}

const isChapterReady = computed(() => !!chapterStore.chapterData)

const getIcon = (branch: string) => colors[branch]?.icon

const updateCardInfo = (position: string, cards: any[]) => {
  const index = currentIndexes[position]
  if (cards && cards[index]) {
    const about = cards[index].about

    cardInfo[position] = { about: about }
  }
}

watch(
  selectedCards,
  (newCards) => {
    newCards.forEach((data) => {
      if (data.cards && data.cards !== 'no card' && data.cards.length > 0) {
        if (currentIndexes[data.position] >= data.cards.length) {
          currentIndexes[data.position] = 0
        }

        updateCardInfo(data.position, data.cards)
      }
    })
  },
  { immediate: true, deep: true },
)

const handlePrevious = (position: string, cards: any[]) => {
  currentIndexes[position] = Math.max(currentIndexes[position] - 1, 0)
  updateCardInfo(position, cards)
}

const handleNext = (position: string, cards: any[]) => {
  currentIndexes[position] = Math.min(currentIndexes[position] + 1, cards.length - 1)
  updateCardInfo(position, cards)
}

const handleSliderChange = (position: string, value: number, cards: any[]) => {
  currentIndexes[position] = value
  updateCardInfo(position, cards)
}
</script>

<template>
  <div class="content-cards" v-if="isChapterReady">
    <div v-for="data in selectedCards" :key="data.position">
      <div v-if="!data.cards.length" class="empty-card-entity">
        <p>OntoMatchGame</p>
        <img :src="logo" />
      </div>
      <div v-else-if="data.cards === 'no card'">
        <div class="empty-card-entity">
          <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
        </div>
        <BranchesFilter
          :model-value="branches[data.position]"
          @update:model-value="branches[data.position] = $event"
        />
      </div>
      <div v-else class="carousel-container">
        <div v-for="(card, index) in data.cards" :key="index">
          <!-- {{ console.log('card', card.about) }}-->
          {{ console.log('card2', cardInfo[data.position].about) }}

          <div
            class="entity-card"
            :class="{ active: index === currentIndexes[data.position] }"
            :style="{ '--card-color': getColor(card.branch) }"
          >
            <div class="card-name">
              <div>
                <span class="prefix">{{ splitId(card.about).prefix }}</span>
                <span class="name">{{ splitId(card.about).name }}</span>
              </div>
              <span class="image-card"><img :src="getIcon(card.branch ?? null)" /></span>
            </div>
            <EntitySuperclassesSubclasses
              :position="data.position"
              v-model:cardInfo="cardInfo"
              :superSubClasses="superSubClasses"
            />
          </div>
        </div>
        <BranchesFilter
          :model-value="branches[data.position]"
          @update:model-value="branches[data.position] = $event"
        />
        <div class="range">
          <button type="button" @click="handlePrevious(data.position, data.cards)">-</button>
          <input
            type="range"
            min="0"
            :max="data.cards?.length - 1"
            class="slider"
            :value="currentIndexes[data.position]"
            @input="handleSliderChange(data.position, Number($event.target.value), data.cards)"
          />
          <div class="slider-buttons">
            <button type="button" @click="handleNext(data.position, data.cards)">+</button>
          </div>
        </div>
        <div
          class="number"
          :class="{ active: index === currentIndexes[data.position] }"
          v-for="(card, index) in data.cards"
          :key="index"
        >
          {{ data.cards.length }}/{{ data.totalCards }}
        </div>
      </div>
    </div>
  </div>

  <div v-else>Aucun chapitre disponible</div>
</template>
