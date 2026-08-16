const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  nameVi: { type: String },
  nameEn: { type: String },
  poweredByVi: { type: String },
  poweredByEn: { type: String },
  aboutVi: { type: String },
  aboutEn: { type: String },
  founded: { type: String },
  history: [{
    year: String,
    titleVi: String,
    titleEn: String,
    descriptionVi: String,
    descriptionEn: String,
  }],
  visionVi: { type: String },
  visionEn: { type: String },
  missionVi: { type: String },
  missionEn: { type: String },
  valuesVi: [{ type: String }],
  valuesEn: [{ type: String }],
  team: [{
    nameVi: String,
    nameEn: String,
    positionVi: String,
    positionEn: String,
    image: String,
    linkedIn: String,
  }],
  certificates: [{
    nameVi: String,
    nameEn: String,
    imageUrl: String,
    issuedBy: String,
    year: String,
  }],
  videoUrl: { type: String },
  address: { type: String },
  addressVi: { type: String },
  addressEn: { type: String },
  phone: { type: String },
  email: { type: String },
  mapUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
