export interface CreateSessionData {
  userId: string | null
  scenarioTitle: string
  chapterTitle: string
}

export interface UpdateSessionData {
  userId: string | null
  currentScenario: string
  currentChapter: string
  currentChallengeIndex: number
  currentScore: number
}
