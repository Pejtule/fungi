import { model, Schema } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { createUuid } from './mongoose.helpers.js'
import type { Mushroom } from '#modules/mushroom/mushroom.domain.js'

const mushroomSchema = new Schema({
  _id: { type: String, required: true, default: () => createUuid() },
  kingdomId: { type: String, required: true },
  phylumId: { type: String, required: true },
  classId: { type: String, required: true },
  orderId: { type: String, required: true },
  familyId: { type: String, required: true },
  genusId: { type: String, required: true },
  speciesId: { type: String, required: true },
  latin: { type: String, required: true },
  cs: { type: String, required: false, default: null },
  galleryIds: { type: [String], required: true, default: [] }
}, {
  timestamps: true,
  strict: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

mushroomSchema.index({ speciesId: 1 })

mushroomSchema.plugin(mongooseLeanVirtuals)
mushroomSchema.virtual('id').get(function () { return this._id })

export const MushroomModel = model<Mushroom>('Mushroom', mushroomSchema)
