import { model, Schema } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { createUuid } from './mongoose.helpers.js'
import type { MushroomMedia } from '#modules/mushroom-media/mushroom-media.domain.js'

const mushroomMediaSchema = new Schema({
  _id: { type: String, required: true, default: () => createUuid() },
  mushroomId: { type: String, required: true },
  mediaId: { type: String, required: true }
}, {
  timestamps: true,
  strict: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

mushroomMediaSchema.index({ mushroomId: 1, mediaId: 1 }, { unique: true })
mushroomMediaSchema.index({ mushroomId: 1 })
mushroomMediaSchema.index({ mediaId: 1 })

mushroomMediaSchema.plugin(mongooseLeanVirtuals)
mushroomMediaSchema.virtual('id').get(function () { return this._id })

export const MushroomMediaModel = model<MushroomMedia>('MushroomMedia', mushroomMediaSchema)
