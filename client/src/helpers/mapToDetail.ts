import type { MushroomDetail } from '../types/Mushroom'

export const mapToDetail = <T extends MushroomDetail>(t: T) => ({
  sections: {
    hero: {
      title: t.cs,
      subtitle: t.latin,
      gallery: t.gallery,
    }
  },
  lineageIds: t.lineageIds,
  speciesId: t.speciesId
})
