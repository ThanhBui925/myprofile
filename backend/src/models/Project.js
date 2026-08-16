const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  titleVi: { type: String, required: true },
  titleEn: { type: String, required: true },
  slug: { type: String, unique: true },
  client: { type: String },
  industryVi: { type: String },
  industryEn: { type: String },
  technologies: [{ type: String }],
  descriptionVi: { type: String },
  descriptionEn: { type: String },
  challengeVi: { type: String },
  challengeEn: { type: String },
  solutionVi: { type: String },
  solutionEn: { type: String },
  resultVi: { type: String },
  resultEn: { type: String },
  images: [{ type: String }],
  videoUrl: { type: String },
  beforeImage: { type: String },
  afterImage: { type: String },
  isFeatured: { type: Boolean, default: false },
  isNDA: { type: Boolean, default: false }, // NDA: hide from public
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { timestamps: true });

projectSchema.pre('save', function(next) {
  if (this.isModified('titleEn')) {
    this.slug = slugify(this.titleEn, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
