export interface ChapterStats {
  scenarioName: string
  chapterName: string
  lastChallengeId: string
  maxChallengeCount: string
  score: string
  maxPossibleScore: string
}

export interface ChapterData {
  Statement?: string
  Title?: string
  Explanation?: string
  ELeftInit?: string
  EMiddleInit?: string
  ERightInit?: string
}
