export interface Mushroom {
  id: string
  kingdomId: string
  phylumId: string
  classId: string
  orderId: string
  familyId: string
  genusId: string
  speciesId: string
  latin: string
  cs: string | null
  galleryIds: string[]
  createdAt: Date
  updatedAt: Date
}
