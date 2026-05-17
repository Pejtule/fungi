import type { MushroomListItem } from '../types/Mushroom'
import type { CardProps } from '../components/Card'

export const mapToCard = <T extends MushroomListItem>(t: T): CardProps => ({
  id: t.id,
  title: t.cs,
  subtitle: t.latin,
  thumbnail: t.thumbnail
})
