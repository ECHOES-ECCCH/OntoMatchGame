export function splitStatement(statement?: string | null) {
  if (!statement) return { before: '', after: '' }

  const markers = ['Pour ce défi', 'For this challenge', 'Find classes and properties']

  let firstIndex = -1

  markers.forEach((marker) => {
    const index = statement.indexOf(marker)
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index
    }
  })

  if (firstIndex === -1) {
    return { before: statement.trim(), after: '' }
  }

  return {
    before: statement.slice(0, firstIndex).trim(),
    after: statement.slice(firstIndex).trim(),
  }
}
