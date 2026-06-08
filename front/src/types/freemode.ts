export interface BoardCards {
  ZoomLevel: number
  Entities: {
    ontology: string
    Id: string
    Position: {
      x: number
      y: number
    }
    Rotation: number
    Kind: string
    Card: {
      id: string
      about: string
      labels: {
        el: string
        en: string
        de: string
        ru: string
        fr: string
        pt: string
        zh: string
      }
      comment: string
      subClasses: []
      onlineResource: string
      branch: string[]
      kind: string
    }
  }[]

  Properties: {
    ontology: string
    Id: string
    Position: {
      x: number
      y: number
    }
    Rotation: number
    Kind: string
    Card: {
      id: string
      about: string
      labels: {
        en: string
        de: string
        el: string
        fr: string
        pt: string
        ru: string
        zh: string
      }
      comment: string
      domain: string
      range: string
      subPropertyOf: []
      inverseOf: string[]
      onlineResource: null
      kind: string
    }
  }[]

  Instances: {
    ontology: string
    Id: string
    Position: {
      x: number
      y: number
    }
    Rotation: number
    Kind: string
    Card: {
      Id: string
      Title: string
      Label: string
      ImageName: string
      kind: string
    }
  }[]
}

export interface FreeModeBoard {
  freemodeId?: string
  title: string
  ontologyName: string
  ZoomLevel: number
  freemodeData: BoardCards
}
