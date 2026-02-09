import { colors } from '@/assets/cards/colors.js'

export const getColor = (branch) => {
  return colors[branch]?.color ?? 'transparent'
}
