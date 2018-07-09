const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 6,
    required: true
  },
  description: {
    type: [String],
    text: true,
    minlength: 7,
    required: true
  },
  model: {
    type: Number,
    minlength: 6,
    required: true,
    unique: true
  },
  rates: {
    pvp: {
      unit:       { type: Number, min: 1, required: true },
      collection: { type: Number, default: 1 }
    },
    cost:         { type: Number, default: 0}
  },
  setup: { keywords: String },
  specs: {
    amount: {
      collection: {
        isCollection: { type: Boolean, required: true },
        units:        { type: Number, min: 0 }
      },
      units:      { type: Number, min: 1 }
    },
    designer: {
      name:       { type: String, minlength: 4 },
      origin:     { type: String }
    },
    manufacturer: {
      name:       { type: String, minlength: 4 },
      origin:     { type: String }
    },
    measures: {
      weight:     { type: Number, min: 0 },
      height:     { type: Number, min: 0 },
      long:       { type: Number, min: 0 },
      width:      { type: Number, min: 0 }
    },
    year:  Number,
    color: String,
    odor:  String
  },
  created: { type: Number, default: Date.now() },
  notes: { type: String, minlength: 5 },
  summary: { type: String, minlength: 5 }
}, { usePushEach: true })

const Product = mongoose.model('Product', ProductSchema)

module.exports = { Product }
