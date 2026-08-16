const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  nameVi: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, unique: true },
  categoryVi: { type: String },
  categoryEn: { type: String },
  descriptionVi: { type: String },
  descriptionEn: { type: String },
  specifications: [{
    labelVi: String,
    labelEn: String,
    value: String,
  }],
  images: [{ type: String }],
  catalogUrl: { type: String }, // PDF catalog file if any
  driveUrl: { type: String, default: '' }, // Secret document link (Google Drive / OneDrive)
  zipPassword: { type: String, default: '' }, // Extraction password for file
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  priceRequests: [{
    name: String,
    email: String,
    phone: String,
    company: String,
    quantity: Number,
    message: String,
    lang: { type: String, default: 'vi' },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

courseSchema.pre('save', function(next) {
  if (this.isModified('nameEn')) {
    this.slug = slugify(this.nameEn, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
