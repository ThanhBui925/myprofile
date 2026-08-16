const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  service: { type: String },
  messageVi: { type: String },
  message: { type: String },
  lang: { type: String, default: 'vi' },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  isDownloaded: { type: Boolean, default: false },
  clickedAt: { type: Date },
  downloadToken: { type: String, unique: true, sparse: true },
  encryptedDriveUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
