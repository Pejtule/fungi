import { model, Schema } from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { createUuid } from './mongoose.helpers.js'
import { ranks, type Taxon } from '#modules/taxon/taxon.domain.js'

const taxonSchema = new Schema({
  _id: { type: String, required: true, default: () => createUuid() },
  lineageIds: { type: [String], required: true, default: [] },
  hasChildren: { type: Boolean, required: true, default: false },
  parentId: { type: String, required: false, default: null },
  rank: { type: String, required: true, enum: ranks },
  latin: { type: String, required: true },
  cs: { type: String, required: false, default: null },
}, {
  timestamps: true,
  strict: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

taxonSchema.index({ rank: 1, latin: 1 }, { unique: true })

taxonSchema.plugin(mongooseLeanVirtuals)
taxonSchema.virtual('id').get(function () { return this._id })

export const TaxonModel = model<Taxon>('Taxon', taxonSchema)
