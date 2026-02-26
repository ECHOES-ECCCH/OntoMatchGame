<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useChapterData } from '@/composables/useChapter'
import { useBoardCards } from '@/composables/useSelectedCards'
import { useCardNavigation } from '@/composables/useCardnavigation'
import type {
  CardInfo,
  CardPositionInfo,
  CardPropertyInfo,
  EntityPosition,
  Position,
} from '@/types/card/cardInfo'
import EntityCard from './EntityCard.vue'
import PropertyCard from './PropertyCard.vue'

const props = defineProps<{
  entityDataCards: CardInfo[]
  propertyDataCards: CardPropertyInfo[]
}>()

const chapterStore = useChapterData()

const branches = reactive<Record<EntityPosition, string[]>>({
  eleft: ['entity'],
  emiddle: ['entity'],
  eright: ['entity'],
  pleft_domain: ['entity'],
  pleft_range: ['entity'],
  pright_domain: ['entity'],
  pright_range: ['entity'],
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
        const position = data?.position as Position
        if (data?.cards && data?.cards !== 'no card' && data.cards.length > 0) {
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
  cardInfo.pleft = { ...cardInfo.pleft, ...newCardInfo.pleft }
  cardInfo.pright = { ...cardInfo.pright, ...newCardInfo.pright }
}

const handleBranchesUpdate = ({ position, value }: { position: string; value: string[] }) => {
  branches[position as EntityPosition] = value
}
</script>

<template>
  <div class="content-cards" v-if="chapterStore.chapterData">
    <div v-for="item in boardCards" :key="item?.position">
      <EntityCard
        v-if="item?.type === 'entity'"
        :totalCards="item"
        :branches="branches"
        :cardInfo="cardInfo"
        :currentIndexes="currentIndexes"
        :entityDataCards="entityDataCards"
        :handlePrevious="handlePrevious"
        :handleNext="handleNext"
        :handleSliderChange="handleSliderChange"
        @update:cardInfo="handleCardInfoUpdate"
        @update:branches="handleBranchesUpdate"
      />

      <PropertyCard
        v-else
        :totalCards="item"
        :branches="branches"
        :cardInfo="cardInfo"
        :currentIndexes="currentIndexes"
        :entityDataCards="entityDataCards"
        :propertyDataCards="propertyDataCards"
        :handlePrevious="handlePrevious"
        :handleNext="handleNext"
        :handleSliderChange="handleSliderChange"
        @update:cardInfo="handleCardInfoUpdate"
        @update:branches="handleBranchesUpdate"
      />
    </div>
  </div>

  <div v-else>Aucun chapitre disponible</div>
</template>
