import { ref } from 'vue'
import type { ChapterStats } from '@/types/chapter'

export const showSolution = ref(false)
export const frozenStats = ref<ChapterStats | null>(null)

export function useSolution() {
  /**
   * Enables solution mode and stores a copy of the current chapter statistics.
   */
  const displaySolution = (chapterStats: ChapterStats) => {
    frozenStats.value = { ...chapterStats }
    showSolution.value = true
  }

  /**
   * Disables solution mode and clears the stored statistics snapshot.
   */
  const resetSolution = () => {
    showSolution.value = false
    frozenStats.value = null
  }

  return { showSolution, displaySolution, resetSolution, frozenStats }
}
