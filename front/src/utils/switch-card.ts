export function switchCard<T extends { about: string }>(
  aboutValue: string,
  position: string,
  dataCards: T[],
  cardInfo: Record<string, T>,
): Record<string, T> | null {
  const newCard = dataCards.find((c) => c.about === aboutValue)

  if (!newCard) return null

  return {
    ...cardInfo,
    [position]: newCard,
  }
}
