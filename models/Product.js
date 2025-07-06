const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String], // store Cloudinary URLs or local paths
  discount: {
    type: { type: String, enum: ['flat', 'percent'], default: 'flat' },
    value: Number,
    active: Boolean
  },
  crossSell: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  upSell: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Product', ProductSchema);
