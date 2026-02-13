<!-- <script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import { colors } from '@/assets/cards/colors.ts'
import { getColor } from '@/utils/get-color-types'
import BranchesFilter from './BranchesFilter.vue'
import { useSelectedCards } from '@/composables/useSelectedCards'
import { langStore } from '@/stores/lang.store'
import { useSuperSubClasses } from '@/composables/useSuperSubClasses'
import EntitySuperclassesSubclasses from './EntitySuperclassesSubclasses.vue'
import type { CardInfo, CardPositionInfo, CurrentIndexes, Position } from '@/types/card/cardInfo'
import type { Branch, BranchName } from '@/types/card/branch'
import EmptyCard from './EmptyCard.vue'

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardInfo[]
}>()

const chapterStore = useChapterData()
const branches = reactive(<Branch>{
  eleft: ['entity'],
  emiddle: ['entity'],
  eright: ['entity'],
})

const cardInfo = reactive<Record<Position, CardInfo>>({
  eleft: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  emiddle: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  eright: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
})

const selectedCards = useSelectedCards(chapterStore.chapterData, props.entityDataCards, branches)

const currentIndexes = reactive<CurrentIndexes>({
  eleft: 0,
  emiddle: 0,
  eright: 0,
})

const superSubClasses = useSuperSubClasses(cardInfo, props.entityDataCards)

const splitId = (id: string): { prefix: string | undefined; name: string | undefined } => {
  const match = id.match(/^(E\d+)_(.+)$/)
  if (!match) return { prefix: '', name: id }

  return {
    prefix: match[1],
    name: match[2]?.replace(/_/g, ' '),
  }
}

const isChapterReady = computed(() => !!chapterStore.chapterData)

const getIcon = (branch: BranchName | null | undefined) => {
  if (!branch) return colors.entity.icon
  return colors[branch]?.icon ?? colors.entity.icon
}

const updateCardInfo = (position: Position, cards: CardInfo[]) => {
  const index = currentIndexes[position]

  if (cards && cards[index]) {
    const result = props.entityDataCards.find((c) => c.about === cards[index]?.about)

    if (result) {
      cardInfo[position] = result
    } else {
      cardInfo[position] = {
        id: '',
        about: '',
        labels: {},
        comment: '',
        subClasses: [],
        branch: null,
      }
    }
  }
}

watch(
  selectedCards,
  (newCards) => {
    newCards.forEach((data) => {
      if (['eleft', 'emiddle', 'eright'].includes(data.position)) {
        const position = data.position as Position
        if (data.cards && data.cards !== 'no card' && data.cards.length > 0) {
          if (currentIndexes[position] >= data.cards.length) {
            currentIndexes[position] = 0
          }

          updateCardInfo(position, data.cards)
        }
      }
    })
  },
  { immediate: true, deep: true },
)

const handlePrevious = (position: Position, cards: CardInfo[]) => {
  currentIndexes[position] = Math.max(currentIndexes[position] - 1, 0)
  updateCardInfo(position, cards)
}

const handleNext = (position: Position, cards: CardInfo[]) => {
  currentIndexes[position] = Math.min(currentIndexes[position] + 1, cards.length - 1)
  updateCardInfo(position, cards)
}

const handleSliderChange = (position: Position, value: number, cards: CardInfo[]) => {
  currentIndexes[position] = value
  updateCardInfo(position, cards)
}

const handleCardInfoUpdate = (newCardInfo: CardPositionInfo) => {
  cardInfo.eleft = { ...cardInfo.eleft, ...newCardInfo.eleft }
  cardInfo.emiddle = { ...cardInfo.emiddle, ...newCardInfo.emiddle }
  cardInfo.eright = { ...cardInfo.eright, ...newCardInfo.eright }
}
</script>

