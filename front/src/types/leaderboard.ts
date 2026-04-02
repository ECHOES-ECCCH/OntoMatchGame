export interface Leaderboard {
  languages: [{ languageName: string; scenarii: LeaderBoardScenario }]
}

interface LeaderBoardScenario {
  scenario: [
    {
      scenarioName: string
      maximumScore: number
      playerData: PlayerData
    },
  ]
}

interface PlayerData {
  userName: string
  score: number
}
