import { colors } from '@/assets/cards/colors.js'

export const getColor = (branch: string) => {
  return colors[branch]?.color ?? 'transparent'
}
