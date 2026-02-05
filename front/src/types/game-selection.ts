export interface Chapter {
  chapterName?: string
  'chapter-title': string
  'chapter-description': string
  'chapter-filename': string
}

export interface Scenario {
  'scenario-title': string
  'scenario-description': string
  ontologyTags: string[]
  domainTags: string[]
  domainCodes: string[]
  authorTags: string[]
  languageTag: string
  chapters: Chapter[]
}

export interface ScenarioCatalog {
  scenarii: Scenario[]
}
