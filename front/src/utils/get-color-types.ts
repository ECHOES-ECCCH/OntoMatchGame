import { colors } from '@/assets/cards/colors.ts'
import type { BranchName } from '@/types/card/branch'

const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '')

  if (hex.length !== 6) return false

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Luminance perceptuelle
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  return luminance > 230
}

export const getColor = (branches: BranchName[] | null | undefined): Record<string, string> => {
  const defaultColor = colors.entity.color

  if (!branches || branches.length === 0) {
    return {
      '--card-color': defaultColor,
      '--card-text-color': isLightColor(defaultColor) ? '#757575' : '#ffffff',
    }
  }

  const validBranches = branches.filter((b): b is BranchName => b in colors)

  if (validBranches.length === 0) {
    return {
      '--card-color': defaultColor,
      '--card-text-color': isLightColor(defaultColor) ? '#757575' : '#ffffff',
    }
  }

  if (validBranches.length === 1) {
    const color = colors[validBranches[0]!]?.color ?? defaultColor
    return {
      '--card-color': color,
      '--card-text-color': isLightColor(color) ? '#757575' : '#ffffff',
    }
  }

  const branchColors = validBranches.slice(0, 3).map((b) => colors[b]?.color)
  const firstColor = branchColors[0] ?? defaultColor

  return {
    '--card-color': firstColor,
    '--card-gradient': `linear-gradient(to bottom, ${branchColors.join(', ')})`,
    '--card-text-color': isLightColor(firstColor) ? '#757575' : '#ffffff',
  }
}
