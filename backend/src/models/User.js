const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 6 }, // Made optional for social auth users
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  // Lịch sử tương tác
  consultations: [{
    service: String,
    message: String,
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  }],
  quoteRequests: [{
    product: String,
    email: String,
    quantity: Number,
    message: String,
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    isDownloaded: { type: Boolean, default: false },
    clickedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
