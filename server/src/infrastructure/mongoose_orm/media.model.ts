import { model, Schema } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { createUuid } from './mongoose.helpers.js'
import { type Media, StatusType, statuses, storages, types, formats, mimetypes } from '#modules/media/media.domain.js'

const mediaSchema = new Schema({
  _id: { type: String, required: true, default: () => createUuid() },
  version: { type: Number, required: true, default: 1 },
  status: { type: String, required: true, enum: statuses, default: StatusType.PENDING },
  storage: { type: String, required: true, enum: storages },
  key: { type: String, required: true },
  checksum: { type: String, required: true, default: '__pending__' },
  originalName: { type: String, required: true },
  type: { type: String, required: true, enum: types },
  mimetype: { type: String, required: true, enum: mimetypes },
  format: { type: String, required: false, enum: formats, default: null },
  size: { type: Number, required: true, default: 0 },
  details: { type: Object, required: false, default: null },
  variants: { type: Object, required: false, default: null },
}, { 
  timestamps: true,
  strict: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

mediaSchema.plugin(mongooseLeanVirtuals)
mediaSchema.virtual('id').get(function () { return this._id })

export const MediaModel = model<Media>('Media', mediaSchema)
