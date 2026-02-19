import { colors } from '@/assets/cards/colors.ts'

// export const getColor = (branches: Branch[] | null | undefined): string[] => {
//   if (!branches || branches.length === 0) {
//     return [colors.entity.color]
//   }

//   return branches.map((b) => colors[b]?.color).filter((color): color is string => Boolean(color))
// }

export const getColor = (branches: Branch[] | null | undefined): Record<string, string> => {
  if (!branches || branches.length === 0) {
    return { '--card-color': colors.entity.color }
  }

  const validBranches = branches.filter((b) => colors[b]?.color)

  if (validBranches.length === 0) {
    return { '--card-color': colors.entity.color }
  }

  if (validBranches.length === 1) {
    const color = colors[validBranches[0]]?.color ?? colors.entity.color
    return { '--card-color': color }
  }

  const branchColors = validBranches.slice(0, 3).map((b) => colors[b].color)

  return {
    '--card-color': branchColors[0], // couleur principale pour border/text
    '--card-gradient': `linear-gradient(to bottom, ${branchColors.join(', ')})`,
  }
}
