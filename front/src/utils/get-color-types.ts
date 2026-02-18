import { colors } from '@/assets/cards/colors.ts'

// export const getColor = (branches: Branch[] | null | undefined): string[] => {
//   if (!branches || branches.length === 0) {
//     return [colors.entity.color]
//   }

//   return branches.map((b) => colors[b]?.color).filter((color): color is string => Boolean(color))
// }

export const getColor = (branches: Branch[] | null | undefined): string => {
  if (!branches || branches.length === 0) {
    return colors.entity.color
  }

  // Filtrer les branches valides qui ont une couleur
  const validBranches = branches.filter((b) => colors[b]?.color)

  if (validBranches.length === 0) {
    return colors.entity.color
  }

  if (validBranches.length === 1) {
    return colors[validBranches[0]]?.color ?? colors.entity.color
  }

  // Si 2 couleurs ou plus, retourner un dégradé
  const branchColors = validBranches.slice(0, 3).map((b) => colors[b].color)

  return `linear-gradient(to bottom, ${branchColors.join(', ')})`
}
