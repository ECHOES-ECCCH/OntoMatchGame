export interface UserStats {
  chapterName: string
  lastChallengeId: string
  maxChallengeCount: string
  scenarioName: string
  maxPossibleScore: string
  score: string
}

export interface UserGlobalStats {
  scenarioName: string
  chapters: Array<UserStats>
  totalMaxScore: number
  totalScore: number
  totalLastChallenge: number
  totalMaxChallenge: number
  percentage: number
}
