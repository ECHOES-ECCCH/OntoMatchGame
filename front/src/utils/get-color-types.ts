import { colors } from '@/assets/cards/colors.ts'
import type { BranchName } from '@/types/card/branch'

/**
 * Determines if a hex color is considered "light"
 * based on perceived luminance.
 */
const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '')

  // Ensure valid hex format (#RRGGBB)
  if (hex.length !== 6) return false

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Perceived luminance formula (human eye sensitivity)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  return luminance > 230
}

/**
 * Returns CSS variables for card styling based on branch colors.
 * Supports single branch, multiple branches (gradient), or fallback.
 */
export const getColor = (branches: BranchName[] | null | undefined): Record<string, string> => {
  const defaultColor = colors.entity.color

  // Fallback when no branches are provided
  if (!branches || branches.length === 0) {
    return {
      '--card-color': defaultColor,
      '--card-text-color': isLightColor(defaultColor) ? '#757575' : '#ffffff',
    }
  }

  // Fallback if no valid branch exists
  const validBranches = branches.filter((b): b is BranchName => b in colors)

  // Single branch → solid color
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

  // Multiple branches → gradient (max 3 colors)
  const branchColors = validBranches.slice(0, 3).map((b) => colors[b]?.color)
  const firstColor = branchColors[0] ?? defaultColor

  return {
    '--card-color': firstColor,
    '--card-gradient': `linear-gradient(to bottom, ${branchColors.join(', ')})`,
    '--card-text-color': isLightColor(firstColor) ? '#757575' : '#ffffff',
  }
}
