const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema({
  nameVi: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, unique: true },
  descriptionVi: { type: String },
  descriptionEn: { type: String },
  icon: { type: String }, // icon name from lucide or url
  images: [{ type: String }],
  videoUrl: { type: String },
  driveLink: { type: String },
  technologies: [{ type: String }],
  featuresVi: [{ type: String }],
  featuresEn: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  consultationRequests: [{ 
    name: String, 
    email: String, 
    phone: String, 
    company: String, 
    message: String,
    lang: { type: String, default: 'vi' },
    createdAt: { type: Date, default: Date.now } 
  }],
}, { timestamps: true });

serviceSchema.pre('save', function(next) {
  if (this.isModified('nameEn')) {
    this.slug = slugify(this.nameEn, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
