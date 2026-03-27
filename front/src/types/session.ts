export interface CreateSessionData {
  userId: string | null
  scenarioTitle: string
  chapterTitle: string
}

export interface UpdateSessionData {
  userId: string
  currentScenario: string
  currentChapter: string
  currentChallengeIndex: number
  currentScore: number
}
