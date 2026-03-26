import { ref } from 'vue'
import type { ChapterStats } from '@/types/chapter'

export const showSolution = ref(false)
export const frozenStats = ref<ChapterStats | null>(null)

export function useSolution() {
  const displaySolution = (chapterStats: ChapterStats) => {
    frozenStats.value = { ...chapterStats }
    showSolution.value = true
  }

  const resetSolution = () => {
    showSolution.value = false
    frozenStats.value = null
  }

  return { showSolution, displaySolution, resetSolution, frozenStats }
}
