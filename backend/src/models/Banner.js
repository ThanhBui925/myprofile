const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  titleVi: { type: String, required: true },
  titleEn: { type: String, required: true },
  subtitleVi: { type: String },
  subtitleEn: { type: String },
  imageUrl: { type: String, default: '' },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