<template>
  <div class="content-cards" v-if="isChapterReady">
    <div v-for="data in selectedCards" :key="data.position">
      <EmptyCard v-if="!data.cards.length" />
      <div v-else-if="data.cards === 'no card'">
        <div class="empty-card-entity">
          <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-filter-entity-text') }}</p>
        </div>
        <BranchesFilter
          :model-value="branches[data.position as Position]"
          @update:model-value="branches[data.position as Position] = $event"
        />
      </div>
      <div v-else class="carousel-container">
        <div
          class="entity-card"
          :class="{
            wrong: Array.isArray(data.cards)
              ? !data.cards.some((c) => c?.id === cardInfo[data.position as Position].id)
              : false,
          }"
          :style="{ '--card-color': getColor(cardInfo[data.position as Position].branch) }"
        >
          <div class="card-name">
            <div>
              <span class="prefix">{{
                splitId(cardInfo[data.position as Position].about).prefix
              }}</span>
              <span class="name">{{
                splitId(cardInfo[data.position as Position].about).name
              }}</span>
            </div>
            <span class="image-card"
              ><img :src="getIcon(cardInfo[data.position as Position].branch ?? null)"
            /></span>
          </div>
          <EntitySuperclassesSubclasses
            :position="data.position"
            :cardInfo="cardInfo"
            @update:cardInfo="handleCardInfoUpdate"
            :superSubClasses="superSubClasses"
            :entityDataCards="entityDataCards"
          />
          <div class="scope-note">Scope Note</div>
        </div>
        <BranchesFilter
          :model-value="branches[data.position as Position]"
          @update:model-value="branches[data.position as Position] = $event"
        />
        <div class="range">
          <button type="button" @click="handlePrevious(data.position as Position, data.cards)">
            -
          </button>
          <input
            type="range"
            min="0"
            :max="data.cards?.length - 1"
            class="slider"
            :value="currentIndexes[data.position as Position]"
            @input="
              handleSliderChange(
                data.position as Position,
                Number(($event.target as HTMLInputElement).value),
                data.cards,
              )
            "
          />
          <div class="slider-buttons">
            <button type="button" @click="handleNext(data.position as Position, data.cards)">
              +
            </button>
          </div>
        </div>
        <div
          class="number"
          :class="{ active: index === currentIndexes[data.position as Position] }"
          v-for="(card, index) in data.cards"
          :key="index"
        >
          {{ data.cards.length }}/{{ data.totalCards }}
        </div>
      </div>
    </div>
  </div>

  <div v-else>Aucun chapitre disponible</div>
</template> -->

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import { useBoardCards } from '@/composables/useSelectedCards'
import { useCardNavigation } from '@/composables/useCardnavigation'
import type { CardInfo, CardPositionInfo, EntityPosition, Position } from '@/types/card/cardInfo'
import type { Branch } from '@/types/card/branch'
import EntityCard from './EntityCard.vue'
import PropertyCard from './PropertyCard.vue'

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardInfo[]
}>()

const chapterStore = useChapterData()

const branches = reactive<Record<EntityPosition, string[]>>({
  eleft: ['entity'],
  emiddle: ['entity'],
  eright: ['entity'],
})

const cardInfo = reactive<Record<Position, CardInfo>>({
  eleft: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  emiddle: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  eright: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  pleft: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  pright: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
})

// Utilisation de useBoardCards pour combiner entities et properties
const { boardCards } = useBoardCards(
  chapterStore.chapterData,
  props.entityDataCards,
  props.propertyDataCards,
  branches,
)

// Utilisation de useCardNavigation pour gérer la navigation
const { currentIndexes, updateCardInfo, handlePrevious, handleNext, handleSliderChange } =
  useCardNavigation(boardCards, cardInfo)

// Watch pour mettre à jour les cardInfo quand boardCards change
watch(
  boardCards,
  (newCards) => {
    newCards.forEach((data) => {
      if (['eleft', 'pleft', 'emiddle', 'pright', 'eright'].includes(data.position)) {
        const position = data.position as Position
        if (data.cards && data.cards !== 'no card' && data.cards.length > 0) {
          // Reset l'index si on dépasse le nombre de cartes
          if (currentIndexes[position] >= data.cards.length) {
            currentIndexes[position] = 0
          }
          updateCardInfo(position, data.cards)
        }
      }
    })
  },
  { immediate: true, deep: true },
)

const handleCardInfoUpdate = (newCardInfo: CardPositionInfo) => {
  cardInfo.eleft = { ...cardInfo.eleft, ...newCardInfo.eleft }
  cardInfo.emiddle = { ...cardInfo.emiddle, ...newCardInfo.emiddle }
  cardInfo.eright = { ...cardInfo.eright, ...newCardInfo.eright }
}
</script>

<template>
  <div class="content-cards" v-if="chapterStore.chapterData">
    <div v-for="item in boardCards" :key="item.position">
      {{ console.log('item', cardInfo) }}
      <EntityCard
        v-if="item.type === 'entity'"
        :data="item"
        :branches="branches"
        :cardInfo="cardInfo"
        :currentIndexes="currentIndexes"
        :entityDataCards="entityDataCards"
        :handlePrevious="handlePrevious"
        :handleNext="handleNext"
        :handleSliderChange="handleSliderChange"
        @update:cardInfo="handleCardInfoUpdate"
      />

      <PropertyCard
        v-else
        :data="item"
        :branches="branches"
        :cardInfo="cardInfo"
        :currentIndexes="currentIndexes"
        :entityDataCards="propertyDataCards"
        :handlePrevious="handlePrevious"
        :handleNext="handleNext"
        :handleSliderChange="handleSliderChange"
        @update:cardInfo="handleCardInfoUpdate"
      />
    </div>
  </div>

  <div v-else>Aucun chapitre disponible</div>
</template>
