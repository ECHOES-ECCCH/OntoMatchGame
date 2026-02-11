import { colors } from '@/assets/cards/colors.ts'

export const getColor = (branch: string) => {
  console.log(branch)
  return colors[branch]?.color ?? 'transparent'
}
