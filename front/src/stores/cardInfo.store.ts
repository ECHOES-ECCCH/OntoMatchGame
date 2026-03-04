import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { CardInfo, Position } from '@/types/card/cardInfo'

export const useCardInfoStore = defineStore('cardInfo', () => {
  const cardInfo = reactive<Record<Position, CardInfo>>({
    eleft: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
    emiddle: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
    eright: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
    pleft: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
    pright: { id: '', about: '', labels: {}, comment: '', subClasses: [], branch: null },
  })

  return { cardInfo }
})
