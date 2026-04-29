export interface ChapterStats {
  userId: string
  scenarioName: string
  ontologyName: string
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
  Score?: number
  ELeftInit?: string
  EMiddleInit?: string
  ERightInit?: string
  PLeftInit?: string
  PRightInit?: string
}
