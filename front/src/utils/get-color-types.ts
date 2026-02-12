import { colors } from '@/assets/cards/colors.ts'

export const getColor = (branch: string) => {
  return colors[branch]?.color ?? 'transparent'
}
