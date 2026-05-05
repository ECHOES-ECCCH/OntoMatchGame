export interface Leaderboard {
  languages: Array<{ languageName: string; scenarii: LeaderBoardScenario }>
}

export interface LeaderboardLanguage {
  languageName: string
  scenarii: LeaderBoardScenario
}

interface LeaderBoardScenario {
  scenario: Array<{
    scenarioName: string
    ontologyName: string
    maximumScore: number
    playerData: PlayerData[]
  }>
}

interface PlayerData {
  username: string
  score: number
}
